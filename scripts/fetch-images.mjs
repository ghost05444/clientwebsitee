/**
 * Downloads every product image referenced by the catalog and emits two
 * responsive WebP variants into public/products/.
 *
 *   <name>-400.webp   card / grid
 *   <name>-900.webp   detail view
 *
 * Re-running skips work already done, so it is safe to resume.
 * Run with: npm run images
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pLimit from "p-limit";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

const manifest = readFileSync(join(__dirname, "raw", "images.txt"), "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [remote, local] = line.split("\t");
    return { remote, local };
  });

const SIZES = [
  { suffix: "-400", width: 400, quality: 78 },
  { suffix: "-900", width: 900, quality: 80 },
];

const variantPath = (local, suffix) =>
  join(PUBLIC, local.replace(/\.webp$/, `${suffix}.webp`));

const limit = pLimit(8);
let done = 0;
let skipped = 0;
let failed = 0;
const failures = [];

async function convert({ remote, local }) {
  const outputs = SIZES.map((s) => variantPath(local, s.suffix));
  if (outputs.every((p) => existsSync(p))) {
    skipped++;
    return;
  }

  try {
    const res = await fetch(remote, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      signal: AbortSignal.timeout(45000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(outputs[0]), { recursive: true });

    const meta = await sharp(buf).metadata();

    for (const size of SIZES) {
      await sharp(buf)
        .resize({
          width: Math.min(size.width, meta.width || size.width),
          withoutEnlargement: true,
          fit: "inside",
        })
        .webp({ quality: size.quality, effort: 5 })
        .toFile(variantPath(local, size.suffix));
    }

    // Record intrinsic dimensions so the markup can reserve space (no CLS).
    dims[local] = { w: meta.width || null, h: meta.height || null };
    done++;
  } catch (err) {
    failed++;
    failures.push(`${remote}\t${err.message}`);
  }

  const total = done + skipped + failed;
  if (total % 100 === 0) {
    console.log(`  ${total}/${manifest.length}  ok:${done} skip:${skipped} fail:${failed}`);
  }
}

const dimsPath = join(__dirname, "raw", "dimensions.json");
const dims = existsSync(dimsPath) ? JSON.parse(readFileSync(dimsPath, "utf8")) : {};

console.log(`Processing ${manifest.length} images...`);
await Promise.all(manifest.map((m) => limit(() => convert(m))));

writeFileSync(dimsPath, JSON.stringify(dims, null, 1));
if (failures.length) {
  writeFileSync(join(__dirname, "raw", "image-failures.txt"), failures.join("\n"));
}

console.log(`\nDone. converted:${done} skipped:${skipped} failed:${failed}`);
if (failed) console.log(`Failures logged to scripts/raw/image-failures.txt`);
