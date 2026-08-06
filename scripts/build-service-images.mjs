/**
 * Processes the client's own photography for the eight Krushnam offerings
 * listed under "Other Products" (see CURATED in build-data.mjs).
 *
 * Catalogue imagery is mirrored from a remote URL by `npm run images`. These
 * eight are supplied by the client as files instead, so they get their own
 * step. Output matches the catalogue exactly — a -400 and a -900 WebP per
 * image — because ProductImage derives both variants from one base path and
 * does not care where the source came from.
 *
 * Drop the eight source files (jpg/png/webp, any size) into a folder named
 * with the slugs below, then run:
 *
 *   npm run service-images -- "C:/path/to/folder"
 *
 * Defaults to the client's Downloads folder, like the banner and icon steps.
 * Missing files are reported and skipped, so this can be run repeatedly as
 * images arrive rather than needing all eight at once.
 *
 * Run with: npm run service-images
 */
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "media", "services");
const SRC_DIR = process.argv[2] || "C:/Users/rahul/Downloads";

/** Must match the `image` field of each entry in build-data.mjs's CURATED. */
const SLUGS = [
  "fire-extinguisher-supply",
  "extinguisher-refilling-and-hydrotest",
  "fire-hydrant-system",
  "ppe-supply",
  "maintenance-and-inspection",
  "safety-signage",
  "fire-safety-training",
  "ceramic-fiber-insulation",
];

const EXTS = [".jpg", ".jpeg", ".png", ".webp"];

mkdirSync(OUT, { recursive: true });

if (!existsSync(SRC_DIR)) {
  console.error(`Source folder not found: ${SRC_DIR}`);
  process.exit(1);
}

/** Case-insensitive lookup of `<slug>.<ext>` in the source folder. */
const available = readdirSync(SRC_DIR);
const find = (slug) =>
  available.find((f) => {
    const ext = extname(f).toLowerCase();
    return EXTS.includes(ext) && f.slice(0, -ext.length).toLowerCase() === slug;
  });

let done = 0;
const missing = [];

for (const slug of SLUGS) {
  const file = find(slug);
  if (!file) {
    missing.push(slug);
    continue;
  }

  const src = join(SRC_DIR, file);

  /*
   * `contain` onto white rather than `cover`: these are mixed sources — an
   * isolated studio extinguisher, a wide landscape of a pump room, a square
   * training shot. Cropping to square would cut the subject out of the wide
   * ones. ProductImage already renders inside a square `object-contain` box,
   * so letterboxing here matches how the rest of the catalogue behaves.
   */
  for (const size of [400, 900]) {
    await sharp(src)
      .resize(size, size, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
        /*
         * Deliberately NOT `withoutEnlargement`. With `contain` that flag
         * keeps the canvas at the requested size but refuses to scale the
         * image up, so a source smaller than the target ends up marooned in
         * the middle of it — the 360x360 refilling photo filled 16% of its
         * 900x900 canvas and rendered as a stamp on a white field wherever a
         * browser picked the 900w variant. Upscaling a small source is a
         * little soft; a tiny image in a sea of white is simply broken.
         */
      })
      .webp({ quality: 82, effort: 6 })
      .toFile(join(OUT, `${slug}-${size}.webp`));
  }

  const meta = await sharp(src).metadata();
  console.log(`✓ ${slug.padEnd(38)} ${meta.width}x${meta.height} -> 400 + 900`);
  done++;
}

console.log(`\n${done}/${SLUGS.length} images written to public/media/services/`);

if (missing.length) {
  console.log(`\nStill needed in ${SRC_DIR} (any of ${EXTS.join(", ")}):`);
  for (const slug of missing) console.log(`  ${slug}.jpg`);
  console.log(
    `\nThese products render a placeholder until their image is present.\n` +
      `Re-run 'npm run data' after adding images so the catalogue picks them up.`,
  );
}
