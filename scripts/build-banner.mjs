/**
 * Imports the client-supplied hero banners and emits responsive WebP.
 *
 * Two separate artworks, not one image cropped: the portrait version stacks
 * logo -> headline -> feature icons -> product shot, the landscape version sets
 * them side by side. Both carry baked-in text (the wordmark, "PROTECTING WHAT
 * MATTERS. EVERYDAY." and the four feature labels), so they must be rendered
 * complete and never cropped — art direction, not `object-fit: cover`.
 *
 * Source files are read from wherever the client dropped them; pass a directory
 * as argv[2] to override.
 *
 * Run with: npm run banner
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "banner");
const SRC_DIR = process.argv[2] || "C:/Users/rahul/Downloads";
mkdirSync(OUT, { recursive: true });

const BANNERS = [
  {
    name: "hero-portrait",
    file: "592556fd-1eb0-4db0-a636-25a940eb8e90.png",
    widths: [640, 900, 1200],
  },
  {
    name: "hero-landscape",
    file: "c6615840-ffe8-46e6-8f76-af49af04ea79.png",
    widths: [1200, 1700, 2400],
  },
];

const meta = {};

for (const banner of BANNERS) {
  const src = join(SRC_DIR, banner.file);
  if (!existsSync(src)) {
    console.log(`✗ ${banner.name} — source not found: ${src}`);
    continue;
  }

  const info = await sharp(src).metadata();

  for (const w of banner.widths) {
    await sharp(src)
      .resize({ width: Math.min(w, info.width ?? w), withoutEnlargement: true })
      // Quality is high here on purpose: the artwork contains small rendered
      // text (the feature labels), which is the first thing WebP artefacts
      // show up on.
      .webp({ quality: 88, effort: 6 })
      .toFile(join(OUT, `${banner.name}-${w}.webp`));
  }

  meta[banner.name] = { width: info.width, height: info.height, widths: banner.widths };
  console.log(`✓ ${banner.name.padEnd(16)} ${info.width}x${info.height}  ->  ${banner.widths.join(", ")}`);
}

writeFileSync(join(OUT, "meta.json"), JSON.stringify(meta, null, 2));
console.log("\nBanners written to public/banner/");
