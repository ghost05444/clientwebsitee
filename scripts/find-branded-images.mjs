/**
 * Finds product images that still carry the previous supplier's logo.
 *
 * The catalogue text and slugs were de-branded in the data pipeline, but the
 * logo is *printed on the products themselves* in a number of the photographs.
 * Those can only be found by looking at the pixels, so this runs OCR over every
 * unique product image and reports any hit.
 *
 * Output: scripts/branded-images-report.md — a checklist of affected products
 * with their image paths, ready to hand to whoever is sourcing replacements.
 *
 * Run with: npm run audit:images
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createWorker } from "tesseract.js";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CACHE = join(__dirname, "ocr-cache.json");

const products = JSON.parse(
  readFileSync(join(ROOT, "src", "data", "products.json"), "utf8"),
);

/*
 * OCR garbles small logo text constantly, so matching is deliberately loose:
 * the brand plus the misreadings it reliably produces. Every hit is reported
 * with the raw text so a human can confirm rather than trust it blindly.
 */
const PATTERNS = [
  /\budy?[o0]g[il1]\b/i,
  /\budyog\b/i,
  /\bud[yv][o0]g[il1]/i,
  /\buoyogi\b/i,
  /\budyoc[il1]\b/i,
];

const looksBranded = (text) => PATTERNS.some((re) => re.test(text));

/** Every unique image in the catalogue, with the products that use it. */
const byImage = new Map();
for (const p of products) {
  for (const img of p.images) {
    if (!byImage.has(img.src)) byImage.set(img.src, []);
    byImage.get(img.src).push(p);
  }
}

const images = [...byImage.keys()];
console.log(`Scanning ${images.length} unique images with OCR...`);

const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, "utf8")) : {};

const worker = await createWorker("eng");
let scanned = 0;
let cached = 0;
const hits = [];

for (const src of images) {
  let text = cache[src];

  if (text === undefined) {
    // Use the 900px variant — the logo is small, and 400px loses it entirely.
    const file = join(ROOT, "public", src.replace(/\.webp$/, "-900.webp"));
    if (!existsSync(file)) {
      cache[src] = "";
      continue;
    }

    try {
      // Upscale and boost contrast; OCR is far more reliable on crisp,
      // high-contrast input than on a small photo of a moulded logo.
      const prepped = await sharp(file)
        .resize({ width: 1400, withoutEnlargement: false })
        .greyscale()
        .normalise()
        .sharpen()
        .png()
        .toBuffer();

      const { data } = await worker.recognize(prepped);
      text = data.text.replace(/\s+/g, " ").trim();
    } catch {
      text = "";
    }

    cache[src] = text;
    scanned++;

    if (scanned % 25 === 0) {
      writeFileSync(CACHE, JSON.stringify(cache));
      console.log(`  ${scanned + cached}/${images.length}  hits so far: ${hits.length}`);
    }
  } else {
    cached++;
  }

  if (text && looksBranded(text)) {
    const match = PATTERNS.map((re) => text.match(re)).find(Boolean);
    hits.push({ src, products: byImage.get(src), matched: match?.[0] ?? "", text });
  }
}

await worker.terminate();
writeFileSync(CACHE, JSON.stringify(cache));

/* ---- report ---- */

// Group by product so the client gets a product checklist, not an image dump.
const byProduct = new Map();
for (const hit of hits) {
  for (const p of hit.products) {
    if (!byProduct.has(p.slug)) byProduct.set(p.slug, { product: p, images: [] });
    byProduct.get(p.slug).images.push(hit);
  }
}

const rows = [...byProduct.values()].sort((a, b) =>
  a.product.name.localeCompare(b.product.name),
);

let md = `# Product images carrying the previous supplier's logo\n\n`;
md += `OCR scan of all ${images.length} unique catalogue images.\n\n`;
md += `- **${rows.length} products** affected\n`;
md += `- **${hits.length} images** to replace\n\n`;
md += `The logo is printed on the product in these shots, so it cannot be removed\n`;
md += `in the data pipeline — each needs a replacement photograph.\n\n`;
md += `OCR is not perfect: it will miss logos that are small, angled or\n`;
md += `low-contrast, and can occasionally misfire. Treat this as a starting\n`;
md += `checklist and confirm each one by eye. The raw OCR text is included so you\n`;
md += `can see what triggered the match.\n\n`;
md += `---\n\n`;
md += `| # | Product | Category | Page | Image file |\n`;
md += `| --: | --- | --- | --- | --- |\n`;

rows.forEach((row, i) => {
  const { product, images: imgs } = row;
  const files = imgs.map((h) => `\`${h.src}\``).join("<br>");
  md += `| ${i + 1} | ${product.name} | ${product.mainCategory} | [/product/${product.slug}](/product/${product.slug}) | ${files} |\n`;
});

md += `\n---\n\n## OCR detail\n\n`;
for (const row of rows) {
  md += `### ${row.product.name}\n\n`;
  for (const h of row.images) {
    md += `- \`${h.src}\` — matched **${h.matched}**\n`;
    md += `  > ${h.text.slice(0, 200)}\n`;
  }
  md += `\n`;
}

writeFileSync(join(__dirname, "branded-images-report.md"), md);

console.log(`\nDone. ${scanned} newly scanned, ${cached} from cache.`);
console.log(`${rows.length} products / ${hits.length} images carry the logo.`);
console.log(`Report: scripts/branded-images-report.md`);
