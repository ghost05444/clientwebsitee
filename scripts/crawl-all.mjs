/**
 * Hits every generated route and reports any non-200.
 * Catches slug/route mismatches that spot-checking would miss.
 *
 * Usage: node scripts/crawl-all.mjs [baseUrl]
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pLimit from "p-limit";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || "http://localhost:3000";

const products = JSON.parse(
  readFileSync(join(__dirname, "..", "src", "data", "products.json"), "utf8"),
);
const categories = JSON.parse(
  readFileSync(join(__dirname, "..", "src", "data", "categories.json"), "utf8"),
);

const urls = [
  "/",
  "/products/",
  "/about/",
  "/contact/",
  "/sitemap.xml",
  "/robots.txt",
  "/search-index.json",
];

for (const cat of categories) {
  urls.push(`/products/${cat.slug}/`);
  for (const child of cat.children) {
    urls.push(`/products/${cat.slug}/${child.slug}/`);
  }
}
for (const p of products) urls.push(`/product/${p.slug}/`);

console.log(`Crawling ${urls.length} routes at ${BASE} ...`);

const limit = pLimit(24);
const bad = [];
let done = 0;

await Promise.all(
  urls.map((u) =>
    limit(async () => {
      try {
        const res = await fetch(`${BASE}${u}`, {
          method: "GET",
          signal: AbortSignal.timeout(30000),
        });
        if (res.status !== 200) bad.push(`${res.status}  ${u}`);
      } catch (err) {
        bad.push(`ERR   ${u}  ${err.message}`);
      }
      if (++done % 200 === 0) console.log(`  ${done}/${urls.length}`);
    }),
  ),
);

console.log(`\nchecked: ${urls.length}   failures: ${bad.length}`);
for (const b of bad.slice(0, 40)) console.log(`  ${b}`);
if (bad.length > 40) console.log(`  ... and ${bad.length - 40} more`);

process.exit(bad.length ? 1 : 0);
