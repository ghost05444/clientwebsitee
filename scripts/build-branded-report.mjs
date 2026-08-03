/**
 * Produces the working list of product images that carry the previous
 * supplier's logo and therefore need replacement photography.
 *
 * Three signals are merged, because no single one is sufficient:
 *
 *  1. VERIFIED   — tiles read by eye off the contact sheets. Certain.
 *  2. OCR        — from find-branded-images.mjs. High precision, terrible
 *                  recall: it found 3 of 966, and missed helmets whose logo is
 *                  plainly visible, because Tesseract cannot read a mark
 *                  moulded into curved, glossy plastic.
 *  3. BRAND LINE — products in the source company's own manufactured ranges
 *                  (EDGE footwear, ULTRA/VISTA helmets, RES-PROTEK respirators
 *                  and so on). These are their own goods, so they carry their
 *                  own logo far more often than not. A strong lead, not proof.
 *
 * Run with: npm run audit:report
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const products = JSON.parse(
  readFileSync(join(ROOT, "src", "data", "products.json"), "utf8"),
);
const index = JSON.parse(
  readFileSync(join(__dirname, "image-sheets", "index.json"), "utf8"),
);

/** Tile numbers confirmed by eye on the contact sheets. */
const VERIFIED_TILES = [
  // sheet 06 — fall protection
  290, 324,
  // sheet 11 — helmets, ear muffs, dispenser
  529, 530, 534, 535, 536, 554, 558, 559, 567, 573, 574,
];

/** The source company's own manufactured ranges. */
const BRAND_LINES = [
  "EDGE", "ULTRA", "VISTA", "NAPE", "PROTON", "ARC KNIGHT", "HEAT-X",
  "FLASH KNIGHT", "RES-PROTEK", "THERMOGUARD", "GALAXY", "TANGO",
  "ROCKMASTER", "BIGBOSS", "UFORCE", "SAFE TOP", "ALERT", "MINESTAR",
  "PRITHVI", "KIMAX", "NEOLITE", "DEXGRIP", "CUTSHIELD", "LIGHTON",
  "FUSION", "METPROTEK", "STEELWEAR", "AIRFLOW",
];

const ocrReportPath = join(__dirname, "branded-images-report.md");
const ocrHits = existsSync(ocrReportPath)
  ? [...readFileSync(ocrReportPath, "utf8").matchAll(/`(\/media\/[^`]+)`/g)].map((m) => m[1])
  : [];

const byTile = new Map(index.map((r) => [r.tile, r]));
const rows = new Map();

const add = (product, src, signal, tile) => {
  const key = product.slug;
  if (!rows.has(key)) {
    rows.set(key, { product, images: new Set(), signals: new Set(), tiles: new Set() });
  }
  const row = rows.get(key);
  if (src) row.images.add(src);
  row.signals.add(signal);
  if (tile) row.tiles.add(tile);
};

for (const tile of VERIFIED_TILES) {
  const entry = byTile.get(tile);
  if (!entry) continue;
  for (const ref of entry.products) {
    const product = products.find((p) => p.slug === ref.slug);
    if (product) add(product, entry.src, "verified", tile);
  }
}

for (const src of ocrHits) {
  for (const product of products.filter((p) => p.images.some((i) => i.src === src))) {
    add(product, src, "ocr", byTile.get([...byTile.keys()].find((t) => byTile.get(t).src === src))?.tile);
  }
}

for (const product of products) {
  const name = product.name.toUpperCase();
  if (!BRAND_LINES.some((f) => name.includes(f))) continue;
  if (!product.images.length) continue;
  add(product, product.images[0].src, "brand-line", null);
}

const sorted = [...rows.values()].sort((a, b) => {
  const rank = (r) => (r.signals.has("verified") ? 0 : r.signals.has("ocr") ? 1 : 2);
  return rank(a) - rank(b) || a.product.name.localeCompare(b.product.name);
});

const confirmed = sorted.filter((r) => r.signals.has("verified") || r.signals.has("ocr"));
const likely = sorted.filter((r) => !r.signals.has("verified") && !r.signals.has("ocr"));

/* ---- write ---- */
let md = `# Product images carrying the old supplier's logo\n\n`;
md += `Working list for sourcing replacement photography.\n\n`;
md += `- **${confirmed.length} products confirmed** — logo seen in the image\n`;
md += `- **${likely.length} products likely** — own-brand ranges, need a look\n`;
md += `- **${products.filter((p) => p.images.length).length} products with images** in total\n\n`;

md += `## How this list was built\n\n`;
md += `OCR was tried first and is not adequate on its own: it flagged 3 images out\n`;
md += `of 966 and missed helmets whose logo is plainly visible, because Tesseract\n`;
md += `cannot read a mark moulded into curved, glossy plastic.\n\n`;
md += `So the catalogue was rendered as 21 numbered contact sheets\n`;
md += `(\`scripts/image-sheets/\`) and reviewed by eye. The confirmed list below\n`;
md += `comes from that review. The "likely" list is every product in the source\n`;
md += `company's own manufactured ranges — their own goods, so they carry their own\n`;
md += `logo more often than not.\n\n`;
md += `**To finish the audit:** open each \`sheet-NN.webp\`, note the \`#number\`\n`;
md += `under any thumbnail showing the logo, and look it up in\n`;
md += `\`scripts/image-sheets/INDEX.md\`.\n\n`;

md += `---\n\n## Confirmed — logo visible\n\n`;
md += `| Tile | Product | Category | Image file |\n| --: | --- | --- | --- |\n`;
for (const row of confirmed) {
  const tiles = [...row.tiles].filter(Boolean).map((t) => `#${t}`).join(", ") || "—";
  md += `| ${tiles} | **${row.product.name}** | ${row.product.mainCategory} | ${[...row.images].map((s) => `\`${s}\``).join("<br>")} |\n`;
}

md += `\n---\n\n## Likely — own-brand ranges, confirm by eye\n\n`;
md += `Grouped by range. These are the source company's own products, so most will\n`;
md += `carry the logo somewhere on the item.\n\n`;

const byLine = new Map();
for (const row of likely) {
  const name = row.product.name.toUpperCase();
  const line = BRAND_LINES.find((f) => name.includes(f)) ?? "OTHER";
  if (!byLine.has(line)) byLine.set(line, []);
  byLine.get(line).push(row);
}

for (const [line, items] of [...byLine.entries()].sort((a, b) => b[1].length - a[1].length)) {
  md += `### ${line} — ${items.length} product(s)\n\n`;
  md += `| Product | Category | Image file |\n| --- | --- | --- |\n`;
  for (const row of items) {
    md += `| ${row.product.name} | ${row.product.mainCategory} | ${[...row.images].map((s) => `\`${s}\``).join("<br>")} |\n`;
  }
  md += `\n`;
}

writeFileSync(join(ROOT, "BRANDED-IMAGES.md"), md);

console.log(`confirmed: ${confirmed.length} products`);
console.log(`likely:    ${likely.length} products`);
console.log(`report:    BRANDED-IMAGES.md`);
