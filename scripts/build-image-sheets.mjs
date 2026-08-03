/**
 * Builds numbered contact sheets of every catalogue image, so the branded ones
 * can be identified by eye.
 *
 * OCR (see find-branded-images.mjs) only found 3 of them. It cannot read a logo
 * moulded into a curved, glossy helmet — the Vista helmet, which visibly
 * carries one, came back as noise. Eyeballing ~40 thumbnails at a time is both
 * faster and accurate, so this produces the sheets plus an index that maps
 * every tile number back to its product.
 *
 * Output:
 *   scripts/image-sheets/sheet-NN.webp   — numbered thumbnails
 *   scripts/image-sheets/INDEX.md        — tile number -> product + page + file
 *
 * Run with: npm run audit:sheets
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(__dirname, "image-sheets");
mkdirSync(OUT, { recursive: true });

const products = JSON.parse(
  readFileSync(join(ROOT, "src", "data", "products.json"), "utf8"),
);

/** Unique images, each with the products that use it. */
const byImage = new Map();
for (const p of products) {
  for (const img of p.images) {
    if (!byImage.has(img.src)) byImage.set(img.src, []);
    byImage.get(img.src).push(p);
  }
}

// Group by category so a reviewer sees like with like — helmets together,
// gloves together — which makes a repeated logo much easier to spot.
const entries = [...byImage.entries()].sort((a, b) => {
  const ca = a[1][0].mainCategory;
  const cb = b[1][0].mainCategory;
  return ca.localeCompare(cb) || a[0].localeCompare(b[0]);
});

const CELL = 240;
const LABEL = 26;
const COLS = 8;
const ROWS = 6;
const PER_SHEET = COLS * ROWS;

const index = [];
let sheetNo = 0;

for (let i = 0; i < entries.length; i += PER_SHEET) {
  const batch = entries.slice(i, i + PER_SHEET);
  const layers = [];

  for (let j = 0; j < batch.length; j++) {
    const [src, prods] = batch[j];
    const tileNo = i + j + 1;
    const file = join(ROOT, "public", src.replace(/\.webp$/, "-400.webp"));
    if (!existsSync(file)) continue;

    const col = j % COLS;
    const row = Math.floor(j / COLS);
    const x = col * CELL;
    const y = row * (CELL + LABEL);

    try {
      const img = await sharp(file)
        .resize(CELL - 8, CELL - 8, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255 },
        })
        .toBuffer();
      layers.push({ input: img, left: x + 4, top: y + 4 });
    } catch {
      continue;
    }

    // Tile number, rendered as SVG text under each thumbnail.
    const label = Buffer.from(
      `<svg width="${CELL}" height="${LABEL}">
         <rect width="${CELL}" height="${LABEL}" fill="#111"/>
         <text x="6" y="18" font-family="monospace" font-size="15" fill="#fff">#${tileNo}</text>
       </svg>`,
    );
    layers.push({ input: label, left: x, top: y + CELL - 4 });

    index.push({
      tile: tileNo,
      sheet: sheetNo,
      src,
      products: prods.map((p) => ({ name: p.name, slug: p.slug, cat: p.mainCategory })),
    });
  }

  await sharp({
    create: {
      width: CELL * COLS,
      height: (CELL + LABEL) * ROWS,
      channels: 3,
      background: { r: 235, g: 238, b: 242 },
    },
  })
    .composite(layers)
    .webp({ quality: 76 })
    .toFile(join(OUT, `sheet-${String(sheetNo).padStart(2, "0")}.webp`));

  sheetNo++;
}

/* ---- index ---- */
let md = `# Catalogue image index\n\n`;
md += `${entries.length} unique images across ${sheetNo} contact sheets.\n\n`;
md += `Open \`sheet-NN.webp\`, note the \`#number\` under any thumbnail showing the\n`;
md += `old supplier's logo, and look it up here.\n\n`;
md += `| # | Sheet | Product(s) | Category | Image file |\n`;
md += `| --: | --: | --- | --- | --- |\n`;

for (const row of index) {
  const names = row.products.map((p) => `${p.name} (\`/product/${p.slug}\`)`).join("<br>");
  md += `| ${row.tile} | ${row.sheet} | ${names} | ${row.products[0].cat} | \`${row.src}\` |\n`;
}

writeFileSync(join(OUT, "INDEX.md"), md);
writeFileSync(join(OUT, "index.json"), JSON.stringify(index, null, 1));

console.log(`${entries.length} images -> ${sheetNo} sheets in scripts/image-sheets/`);
console.log(`Index written to scripts/image-sheets/INDEX.md`);
