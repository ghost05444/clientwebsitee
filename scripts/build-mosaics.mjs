/**
 * Pre-renders the atmospheric product mosaics into flat WebP textures.
 *
 * Doing this in the browser (a grid of <img> under `filter: blur(30px)`) cost
 * roughly three quarters of the frame budget: the compositor re-blurred a
 * full-viewport stack of ~28 images on every scroll frame. Baking the same
 * look into one image at build time makes it a single ordinary layer, and the
 * blur cost disappears entirely.
 *
 * Run with: npm run mosaics   (also wired into `prebuild`)
 */
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "bg");
mkdirSync(OUT, { recursive: true });

const products = JSON.parse(
  readFileSync(join(ROOT, "src", "data", "products.json"), "utf8"),
);

const WIDTH = 1280;
const HEIGHT = 800;
const COLS = 7;
const ROWS = 5;
const BLUR = 44;

/** One texture per placement, so adjacent sections never show the same tiles. */
const VARIANTS = [
  { name: "mosaic-hero", offset: 11 },
  { name: "mosaic-dark", offset: 140 },
  { name: "mosaic-light", offset: 60 },
];

const withImages = products.filter((p) => p.images.length > 0);

/**
 * The catalogue contains a few near-blank shots — including a literal
 * "No image available" graphic. They are invisible in a product grid but
 * obvious as flat rectangles in a mosaic, so they are filtered by entropy.
 */
const MIN_ENTROPY = 2.2;

async function isUsable(src) {
  const file = join(ROOT, "public", src.replace(/\.webp$/, "-400.webp"));
  if (!existsSync(file)) return false;
  try {
    const { entropy } = await sharp(file).stats();
    return entropy >= MIN_ENTROPY;
  } catch {
    return false;
  }
}

/** Stride through the catalogue so a mosaic spans categories. */
async function pick(count, offset) {
  const stride = Math.max(1, Math.floor(withImages.length / count));
  const out = [];

  for (let i = 0; out.length < count && i < withImages.length; i++) {
    const item = withImages[(offset + i * stride) % withImages.length];
    if (!item) continue;
    const src = item.images[0].src;
    if (out.includes(src)) continue;
    if (await isUsable(src)) out.push(src);
  }
  return out;
}

const cellW = Math.ceil(WIDTH / COLS);
const cellH = Math.ceil(HEIGHT / ROWS);

for (const variant of VARIANTS) {
  const outPath = join(OUT, `${variant.name}.webp`);
  if (existsSync(outPath)) {
    console.log(`· ${variant.name} — already built`);
    continue;
  }

  const srcs = await pick(COLS * ROWS, variant.offset);
  const layers = [];

  for (let i = 0; i < srcs.length; i++) {
    const file = join(ROOT, "public", srcs[i].replace(/\.webp$/, "-400.webp"));
    if (!existsSync(file)) continue;

    try {
      const tile = await sharp(file)
        .resize(cellW, cellH, { fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();

      const col = i % COLS;
      const row = Math.floor(i / COLS);
      layers.push({
        input: tile,
        left: col * cellW,
        // Stagger rows so the grid does not read as a table.
        top: Math.max(0, Math.min(HEIGHT - cellH, row * cellH + ((i % 3) - 1) * 18)),
      });
    } catch {
      // Skip any tile that fails to decode.
    }
  }

  /*
   * Two passes, deliberately.
   *
   * sharp applies `composite` at the very end of a pipeline, so chaining
   * `.composite(layers).blur()` blurs the blank base and then paints the tiles
   * on top perfectly sharp — the mosaic came out as a legible product grid.
   * Flattening to a buffer first, then blurring that, is what actually blurs
   * the composed image.
   */
  const composed = await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { r: 14, g: 20, b: 28, alpha: 1 },
    },
  })
    .composite(layers)
    .png()
    .toBuffer();

  await sharp(composed)
    .blur(BLUR)
    // Desaturate hard — this is texture, not product photography.
    .modulate({ saturation: 0.25 })
    .webp({ quality: 60, effort: 6 })
    .toFile(outPath);

  console.log(`✓ ${variant.name}  ${layers.length} tiles  ${WIDTH}x${HEIGHT}`);
}

console.log("\nMosaic textures ready in public/bg/");
