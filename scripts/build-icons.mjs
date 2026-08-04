/**
 * Builds the favicon set from the brand flame.
 *
 * The flame is lifted from the client's own artwork rather than redrawn, so
 * the tab icon is the real mark. It sits on near-black in the source; alpha is
 * derived from the red channel (the flame is saturated red, the plate is not),
 * which gives a clean cut without a hard threshold chewing the tips.
 *
 * Run with: npm run icons
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const SRC_DIR = process.argv[2] || "C:/Users/rahul/Downloads";
const SRC = join(SRC_DIR, "592556fd-1eb0-4db0-a636-25a940eb8e90.png");

if (!existsSync(SRC)) {
  console.log(`✗ source artwork not found: ${SRC}`);
  process.exit(1);
}

mkdirSync(PUBLIC, { recursive: true });

/** Tight bounds around the flame in the source artwork. */
const FLAME = { left: 344, top: 124, width: 76, height: 96 };

/* Cut the flame out, working at high resolution so the tips stay clean. */
const base = sharp(SRC).extract(FLAME).resize({ width: 512, fit: "contain" });

const rgb = await base.clone().removeAlpha().toBuffer();
const alpha = await base
  .clone()
  .extractChannel("red")
  // Map the plate (~R42) to zero and the flame (~R200) to full, with a soft
  // ramp between so the edges keep their antialiasing.
  .linear(2.1, -95)
  .toBuffer();

const flame = await sharp(rgb).joinChannel(alpha).png().toBuffer();

/*
 * Pad to a square with breathing room. A favicon that bleeds to the edge looks
 * cropped in a tab strip; ~14% padding is the usual comfortable margin.
 */
const squared = await sharp({
  create: { width: 640, height: 640, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([{ input: await sharp(flame).resize({ height: 470 }).toBuffer(), gravity: "center" }])
  .png()
  .toBuffer();

/** Transparent PNGs for the manifest and modern browsers. */
for (const size of [16, 32, 48, 192, 512]) {
  await sharp(squared).resize(size, size).png({ compressionLevel: 9 }).toFile(join(PUBLIC, `icon-${size}.png`));
}

/*
 * apple-touch-icon must be opaque — iOS composites it onto the home screen
 * with no transparency handling and a cut-out mark ends up on black.
 */
await sharp({
  create: { width: 180, height: 180, channels: 4, background: { r: 14, g: 10, b: 10, alpha: 1 } },
})
  .composite([{ input: await sharp(squared).resize(150, 150).toBuffer(), gravity: "center" }])
  .png()
  .toFile(join(PUBLIC, "apple-touch-icon.png"));

/*
 * favicon.ico with 16/32/48 packed in. sharp cannot write ICO, so the
 * container is assembled by hand — it is a simple directory of PNG payloads.
 */
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(
  icoSizes.map((s) => sharp(squared).resize(s, s).png({ compressionLevel: 9 }).toBuffer()),
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(icoSizes.length, 4);

let offset = 6 + icoSizes.length * 16;
const entries = [];
for (let i = 0; i < icoSizes.length; i++) {
  const e = Buffer.alloc(16);
  e.writeUInt8(icoSizes[i] === 256 ? 0 : icoSizes[i], 0); // width
  e.writeUInt8(icoSizes[i] === 256 ? 0 : icoSizes[i], 1); // height
  e.writeUInt8(0, 2); // palette
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  entries.push(e);
}

writeFileSync(join(PUBLIC, "favicon.ico"), Buffer.concat([header, ...entries, ...pngs]));

console.log("✓ icon-16/32/48/192/512.png");
console.log("✓ apple-touch-icon.png (opaque)");
console.log(`✓ favicon.ico (${icoSizes.join("/")})`);
