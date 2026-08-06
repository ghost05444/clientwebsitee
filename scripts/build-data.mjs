/**
 * Transforms the raw scraped WooCommerce export into clean, typed site data.
 *
 *   scripts/raw/products.json    ->  src/data/products.json
 *   scripts/raw/categories.json  ->  src/data/categories.json
 *
 * Run with: npm run data
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "src", "data");

const rawProducts = JSON.parse(
  readFileSync(join(__dirname, "raw", "products.json"), "utf8"),
);
const rawCats = JSON.parse(
  readFileSync(join(__dirname, "raw", "categories.json"), "utf8"),
);

/* ------------------------------------------------------------------ *
 * HTML helpers
 * ------------------------------------------------------------------ */

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#8217;": "’",
  "&#8216;": "‘",
  "&#8220;": "“",
  "&#8221;": "”",
  "&#8211;": "–",
  "&#8212;": "—",
  "&#039;": "'",
  "&#39;": "'",
  "&nbsp;": " ",
  "&hellip;": "…",
  "&deg;": "°",
  "&trade;": "™",
  "&reg;": "®",
  "&sup2;": "²",
  "&times;": "×",
};

function decodeEntities(s = "") {
  let out = s;
  for (const [k, v] of Object.entries(ENTITIES)) out = out.split(k).join(v);
  return out
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

/** Strip all tags, collapse whitespace. */
function toText(html = "") {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|tr|h[1-6])>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/ /g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .trim();
}

/**
 * The source catalogue is branded throughout. This is a different company's
 * site, so the previous supplier's name is stripped from every user-visible
 * string — names, copy, spec values and image alt text.
 */
