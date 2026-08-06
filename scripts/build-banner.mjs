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
 * ── Why the filenames carry a content hash ───────────────────────────────
 * netlify.toml serves /banner/* with `max-age=31536000, immutable`. That is
 * only a truthful claim about a URL whose content can never change, and
 * `immutable` means browsers will not revalidate even on reload. Emitting
 * these under stable names broke exactly that promise: a corrected logo
 * deployed to the same URL stayed invisible to anyone who had already loaded
 * the old one, with no way to push the new file to them.
 *
 * Hashing the bytes into the filename makes the URL change whenever the
 * artwork does, so `immutable` becomes true and a fix reaches everyone on
 * their next visit. `src/data/banner.json` maps the logical names to the
 * hashed files for the component to import.
 *
 * Run with: npm run banner
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "banner");
const MANIFEST = join(ROOT, "src", "data", "banner.json");
const SRC_DIR = process.argv[2] || "C:/Users/rahul/Downloads";
mkdirSync(OUT, { recursive: true });

/** Text-free scene renders. */
const SCENES = [
  {
    key: "sceneLandscape",
    name: "scene-landscape",
    file: "c3b113b4-50dc-47ac-ad03-de01d93046c3.png",
    widths: [1280, 1920, 2560],
  },
  {
    key: "scenePortrait",
    name: "scene-portrait",
    file: "613ce9ca-e975-4cfb-a09e-2848522812d4.png",
    widths: [640, 900, 1200],
  },
];

/**
 * The logo lockup, cropped from the client's original banner.
 *
 * These bounds are measured, not eyeballed. Thresholding the source's
 * luminance and taking the bounding box of everything above the plate puts the
 * artwork at x 13..953, y 53..398 — wordmark, swoosh, flame, tagline and
 * mascot. The values below add ~6px of air on three sides.
 *
 * The earlier crop (x 130..835) was guessed and chopped 117px off the left and
 * 118px off the right, cutting through the swoosh's lower-left tail and the
 * mascot's hose and spray.
 *
 * The bottom is deliberately tight: the banner's baked-in "PROTECTING"
 * headline starts at y=400, only two pixels below the mascot's boots, so any
 * extra margin drags the top of that lettering into the lockup.
 */
const LOGO = {
  key: "logoLockup",
  name: "logo-lockup",
  file: "592556fd-1eb0-4db0-a636-25a940eb8e90.png",
  extract: { left: 7, top: 47, width: 953, height: 352 },
  widths: [420, 700],
};

/** First 8 hex of the sha256 — plenty to separate revisions of one asset. */
const hash = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 8);

/**
 * Writes `name-width.hash.ext` and returns the public path.
 * Any previous revision of the same logical asset is deleted, so old hashed
 * files do not pile up in public/ and ship on every deploy.
 */
function emit(name, width, ext, buf) {
  const prefix = `${name}-${width}.`;
  const suffix = `.${ext}`;
  for (const f of readdirSync(OUT)) {
    if (f.startsWith(prefix) && f.endsWith(suffix)) unlinkSync(join(OUT, f));
  }
  const file = `${prefix}${hash(buf)}${suffix}`;
  writeFileSync(join(OUT, file), buf);
  return `/banner/${file}`;
}

const manifest = {};

for (const scene of SCENES) {
  const src = join(SRC_DIR, scene.file);
  if (!existsSync(src)) {
    console.log(`✗ ${scene.name} — not found: ${src}`);
    continue;
  }

  const info = await sharp(src).metadata();
  manifest[scene.key] = {};

  for (const w of scene.widths) {
    const buf = await sharp(src)
      .resize({ width: Math.min(w, info.width ?? w), withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toBuffer();
    manifest[scene.key][w] = emit(scene.name, w, "webp", buf);
  }

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
     * alpha channel, which is what `screen` would have computed anyway.
     */
    manifest[LOGO.key] = {};

    for (const w of LOGO.widths) {
      const base = sharp(src).extract(LOGO.extract).resize({ width: w });

      const rgb = await base.clone().removeAlpha().toBuffer();
      const alpha = await base
        .clone()
        .greyscale()
        /*
         * Measured from the crop, not guessed. Its luminance histogram is:
         *   L 0-19    74.5%  the black plate
         *   L 20-60    ~4%   a faint red glow bleeding off the artwork
         *   L 90-119  12.4%  the logo red
         *   L 200+     ~4%   white lettering and mascot highlights
         *
         * The previous curve (2.6x - 12) left the plate at alpha 37 and the
         * glow as high as 144, which composited as a red halo cut roughly to
         * the shape of the crop. This maps L35 -> 0 and L90 -> 255, so plate
         * and glow both vanish while the artwork stays solid and its
         * antialiased edges keep a soft ramp.
         */
        .linear(4.64, -162)
        .toBuffer();

      const buf = await sharp(rgb)
        .joinChannel(alpha)
        .png({ compressionLevel: 9 })
        .toBuffer();

      manifest[LOGO.key][w] = emit(LOGO.name, w, "png", buf);
    }

    const meta = await sharp(join(OUT, manifest[LOGO.key][700].split("/").pop())).metadata();
    manifest.logoIntrinsic = { width: meta.width, height: meta.height };
    console.log(`✓ logo-lockup       ${meta.width}x${meta.height}`);
  } else {
    console.log(`✗ logo lockup — source not found`);
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nHero assets written to public/banner/`);
console.log(`Manifest: src/data/banner.json`);
