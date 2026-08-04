/**
 * Builds the hero assets.
 *
 * Two scene renders (no text in them — see below) plus the client's logo
 * lockup, extracted once from their original artwork.
 *
 * Why the scenes carry no text: the first artwork had the wordmark, headline
 * and four feature labels baked into the pixels. That meant the copy blurred
 * when scaled, was invisible to crawlers and screen readers, could not reflow
 * on a phone, and a typo in it ("Fire Saftey") could only be fixed by
 * regenerating the whole image. The scenes now reserve empty space instead and
 * the type is rendered as real HTML over it.
 *
 * The logo itself is genuinely graphical — a custom wordmark, swoosh and
 * mascot — so it stays an image, cropped out of the original artwork.
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

/** Text-free scene renders. */
const SCENES = [
  {
    name: "scene-landscape",
    file: "cf0107ae-1e77-4756-b2ca-296247b4423b.png",
    widths: [1280, 1920, 2560],
  },
  {
    name: "scene-portrait",
    file: "301f256a-8622-4170-9f28-01e15ec1e975.png",
    widths: [640, 900, 1200],
  },
];

/**
 * The logo lockup, cropped from the client's original banner.
 * Bounds cover wordmark + swoosh + flame + tagline + mascot with a little air.
 */
const LOGO = {
  file: "592556fd-1eb0-4db0-a636-25a940eb8e90.png",
  extract: { left: 130, top: 62, width: 706, height: 330 },
  widths: [420, 700],
};

const meta = {};

for (const scene of SCENES) {
  const src = join(SRC_DIR, scene.file);
  if (!existsSync(src)) {
    console.log(`✗ ${scene.name} — not found: ${src}`);
    continue;
  }

  const info = await sharp(src).metadata();
  for (const w of scene.widths) {
    await sharp(src)
      .resize({ width: Math.min(w, info.width ?? w), withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(join(OUT, `${scene.name}-${w}.webp`));
  }

  meta[scene.name] = { width: info.width, height: info.height, widths: scene.widths };
  console.log(`✓ ${scene.name.padEnd(18)} ${info.width}x${info.height}`);
}

/* ---- logo lockup ---- */
{
  const src = join(SRC_DIR, LOGO.file);
  if (existsSync(src)) {
    /*
     * The lockup is artwork on a near-black plate. Dropped in as-is it shows
     * a visible rectangle over the scene, and `mix-blend-mode: screen` cannot
     * fix that in the page — the element also carries an entrance animation,
     * and `opacity` creates a stacking context that isolates the blend.
     *
     * So the transparency is baked in here instead: luminance becomes the
     * alpha channel, which is what `screen` would have computed anyway. Black
     * plate goes fully transparent, the red and white stay solid, and the
     * mascot's soft edges and the flame's glow keep their natural falloff
     * rather than being hard-cut by a threshold.
     */
    for (const w of LOGO.widths) {
      const base = sharp(src).extract(LOGO.extract).resize({ width: w });

      const rgb = await base.clone().removeAlpha().toBuffer();
      const alpha = await base
        .clone()
        .greyscale()
        // Lift mid-tones so the artwork stays fully opaque while the plate
        // still falls to zero; without the gain, red-on-black reads as
        // semi-transparent and the logo looks washed out.
        .linear(2.6, -12)
        .toBuffer();

      await sharp(rgb)
        .joinChannel(alpha)
        .png({ compressionLevel: 9 })
        .toFile(join(OUT, `logo-lockup-${w}.png`));
    }
    meta.logoLockup = { ...LOGO.extract, widths: LOGO.widths };
    console.log(`✓ logo-lockup       ${LOGO.extract.width}x${LOGO.extract.height}`);
  } else {
    console.log(`✗ logo lockup — source not found`);
  }
}

writeFileSync(join(OUT, "meta.json"), JSON.stringify(meta, null, 2));
console.log("\nHero assets written to public/banner/");