function scrubBrand(s = "") {
  return (
    s
      // "UDYOGI | Res-protek 815 ..." lead-ins
      .replace(/^\s*udyogi\s*[|:–-]\s*/i, "")
      // "With Udyogi Marking" / "Udyogi marked"
      .replace(/\bwith\s+udyogi\s+marking\b/gi, "with brand marking")
      .replace(/\budyogi\s+mark(ed|ing)\b/gi, "brand mark$1")
      // Possessives and plain mentions
      .replace(/\budyogi['’]s\b/gi, "our")
      .replace(/\budyogi\b/gi, "")
      // Tidy the gaps left behind
      .replace(/\s{2,}/g, " ")
      .replace(/\s+([,.;:])/g, "$1")
      .replace(/^\s*[|:–-]\s*/, "")
      .trim()
  );
}

/** Split text into clean bullet lines, dropping boilerplate. */
const NOISE =
  /^(data\s*sheet|datasheet|enquire\s*now|request\s*a\s*demo|quick\s*info|click here|download|pdf|read more|\.|-|•|\s*)$/i;

function toLines(text) {
  return text
    .split("\n")
    .map((l) => l.replace(/^[•●▪*\-–—>\s]+/, "").trim())
    .map((l) => l.replace(/\s+$/, ""))
    .filter((l) => l.length > 1 && !NOISE.test(l));
}

/* ------------------------------------------------------------------ *
 * Field extraction
 * ------------------------------------------------------------------ */

/** Pull the linked PDF datasheet, ignoring the pdf-icon image itself. */
function extractDatasheet(html = "") {
  const m = html.match(/href="([^"]+\.pdf)"/i);
  return m ? decodeEntities(m[1]) : null;
}

/** EN / IS / ANSI / ASTM / NFPA compliance standards cited anywhere. */
const STANDARD_RE =
  /\b(?:EN|IS|ISO|ANSI|ASTM|NFPA|IEC|AS\/NZS)\s?[- ]?\d{2,5}(?:[-–:]\d{1,4})?(?:\s?:\s?\d{4})?/gi;

function extractStandards(...htmls) {
  const found = new Set();
  for (const h of htmls) {
    for (const m of toText(h || "").matchAll(STANDARD_RE)) {
      const norm = m[0]
        .toUpperCase()
        .replace(/\s+/g, " ")
        .replace(/\s?:\s?/, ":")
        .replace(/–/g, "-")
        // The source writes both "EN397:2012" and "EN 397:2012"; without this
        // they become two separate filter chips for the same standard.
        .replace(/^(EN|IS|ISO|ANSI|ASTM|NFPA|IEC|AS\/NZS)\s*-?\s*/, "$1 ")
        .trim();

      // Filter false positives like bare "IS 4" or stray years.
      if (/^(EN|IS|ISO|ANSI|ASTM|NFPA|IEC|AS\/NZS) \d{2,5}/.test(norm) && norm.length >= 5) {
        found.add(norm);
      }
    }
  }
  return [...found].sort().slice(0, 8);
}

/**
 * Parse "Label: Value" pairs out of the bullet list. These are the real
 * spec rows (e.g. "Shell: HDPE", "No. of Anchoring point: 4").
 */
function extractSpecs(lines) {
  const specs = [];
  const rest = [];
  for (const line of lines) {
    const m = line.match(/^([A-Za-z][A-Za-z0-9 ()\/.&'’+°%-]{1,44}?)\s*[:：]\s*(.+)$/);
    if (m && m[2].trim().length > 0 && m[2].trim().length < 200) {
      const label = m[1].trim().replace(/\s+/g, " ");
      const value = m[2].trim().replace(/\s+/g, " ");
      // Avoid turning prose sentences into specs
      if (!/\s(is|are|the|a|an|and|of|for|with|to)\s/i.test(label)) {
        specs.push({ label, value });
        continue;
      }
    }
    rest.push(line);
  }
  return { specs, rest };
}

/* ------------------------------------------------------------------ *
 * Categories
 * ------------------------------------------------------------------ */

const cats = rawCats.map((c) => ({
  id: c.id,
  name: decodeEntities(c.name).replace(/\s+/g, " ").trim(),
  slug: c.slug,
  parent: c.parent,
  count: c.count,
}));
const catById = new Map(cats.map((c) => [c.id, c]));

/** The 14 real top-level categories, in the order the reference mega-menu uses. */
const MAIN_ORDER = [
  "head-protection",
  "eye-protection",
  "hearing-protection",
  "respiratory-protection",
  "hand-protection",
  "body-protection",
  "foot-protection",
  "fall-protection",
  "lifeline-system",
  "arc-flash-eletrical-safety",
  "eye-wash-safety-shower",
  "workplace-safety-solutions",
  "sgbi",
  "other-products",
];

/** Editorial overrides: cleaner display names than the raw WooCommerce ones. */
const RENAME = {
  "eye-protection": "Eye & Face Protection",
  "body-protection": "Workwear & Body Protection",
  "arc-flash-eletrical-safety": "Arc Flash & Electrical Safety",
  sgbi: "SCBA, Gas Detection & Blowers",
  "lifeline-system": "Lifeline & Height Access",
  "workplace-safety-solutions": "Workplace Safety Solutions",
  "foot-protection": "Foot Protection",
  "other-products": "Other Products",
};

/** Short blurbs for category landing pages / home tiles. */
const BLURB = {
  "head-protection":
    "Industrial safety helmets and bump caps engineered for impact, penetration and electrical protection.",
  "eye-protection":
    "Spectacles, goggles and face shields for impact, chemical splash, grinding, welding and furnace work.",
  "hearing-protection":
    "Ear muffs and ear plugs with graded attenuation for high-noise industrial environments.",
  "respiratory-protection":
    "Half and full face masks, disposable respirators and replaceable filter systems.",
  "hand-protection":
    "Cut, heat, chemical and impact resistant gloves across every EN 388 performance level.",
  "body-protection":
    "Flame retardant, heat, chemical and arc-rated workwear built for demanding process industries.",
  "foot-protection":
    "Safety shoes, boots and gumboots with steel toe, PU, PVC and electrical hazard soles.",
  "fall-protection":
    "Full body harnesses, lanyards, anchors, retractable lifelines and rescue systems for work at height.",
  "lifeline-system":
    "Engineered horizontal, vertical and inclined lifeline systems for permanent height access.",
  "arc-flash-eletrical-safety":
    "Arc-rated garments, face shields, gloves and insulated tools for electrical safety compliance.",
  "eye-wash-safety-shower":
    "Emergency eyewash stations, safety showers and combination units for chemical handling areas.",
  "workplace-safety-solutions":
    "Spill kits, absorbents, safety storage cabinets, cans and containment for hazardous materials.",
  sgbi: "Self-contained breathing apparatus, portable gas detectors, blowers and ducting.",
  "other-products": "Additional safety equipment and accessories across our range.",
};

/**
 * The reference site keeps several legacy / "solution-oriented" taxonomy
 * branches that sit outside the 14 main product categories. Every product in
 * them is still a real product, so instead of dumping ~100 items into a junk
 * drawer we re-home each branch under the main category it belongs to.
 */
const REHOME = {
  "fall-protection": [
    "connecting-lanyard", "single-rope-lanyard", "twin-rope-lanyard",
    "single-braided-rope-lanyard", "twin-braided-rope-lanyard", "tool-lanyard",
    "full-body-harnesses", "retractable-fall-arrester", "safe-access-equipment",
    "rescue-ladder", "rope-access", "assembled-working-kits", "rescue-kit",
    "kits1", "kits", "rescue-from-height-solutions",
    "accessories-rescue-from-height-solutions", "udyogi-rescue-from-height-solutions",
    "rescue-solutions",
  ],
  "lifeline-system": [
    "height-access-solutions", "height-access-solutions_",
    "accessories-height-access-solutions", "udyogi-height-access-solutions",
    "height-safety-products",
  ],
  "arc-flash-eletrical-safety": [
    "arc-flash-protection-solutions", "accessories-arc-flash-protection-solutions",
    "electrical-emergency-rescue-kit", "electrical-glove", "electrical-shoe",
    "udyogi-arc-flash-protection", "arc-flash-protective-face-shield",
    "arc-flash-protection-solution",
  ],
  sgbi: ["blowers", "axial", "ducting", "portable-gas-detector"],
  "hand-protection": [
    "hand-gloves", "cut-puncture-protection", "uhmwpe-hppe", "high-cut-protection",
    "udyogi-cut-protection", "udyogi-cut-protection-solution", "cut-protection-solutions",
    "high-temperature-resistant-glove", "mechanical-protection", "thermal-protection",
    "polycotton-mechanical-protection", "polyester-nylon", "nylon-lycra-u3-lining",
    "jersey-cotton", "jutec-hand-protection", "cryo-cold-protection-gloves",
    "disposable-gloves-hand-protection", "chemical-liquid-protection", "polycotton",
    "hand-protection-against-liquid-nitrogen-non-waterproof",
    "hand-protection-against-liquid-nitrogen-waterproof",
    "hand-protection-against-liquid-oxygen",
  ],
  "body-protection": [
    "heat-protection-solution", "heat-protection-solutions",
    "high-temperature-resistant-body-protection", "inherent-flame-retardant-solution",
    "udyogi-flame-retardant-solution", "udyogi-heat-protection", "cryo-protection-solution",
    "udyogi-cryo-protection", "udyogi-chemical-exposure-protection",
    "cryo-cold-protection-solutions", "udyogi-mechanical-protection",
    "body-protection-against-liquid-nitrogen-non-waterproof",
    "body-protection-against-liquid-oxygen", "technical-workwear",
  ],
  "eye-protection": [
    "face-protection-against-cryogenic-materials",
    "high-temperature-resistant-head-face-protection",
    "heat-protection-face-shield", "quick-view-face-shield",
  ],
  "hearing-protection": ["hearing-protection1"],
  "workplace-safety-solutions": [
    "fire-welding-blankets", "others", "granules-neutralizer",
    "safety-rated-flashlight", "anti-skid-marking-tapes",
  ],
};

/** slug -> main category slug */
const rehomeBySlug = new Map();
for (const [main, slugs] of Object.entries(REHOME)) {
  for (const s of slugs) rehomeBySlug.set(s, main);
}

/** Last-resort routing for products whose taxonomy gives no usable signal. */
const NAME_HINTS = [
  [/\b(boot|shoe|footwear|gumboot)\b/i, "foot-protection"],
  [/\b(glove|gauntlet|mitt)\b/i, "hand-protection"],
  [/\b(helmet|bump cap|hard hat)\b/i, "head-protection"],
  [/\b(goggle|spectacle|face shield|visor|eyewear)\b/i, "eye-protection"],
  [/\b(ear ?muff|ear ?plug)\b/i, "hearing-protection"],
  [/\b(respirator|mask|filter|scba|cartridge)\b/i, "respiratory-protection"],
  [/\b(harness|lanyard|anchor|carabiner|srl|fall arrest|descender|ascender|rope grab)\b/i, "fall-protection"],
  [/\b(lifeline|securail|securope|davit|tripod)\b/i, "lifeline-system"],
  [/\b(blower|duct|gas detector|ventinout)\b/i, "sgbi"],
  [/\b(eyewash|eye wash|safety shower)\b/i, "eye-wash-safety-shower"],
  [/\b(spill|absorbent|cabinet|blanket|drum|pallet)\b/i, "workplace-safety-solutions"],
  [/\b(jacket|trouser|coverall|apron|hood|balaclava|suit|coat|leg ?guard|arm ?guard)\b/i, "body-protection"],
];

/** Collect a category id plus every descendant id. */
function subtreeIds(rootId) {
  const ids = new Set([rootId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of cats) {
      if (ids.has(c.parent) && !ids.has(c.id)) {
        ids.add(c.id);
        grew = true;
      }
    }
  }
  return ids;
}

/* ------------------------------------------------------------------ *
 * Products
 * ------------------------------------------------------------------ */

/** Local image path for a remote WP upload URL. */
function localImage(src) {
  const m = src.match(/\/uploads\/(.+)$/);
  if (!m) return null;
  const clean = m[1].replace(/\.(jpe?g|png|webp|gif)$/i, ".webp");
  return `/media/${clean}`;
}

const products = [];
const seenSlug = new Set();

for (const p of rawProducts) {
  // Slugs are user-visible URLs, so the previous supplier's name comes out of
  // them too — not just the copy.
  let slug = (p.slug || "")
    .replace(/(^|-)udyogi(-|$)/gi, "$1")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug || seenSlug.has(slug)) slug = `${slug || "product"}-${p.id}`;
  seenSlug.add(slug);

  const shortText = toText(p.short_description);
  const longText = toText(p.description);

  const shortLines = toLines(shortText);
  const { specs: rawSpecs, rest } = extractSpecs(shortLines);

  // Long description becomes prose paragraphs; fall back to leftover bullets.
  const longLines = toLines(longText);
  const paragraphs = (longLines.length ? longLines : rest)
    .map(scrubBrand)
    .filter((l) => l.length > 1);
  const bullets = (longLines.length ? rest : [])
    .map(scrubBrand)
    .filter((l) => l.length > 1);

  const specs = rawSpecs
    .map((s) => ({ label: scrubBrand(s.label), value: scrubBrand(s.value) }))
    .filter((s) => s.label && s.value);

  const summary =
    paragraphs.find((l) => l.length > 40) ||
    bullets.find((l) => l.length > 40) ||
    paragraphs[0] ||
    bullets[0] ||
    specs.map((s) => `${s.label}: ${s.value}`).join(" · ") ||
    "";

  const productName = scrubBrand(decodeEntities(p.name).replace(/\s+/g, " ").trim());

  const images = (p.images || [])
    .map((i) => {
      const src = localImage(i.src);
      if (!src) return null;
      const rawAlt = scrubBrand(decodeEntities(i.alt || "").trim());
      return {
        src,
        remote: i.src,
        // Alt text must describe the product, never be empty or a filename.
        alt: rawAlt && !/^(img|image|dsc|\d{6,})/i.test(rawAlt) ? rawAlt : productName,
      };
    })
    .filter(Boolean);

  // Attribute terms (colour, material, size ...) usable as facets.
  const attributes = (p.attributes || [])
    .filter((a) => a.terms?.length && a.name.toLowerCase() !== "quick info")
    .map((a) => ({
      name: decodeEntities(a.name).trim(),
      values: a.terms.map((t) => decodeEntities(t.name).trim()),
    }));

  const categoryIds = (p.categories || []).map((c) => c.id).filter((id) => catById.has(id));

  /*
   * Datasheets are rehosted locally — hotlinking the source site would break
   * the moment it changes. The link is only emitted when the PDF is actually
   * present in public/datasheets/, so a checkout without the (large, gitignored)
   * PDF bundle renders no dead download buttons. Run `npm run datasheets` to
   * populate them.
   */
  const remoteDatasheet =
    extractDatasheet(p.short_description) || extractDatasheet(p.description);
  const datasheetFile = remoteDatasheet ? remoteDatasheet.split("/").pop() : null;
  const datasheet =
    datasheetFile && existsSync(join(__dirname, "..", "public", "datasheets", datasheetFile))
      ? `/datasheets/${datasheetFile}`
      : null;

  products.push({
    id: p.id,
    slug,
    name: productName,
    sku: p.sku || null,
    summary: summary.slice(0, 400),
    paragraphs: paragraphs.slice(0, 12),
    bullets: bullets.slice(0, 16),
    specs: specs.slice(0, 30),
    standards: extractStandards(p.short_description, p.description),
    datasheet,
    datasheetRemote: remoteDatasheet,
    images,
    attributes,
    categoryIds,
    hasDemo: /Request a Demo/i.test(p.short_description || ""),
  });
}

/* ------------------------------------------------------------------ *
 * Krushnam's own offerings
 * ------------------------------------------------------------------ *
 *
 * Everything above is transformed from the scraped catalogue. These eight are
 * the client's own services and supply lines, added on their instruction to
 * the "Other Products" category.
 *
 * They live here rather than in src/data/products.json because that file is
 * regenerated from scripts/raw on every build (`prebuild`), so anything hand
 * edited there is silently destroyed on the next `npm run build`. Declaring
 * them in the transform means the category tree, product counts, search index,
 * sitemap and breadcrumbs all pick them up with no further wiring.
 *
 * Copy describes what each offering covers. It deliberately makes no
 * certification or accreditation claims — those are the client's to state.
 */

const CURATED_CATEGORY = "other-products";

/** Ids sit far above the WooCommerce range so they can never collide. */
const CURATED_ID_BASE = 900001;

/**
 * Photography lives in public/media/services/, generated by
 * `npm run service-images`. Each entry names its base file; the -400/-900
 * variants are derived by ProductImage exactly as for catalogue images.
 */
const CURATED = [
  {
    slug: "fire-extinguisher-supply",
    name: "Fire Extinguisher Supply",
    image: "fire-extinguisher-supply",
    summary:
      "Portable and trolley-mounted fire extinguishers supplied, installed and commissioned across Anjar, Kachchh and all of Gujarat.",
    paragraphs: [
      "We supply the full range of portable and trolley-mounted extinguishers — ABC dry powder, CO2, mechanical foam, water and clean agent — sized to the fire risk of the area they protect rather than to a single default.",
      "Supply includes siting advice, wall brackets or floor stands, identification signage above each unit, and commissioning so the extinguisher is ready to use on handover.",
    ],
    bullets: [
      "ABC dry powder, CO2, mechanical foam, water and clean agent types",
      "Portable capacities through to trolley-mounted units",
      "Siting and selection matched to the fire class of each area",
      "Brackets, stands and location signage supplied with the unit",
      "Commissioned and tagged on installation",
    ],
  },
  {
    slug: "extinguisher-refilling-and-hydrotest",
    name: "Refilling & Hydrotest",
    image: "extinguisher-refilling-and-hydrotest",
    summary:
      "Refilling, recharging and hydrostatic pressure testing for extinguishers of every type, with collection and return.",
    paragraphs: [
      "Extinguishers need recharging after any use and periodic hydrostatic testing to confirm the cylinder still holds pressure safely. We handle both, for units we supplied and for those already on your site.",
      "We collect, service and return, so cover is maintained while work is carried out. Each unit comes back charged, resealed, tagged with its service date and accompanied by its test record.",
    ],
    bullets: [
      "Refilling and recharging for all extinguisher types",
      "Hydrostatic pressure testing of cylinders",
      "Valve, hose, gauge and O-ring replacement",
      "Collection and return so cover is not interrupted",
      "Service tag and test record with every unit",
    ],
  },
  {
    slug: "fire-hydrant-system",
    name: "Fire Hydrant System",
    image: "fire-hydrant-system",
    summary:
      "Design, supply, installation and commissioning of fire hydrant and sprinkler systems for industrial and commercial sites.",
    paragraphs: [
      "A hydrant system is the backbone of fixed fire protection on an industrial site — pump house, ring main, landing valves and hose reels working as one. We take these from layout through to commissioning.",
      "Scope covers pump sets and their controls, above and below ground piping, hydrant and monitor points, hose boxes with their equipment, and sprinkler pipework where the risk calls for it. Systems are flow tested and handed over with as-built drawings.",
    ],
    bullets: [
      "Layout and hydraulic design for the site's fire load",
      "Pump house: main, standby and jockey pump sets with controls",
      "Ring main, landing valves, hose reels and hose boxes",
      "Sprinkler pipework and heads where required",
      "Flow tested, commissioned and handed over with drawings",
    ],
  },
  {
    slug: "ppe-supply",
    name: "PPE Supply",
    image: "ppe-supply",
    summary:
      "Head-to-toe personal protective equipment supplied as complete kits or line items, from the full catalogue on this site.",
    paragraphs: [
      "We supply personal protective equipment across every category carried on this site — head, eye and face, hearing, respiratory, hand, foot, body and fall protection.",
      "Most sites buy by role rather than by item, so we can assemble and supply standing kits per job function and keep them replenished, instead of you raising an order line by line.",
    ],
    bullets: [
      "Head, eye, face, hearing and respiratory protection",
      "Hand, foot and body protection",
      "Fall protection harnesses, lanyards and anchors",
      "Kits assembled per job role, replenished on a schedule",
      "Sizing and fit guidance before bulk supply",
    ],
  },
  {
    slug: "maintenance-and-inspection",
    name: "Maintenance & Inspection",
    image: "maintenance-and-inspection",
    summary:
      "Scheduled inspection, testing and maintenance of fire protection equipment, with records kept for audit.",
    paragraphs: [
      "Fire equipment only works if it is maintained, and an audit will ask for the evidence. We run scheduled inspection and maintenance visits covering extinguishers, hydrant and sprinkler systems, pumps, alarms and safety equipment.",
      "Every visit produces a written record of what was checked, what was found and what was corrected, so the site has a defensible maintenance history rather than a shelf of untested equipment.",
    ],
    bullets: [
      "Scheduled inspection visits on an agreed cycle",
      "Extinguishers, hydrant systems, pumps, alarms and safety equipment",
      "Pump run tests and system pressure checks",
      "Defects reported with corrective action",
      "Written inspection records maintained for audit",
    ],
  },
  {
    slug: "safety-signage",
    name: "Safety Signs Board",
    image: "safety-signage",
    summary:
      "Fire exit, assembly point, hazard and mandatory signage, including photoluminescent signs for use in the dark.",
    paragraphs: [
      "Signage is what people follow when the lights fail and the corridor fills with smoke. We supply the full range — fire exit and directional signs, assembly point boards, extinguisher location signs, hazard warnings and mandatory PPE boards.",
      "Photoluminescent signs are available where escape routes must stay readable after a power failure. Boards can be supplied in the sizes and languages the site needs.",
    ],
    bullets: [
      "Fire exit, directional and assembly point signage",
      "Extinguisher and hydrant location signs",
      "Hazard, warning and mandatory PPE boards",
      "Photoluminescent signs for unlit escape routes",
      "Custom sizes, wording and languages on request",
    ],
  },
  {
    slug: "fire-safety-training",
    name: "Safety Training",
    image: "fire-safety-training",
    summary:
      "On-site fire safety training and evacuation drills, so equipment on the wall is equipment people can actually use.",
    paragraphs: [
      "Equipment is only half of fire safety. We run on-site training covering fire behaviour, extinguisher selection and live use, evacuation procedure and the duties of fire wardens.",
      "Sessions are practical and run at your premises around shift patterns, and can be followed by a mock evacuation drill so the plan is tested under something closer to real conditions.",
    ],
    bullets: [
      "Fire behaviour and fire classes",
      "Hands-on extinguisher use by class of fire",
      "Evacuation procedure and fire warden duties",
      "Mock drills to test the site's evacuation plan",
      "Delivered on site, scheduled around shifts",
    ],
  },
  {
    slug: "ceramic-fiber-insulation",
    name: "Ceramic Fiber Insulation",
    image: "ceramic-fiber-insulation",
    summary:
      "High-temperature ceramic fibre blanket, board, rope and cloth for furnace, boiler and pipeline insulation.",
    paragraphs: [
      "Ceramic fibre insulation holds its structure at temperatures that would destroy conventional lagging, which makes it the standard lining for furnaces, kilns, boilers and high-temperature pipework.",
      "We supply blanket, board, rope, cloth and modules in the usual densities and thicknesses, cut to the sizes a job needs.",
    ],
    bullets: [
      "Blanket, board, rope, cloth and modules",
      "Furnace, kiln, boiler and pipeline lining",
      "Expansion joints and high-temperature gasketing",
      "Range of densities and thicknesses",
      "Supplied cut to size",
    ],
  },
];

{
  const cat = cats.find((c) => c.slug === CURATED_CATEGORY);
  if (!cat) throw new Error(`Missing category for curated products: ${CURATED_CATEGORY}`);

  const taken = new Set(products.map((p) => p.slug));
  let nextId = CURATED_ID_BASE;

  for (const item of CURATED) {
    if (taken.has(item.slug)) {
      throw new Error(`Curated slug collides with a catalogue product: ${item.slug}`);
    }
    taken.add(item.slug);

    /*
     * Same self-healing rule the datasheets use: reference the photograph only
     * once it actually exists on disk. Until the client's images are dropped in
     * and `npm run service-images` has run, these render the standard
     * "image not available" placeholder rather than a broken image.
     */
    const base = `/media/services/${item.image}.webp`;
    const onDisk = existsSync(
      join(__dirname, "..", "public", "media", "services", `${item.image}-900.webp`),
    );

    products.push({
      id: nextId++,
      slug: item.slug,
      name: item.name,
      sku: null,
      summary: item.summary,
      paragraphs: item.paragraphs,
      bullets: item.bullets,
      specs: [],
      standards: [],
      datasheet: null,
      datasheetRemote: null,
      images: onDisk ? [{ src: base, remote: null, alt: item.name }] : [],
      attributes: [],
      categoryIds: [cat.id],
      hasDemo: false,
    });
  }
}

/* ------------------------------------------------------------------ *
 * Build the navigable category tree (only branches that hold products)
 * ------------------------------------------------------------------ */

const productsByCat = new Map();
for (const prod of products) {
  for (const id of prod.categoryIds) {
    if (!productsByCat.has(id)) productsByCat.set(id, []);
    productsByCat.get(id).push(prod.id);
  }
}

/** Total products in a category including all descendants. */
function deepCount(id) {
  const ids = subtreeIds(id);
  let n = 0;
  const seen = new Set();
  for (const cid of ids) {
    for (const pid of productsByCat.get(cid) || []) {
      if (!seen.has(pid)) {
        seen.add(pid);
        n++;
      }
    }
  }
  return n;
}

function buildNode(cat, depth) {
  const children = cats
    .filter((c) => c.parent === cat.id)
    .map((c) => buildNode(c, depth + 1))
    .filter((n) => n.count > 0) // drop empty/legacy branches
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return {
    id: cat.id,
    name: RENAME[cat.slug] || cat.name,
    slug: cat.slug,
    depth,
    count: deepCount(cat.id),
    blurb: BLURB[cat.slug] || null,
    children,
  };
}

const tree = MAIN_ORDER.map((slug) => {
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) throw new Error(`Missing main category: ${slug}`);
  return buildNode(cat, 0);
});

/* Map every product to its top-level category for breadcrumbs + routing. */
const mainSubtrees = tree.map((t) => ({ slug: t.slug, ids: subtreeIds(t.id) }));

let rehomed = 0;
let hinted = 0;

for (const prod of products) {
  const main = mainSubtrees.find((m) => prod.categoryIds.some((id) => m.ids.has(id)));

  if (main) {
    prod.mainCategory = main.slug;
  } else {
    // Walk this product's taxonomy terms (and their ancestors) looking for a
    // legacy branch we know how to re-home.
    let target = null;
    for (const id of prod.categoryIds) {
      let cur = catById.get(id);
      while (cur && !target) {
        target = rehomeBySlug.get(cur.slug) || null;
        cur = cur.parent ? catById.get(cur.parent) : null;
      }
      if (target) break;
    }
    if (target) {
      rehomed++;
    } else {
      const hit = NAME_HINTS.find(([re]) => re.test(prod.name));
      if (hit) {
        target = hit[1];
        hinted++;
      }
    }
    prod.mainCategory = target || "other-products";
  }

  // Human-readable category labels, deepest first (used as filter chips).
  prod.categoryNames = prod.categoryIds
    .map((id) => catById.get(id))
    .filter(Boolean)
    .map((c) => RENAME[c.slug] || c.name);
  prod.categorySlugs = prod.categoryIds
    .map((id) => catById.get(id)?.slug)
    .filter(Boolean);
}

/* Top-level counts must reflect the final routing, not the raw taxonomy. */
for (const node of tree) {
  node.count = products.filter((p) => p.mainCategory === node.slug).length;
}

/*
 * The mega menu lists a category's subcategories. A category that has none
 * renders as a bare heading with an empty list beneath it, which reads as
 * broken sitting beside twelve populated columns — and it hides everything in
 * that category behind one more click.
 *
 * So give those categories a short list of their own products to show instead.
 * Krushnam's own offerings lead, because they are the point of the category
 * rather than the leftovers that landed in it. Name and slug only: the header
 * is a client component rendered on every page and must not pull in the
 * product corpus.
 */
for (const node of tree) {
  if (node.children.length > 0) continue;

  node.featured = products
    .filter((p) => p.mainCategory === node.slug)
    .sort((a, b) => (b.id >= CURATED_ID_BASE ? 1 : 0) - (a.id >= CURATED_ID_BASE ? 1 : 0))
    .slice(0, 5)
    .map((p) => ({ slug: p.slug, name: p.name }));
}

/**
 * Re-homed products sit under a subcategory that isn't in their new parent's
 * child list. Give each main category a synthetic "More in this category"
 * bucket so every product is reachable by browsing, not just by search.
 */
for (const node of tree) {
  const inNode = products.filter((p) => p.mainCategory === node.slug);
  const childIds = new Set();
  const collect = (n) => {
    childIds.add(n.id);
    n.children.forEach(collect);
  };
  node.children.forEach(collect);

  const unreachable = inNode.filter((p) => !p.categoryIds.some((id) => childIds.has(id)));
  if (unreachable.length && node.children.length) {
    node.children.push({
      id: -node.id,
      name: "More in this category",
      slug: `${node.slug}-more`,
      depth: 1,
      count: unreachable.length,
      blurb: null,
      children: [],
      synthetic: true,
    });
    for (const p of unreachable) p.syntheticBucket = `${node.slug}-more`;
  }
}

/* ------------------------------------------------------------------ *
 * Write
 * ------------------------------------------------------------------ */

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "products.json"), JSON.stringify(products));
writeFileSync(join(OUT_DIR, "categories.json"), JSON.stringify(tree));

