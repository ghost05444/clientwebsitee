/**
 * Mirrors every product datasheet PDF into public/datasheets/.
 *
 * Safe to re-run: files already present are skipped. Products whose PDF cannot
 * be fetched are reported so the catalog build can drop the dead link.
 *
 * Run with: npm run datasheets
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pLimit from "p-limit";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

const manifest = readFileSync(join(__dirname, "raw", "datasheets.txt"), "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [remote, local] = line.split("\t");
    return { remote, local };
  });

const limit = pLimit(6);
let ok = 0;
let skipped = 0;
let failed = 0;
const failures = [];

async function grab({ remote, local }) {
  const out = join(PUBLIC, local);
  if (existsSync(out)) {
    skipped++;
    return;
  }

  try {
    const res = await fetch(remote, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buf = Buffer.from(await res.arrayBuffer());
    // Guard against the CDN returning an HTML error page with a .pdf name.
    if (buf.subarray(0, 4).toString() !== "%PDF") throw new Error("not a PDF");

    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, buf);
    ok++;
  } catch (err) {
    failed++;
    failures.push(`${remote}\t${err.message}`);
  }

  const total = ok + skipped + failed;
  if (total % 100 === 0) {
    console.log(`  ${total}/${manifest.length}  ok:${ok} skip:${skipped} fail:${failed}`);
  }
}

console.log(`Mirroring ${manifest.length} datasheets...`);
await Promise.all(manifest.map((m) => limit(() => grab(m))));

writeFileSync(
  join(__dirname, "raw", "datasheet-failures.txt"),
  failures.join("\n"),
);

console.log(`\nDone. ok:${ok} skipped:${skipped} failed:${failed}`);
if (failed) {
  console.log("Failures listed in scripts/raw/datasheet-failures.txt");
  console.log("Re-run `npm run data` afterwards to drop links that never resolved.");
}
