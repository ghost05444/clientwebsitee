/**
 * QA 7 + 8 — sitemap coverage and image loading strategy, checked against the
 * built `out/` directory rather than the dev server.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const problems = [];

/* ---- 7. Sitemap covers every generated route ------------------------ */
const sitemap = readFileSync(join(OUT, "sitemap.xml"), "utf8");
const urls = new Set(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") || "/",
  ),
);

const REQUIRED = [
  "/",
  "/products",
  "/solutions",
  "/solutions/confined-space-entry-rescue",
  "/solutions/rescue-from-height",
  "/solutions/arc-flash-protection",
  "/solutions/height-access",
  "/solutions/cryo-cold-protection",
  "/solutions/heat-protection",
  "/solutions/inherent-flame-retardant-clothing",
  "/services",
  "/standards",
  "/blog",
  "/blog/is-2925-vs-en-397-industrial-helmet",
  "/blog/reading-en-388-glove-markings",
  "/blog/fall-protection-harness-lanyard-anchor",
  "/blog/choosing-fire-extinguisher-class-factory-floor",
  "/about",
  "/contact",
];

for (const route of REQUIRED) {
  if (!urls.has(route)) problems.push(`sitemap missing ${route}`);
}
console.log(`sitemap entries: ${urls.size}; required routes present: ${REQUIRED.filter((r) => urls.has(r)).length}/${REQUIRED.length}`);

/* ---- 8. Image loading strategy -------------------------------------- */
const walk = (dir) => {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
};

const pages = walk(OUT);
let eagerTotal = 0;
const offenders = [];

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const eager = imgs.filter((t) => t.includes('loading="eager"'));
  eagerTotal += eager.length;
  // Category grids deliberately mark the first row (4 cards) eager for LCP;
  // more than that means priority has leaked below the fold.
  if (eager.length > 4) offenders.push(`${page}: ${eager.length} eager`);
  const noLoading = imgs.filter((t) => !t.includes("loading="));
  if (noLoading.length) offenders.push(`${page}: ${noLoading.length} <img> with no loading attr`);
}

console.log(`html pages: ${pages.length}; eager images total: ${eagerTotal}`);
if (offenders.length) {
  problems.push(...offenders.slice(0, 10));
}

/* ---- Article JSON-LD in the built HTML ------------------------------ */
const article = readFileSync(
  join(OUT, "blog", "reading-en-388-glove-markings", "index.html"),
  "utf8",
);
if (!article.includes('"@type":"Article"')) problems.push("blog article missing Article JSON-LD in built HTML");

/* ---- No source-site URLs -------------------------------------------- */
const leaked = pages.filter((p) => readFileSync(p, "utf8").includes("udyogisafety"));
if (leaked.length) problems.push(`${leaked.length} pages leak source-site URLs`);

console.log("\n========== RESULT ==========");
if (!problems.length) console.log("PASS");
else {
  console.log(`${problems.length} problem(s):`);
  problems.forEach((p) => console.log(" - " + p));
}
process.exit(problems.length ? 1 : 0);
