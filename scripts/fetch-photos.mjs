/**
 * Downloads the hero photography and emits responsive WebP into public/photo/.
 *
 * Sources are pinned by URL rather than re-searched, so a rebuild always
 * produces the same images. All four are US federal government works in the
 * **public domain** — free for commercial use with no attribution required.
 *
 * Why Wikimedia Commons and not a stock service: the CC0 pools on the stock
 * aggregators turned out to be mostly rawpixel previews, which are watermarked
 * across the frame and unusable. Commons serves unwatermarked originals and
 * states the licence per file.
 *
 * Run with: npm run photos
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "photo");
mkdirSync(OUT, { recursive: true });

const UA = "KrushnamFireSiteBuild/1.0 (contact: support@krushnamfire.in)";

const PHOTOS = [
  {
    name: "hero-firefighter",
    // Silhouetted firefighter against a wall of flame. The dark left third is
    // deliberate — the headline sits there.
    url: "https://upload.wikimedia.org/wikipedia/commons/3/39/US_Navy_070829-N-4965F-015_Flames_push_water_from_a_fire_hose_back_as_a_federal_firefighter_assigned_to_Navy_Region_Hawaii_Federal_Fire_Department_combats_a_fire_during_an_aircraft_firefighting_training_evolution_with_the_Mobile.jpg",
    credit: "US Navy photo — public domain",
    page: "https://commons.wikimedia.org/wiki/File:US_Navy_070829-N-4965F-015_Flames_push_water_from_a_fire_hose_back_as_a_federal_firefighter_assigned_to_Navy_Region_Hawaii_Federal_Fire_Department_combats_a_fire_during_an_aircraft_firefighting_training_evolution_with_the_Mobile.jpg",
  },
  {
    name: "crew-aluminised",
    // Three firefighters in aluminised proximity suits — reads as PPE in use.
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Aircraft_Rescue_Firefighting_training.jpg",
    credit: "US Air Force photo — public domain",
    page: "https://commons.wikimedia.org/wiki/File:Aircraft_Rescue_Firefighting_training.jpg",
  },
  {
    name: "interior-burn",
    // Crew working inside a structure fire; heavy orange ambience.
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Air_Force_Fire_Training.jpg",
    credit: "US Air Force photo — public domain",
    page: "https://commons.wikimedia.org/wiki/File:Air_Force_Fire_Training.jpg",
  },
];

const SIZES = [
  { suffix: "-800", width: 800, quality: 68 },
  { suffix: "-1600", width: 1600, quality: 64 },
  { suffix: "-2400", width: 2400, quality: 60 },
];

const credits = [];

for (const photo of PHOTOS) {
  const done = SIZES.every((s) => existsSync(join(OUT, `${photo.name}${s.suffix}.webp`)));
  if (done) {
    console.log(`· ${photo.name} — already present`);
    credits.push(photo);
    continue;
  }

  try {
    const res = await fetch(photo.url, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(90000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buf = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(buf).metadata();

    for (const size of SIZES) {
      await sharp(buf)
        .resize({
          width: Math.min(size.width, meta.width ?? size.width),
          withoutEnlargement: true,
        })
        .webp({ quality: size.quality, effort: 6 })
        .toFile(join(OUT, `${photo.name}${size.suffix}.webp`));
    }

    credits.push(photo);
    console.log(`✓ ${photo.name.padEnd(20)} ${meta.width}x${meta.height}`);
  } catch (err) {
    console.log(`✗ ${photo.name} — ${err.message}`);
  }
}

writeFileSync(
  join(OUT, "CREDITS.json"),
  JSON.stringify(
    {
      note:
        "All images are works of the US federal government and are in the public " +
        "domain: free for commercial use, no attribution required. Sources are " +
        "recorded for the client's files only.",
      images: credits.map(({ name, credit, page }) => ({ name, credit, page })),
    },
    null,
    2,
  ),
);

console.log(`\n${credits.length} photo(s) in public/photo/`);