/*
 * Compact search index served as a static asset and fetched on first use, so
 * the 841-product corpus never lands in the initial JS bundle.
 */
const nameBySlug = new Map(tree.map((t) => [t.slug, t.name]));
const searchIndex = products.map((p) => [
  p.slug,
  p.name,
  p.mainCategory,
  nameBySlug.get(p.mainCategory) || "Products",
  p.images[0]?.src || "",
  // Extra searchable terms beyond the name (deduped, lowercased).
  [...new Set([p.sku, ...p.categoryNames, ...p.standards].filter(Boolean))]
    .join(" ")
    .toLowerCase(),
]);
const PUBLIC_DIR = join(__dirname, "..", "public");
mkdirSync(PUBLIC_DIR, { recursive: true });
writeFileSync(join(PUBLIC_DIR, "search-index.json"), JSON.stringify(searchIndex));

// Flat image manifest for the download step. Curated products carry no remote
// — their photography is supplied by the client, not mirrored — so they are
// filtered out here rather than handed to the fetcher as the string "null".
const imageList = [
  ...new Set(
    products.flatMap((p) =>
      p.images.filter((i) => i.remote).map((i) => `${i.remote}\t${i.src}`),
    ),
  ),
];
writeFileSync(join(__dirname, "raw", "images.txt"), imageList.join("\n"));

// Datasheet manifest for the PDF mirroring step.
const pdfList = [
  ...new Set(
    products
      .filter((p) => p.datasheetRemote)
      .map((p) => `${p.datasheetRemote}\t${p.datasheet}`),
  ),
];
writeFileSync(join(__dirname, "raw", "datasheets.txt"), pdfList.join("\n"));

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */

const withImg = products.filter((p) => p.images.length).length;
const withSpec = products.filter((p) => p.specs.length).length;
const withStd = products.filter((p) => p.standards.length).length;
const withPdf = products.filter((p) => p.datasheet).length;
const withSummary = products.filter((p) => p.summary.length > 30).length;

console.log(`products          ${products.length}`);
console.log(`  with image      ${withImg}`);
console.log(`  with summary    ${withSummary}`);
console.log(`  with specs      ${withSpec}`);
console.log(`  with standards  ${withStd}`);
console.log(`  with datasheet  ${withPdf}`);
console.log(`  re-homed        ${rehomed} (legacy branch -> main category)`);
console.log(`  name-routed     ${hinted}`);
console.log(`  unclassified    ${products.filter((p) => p.mainCategory === "other-products").length}`);
console.log(`unique images     ${imageList.length}`);
console.log(`\ncategories (${tree.length} top level)`);
for (const t of tree) {
  console.log(`  ${t.name.padEnd(34)} ${String(t.count).padStart(4)}  (${t.children.length} subcats)`);
}
