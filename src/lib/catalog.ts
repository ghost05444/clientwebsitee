/**
 * Typed access layer over the generated catalog data.
 *
 * Both JSON files are produced by `npm run data` from the scraped source and
 * are imported statically, so every lookup here is available at build time and
 * the whole site can be pre-rendered.
 */
import productsJson from "@/data/products.json";
import categoriesJson from "@/data/categories.json";

export type Spec = { label: string; value: string };

export type ProductImage = {
  src: string;
  alt: string;
};

export type Attribute = { name: string; values: string[] };

export type Product = {
  id: number;
  slug: string;
  name: string;
  sku: string | null;
  summary: string;
  paragraphs: string[];
  bullets: string[];
  specs: Spec[];
  standards: string[];
  datasheet: string | null;
  images: ProductImage[];
  attributes: Attribute[];
  categoryIds: number[];
  categoryNames: string[];
  categorySlugs: string[];
  mainCategory: string;
  syntheticBucket?: string;
  hasDemo: boolean;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  depth: number;
  count: number;
  blurb: string | null;
  children: Category[];
  synthetic?: boolean;
};

/**
 * The generated JSON additionally records where each asset was scraped
 * from — `images[].remote` and `datasheetRemote`. Nothing in the UI reads
 * either: images resolve through the local `/media/...` variants and
 * datasheets through the local `/datasheets/...` path.
 *
 * They are stripped here rather than ignored, because "unused" is not the
 * same as "absent". `ProductGallery` and `ProductBrowser` are client
 * components, so whatever they are handed is serialised into the RSC payload
 * of the page — which put the source site's domain into the shipped HTML of
 * every product and category page. Removing the fields at the boundary fixes
 * every consumer at once, and dropping them from `ProductImage` means a
 * future component cannot reintroduce the leak without a type error.
 */
type RawProduct = Omit<Product, "images"> & {
  images: (ProductImage & { remote?: string })[];
  datasheetRemote?: string;
};

function stripProvenance({ datasheetRemote: _, ...product }: RawProduct): Product {
  return {
    ...product,
    images: product.images.map(({ src, alt }) => ({ src, alt })),
  };
}

export const products: Product[] = (
  productsJson as unknown as RawProduct[]
).map(stripProvenance);

export const categories = categoriesJson as unknown as Category[];

/* ------------------------------------------------------------------ *
 * Indexes (built once per process)
 * ------------------------------------------------------------------ */

const productBySlug = new Map(products.map((p) => [p.slug, p]));

const allCategories: Category[] = [];
const categoryBySlug = new Map<string, Category>();
const parentBySlug = new Map<string, Category | null>();

(function indexCategories(nodes: Category[], parent: Category | null) {
  for (const node of nodes) {
    allCategories.push(node);
    categoryBySlug.set(node.slug, node);
    parentBySlug.set(node.slug, parent);
    indexCategories(node.children, node);
  }
})(categories, null);

/** Products grouped by their resolved top-level category. */
const productsByMain = new Map<string, Product[]>();
for (const p of products) {
  const list = productsByMain.get(p.mainCategory) ?? [];
  list.push(p);
  productsByMain.set(p.mainCategory, list);
}

/* ------------------------------------------------------------------ *
 * Lookups
 * ------------------------------------------------------------------ */

export function getProduct(slug: string): Product | undefined {
  return productBySlug.get(slug);
}

export function getCategory(slug: string): Category | undefined {
  return categoryBySlug.get(slug);
}

export function getParentCategory(slug: string): Category | null {
  return parentBySlug.get(slug) ?? null;
}

export function getAllCategories(): Category[] {
  return allCategories;
}

/** Top-level categories only, in curated menu order. */
export function getMainCategories(): Category[] {
  return categories;
}

/** Every slug in a category's subtree, including its own. */
export function subtreeSlugs(category: Category): Set<string> {
  const out = new Set<string>();
  const walk = (n: Category) => {
    out.add(n.slug);
    n.children.forEach(walk);
  };
  walk(category);
  return out;
}

/**
 * All products belonging to a category, including everything nested beneath it.
 *
 * Top-level categories resolve via `mainCategory` (which accounts for products
 * re-homed out of the source site's legacy taxonomy branches). Deeper
 * categories match on the product's own taxonomy slugs. Synthetic
 * "More in this category" buckets collect the re-homed remainder.
 */
export function getProductsInCategory(category: Category): Product[] {
  if (category.synthetic) {
    return products.filter((p) => p.syntheticBucket === category.slug);
  }

  if (category.depth === 0) {
    return productsByMain.get(category.slug) ?? [];
  }

  const slugs = subtreeSlugs(category);
  return products.filter((p) => p.categorySlugs.some((s) => slugs.has(s)));
}

/** Breadcrumb trail from top-level category down to (and including) `slug`. */
export function getCategoryTrail(slug: string): Category[] {
  const trail: Category[] = [];
  let node = categoryBySlug.get(slug) ?? null;
  while (node) {
    trail.unshift(node);
    node = parentBySlug.get(node.slug) ?? null;
  }
  return trail;
}

/** The top-level category a product lives under. */
export function getProductMainCategory(product: Product): Category | undefined {
  return categoryBySlug.get(product.mainCategory);
}

/**
 * Breadcrumb trail for a product: top-level category plus, where one applies,
 * the subcategory it sits in.
 *
 * The source taxonomy nests up to four levels but only depth 0 and 1 have
 * routes, so a deeper match is walked back up to its depth-1 ancestor. Without
 * this the crumb would link to a page that was never generated.
 */
export function getProductTrail(product: Product): Category[] {
  const main = getProductMainCategory(product);
  if (!main) return [];

  const inMain = subtreeSlugs(main);

  // Prefer the deepest matching node, then climb to a linkable depth.
  let best: Category | null = null;
  for (const slug of product.categorySlugs) {
    if (!inMain.has(slug)) continue;
    const node = categoryBySlug.get(slug);
    if (node && (!best || node.depth > best.depth)) best = node;
  }

  while (best && best.depth > 1) {
    best = parentBySlug.get(best.slug) ?? null;
  }

  return best && best.slug !== main.slug ? [main, best] : [main];
}

/* ------------------------------------------------------------------ *
 * Related products
 * ------------------------------------------------------------------ */

/** Siblings from the nearest shared category, preferring ones with images. */
export function getRelatedProducts(product: Product, limit = 8): Product[] {
  const trail = getProductTrail(product);
  const scope = trail[trail.length - 1];
  if (!scope) return [];

  const pool = getProductsInCategory(scope).filter((p) => p.id !== product.id);

  const fallback =
    pool.length >= limit
      ? pool
      : [
          ...pool,
          ...(productsByMain.get(product.mainCategory) ?? []).filter(
            (p) => p.id !== product.id && !pool.some((q) => q.id === p.id),
          ),
        ];

  return fallback
    .slice()
    .sort((a, b) => Number(b.images.length > 0) - Number(a.images.length > 0))
    .slice(0, limit);
}

/* ------------------------------------------------------------------ *
 * Home page selections
 * ------------------------------------------------------------------ */

/** A representative, image-bearing product for a category tile. */
export function getCategoryHeroImage(category: Category): ProductImage | null {
  const pool = getProductsInCategory(category);
  const withImage = pool.find((p) => p.images.length > 0);
  return withImage ? withImage.images[0] : null;
}

/**
 * Featured products for the home page: the best-documented item from each of
 * the largest categories, so the grid spans the full range.
 */
export function getFeaturedProducts(limit = 8): Product[] {
  const picks: Product[] = [];

  for (const cat of categories) {
    const best = getProductsInCategory(cat)
      .filter((p) => p.images.length > 0 && p.summary.length > 40)
      .sort(
        (a, b) =>
          b.specs.length + b.standards.length * 2 - (a.specs.length + a.standards.length * 2),
      )[0];
    if (best) picks.push(best);
    if (picks.length >= limit) break;
  }

  return picks.slice(0, limit);
}

/* ------------------------------------------------------------------ *
 * Search
 * ------------------------------------------------------------------ */

export type SearchDoc = {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  image: string | null;
  haystack: string;
};

/** Compact index shipped to the client for instant search. */
export function buildSearchIndex(): SearchDoc[] {
  return products.map((p) => {
    const main = categoryBySlug.get(p.mainCategory);
    return {
      slug: p.slug,
      name: p.name,
      category: main?.name ?? "Products",
      categorySlug: p.mainCategory,
      image: p.images[0]?.src ?? null,
      haystack: [p.name, p.sku, ...p.categoryNames, ...p.standards, p.summary]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    };
  });
}

/* ------------------------------------------------------------------ *
 * Facets
 * ------------------------------------------------------------------ */

/**
 * Catalogue-wide tally of standards, most common first.
 *
 * Source data cites the same standard both with and without its edition year
 * ("EN 388" and "EN 388:2016"), which would otherwise split one standard
 * across two rows and understate both. Codes are normalised to the base
 * reference for counting, and the editions seen are kept so the page can show
 * which revision the catalogue actually cites.
 */
export type StandardTally = {
  /** Base reference, e.g. "EN 388". */
  code: string;
  /** How many products cite it, across all editions. */
  count: number;
  /** Editions seen, newest first, e.g. ["2016"]. */
  editions: string[];
};

export function getStandardsTally(limit = 12): StandardTally[] {
  const counts = new Map<string, number>();
  const editions = new Map<string, Set<string>>();

  for (const product of products) {
    for (const raw of product.standards) {
      const [code, edition] = raw.split(":");
      const key = code.trim();
      if (!key) continue;

      counts.set(key, (counts.get(key) ?? 0) + 1);
      if (edition) {
        const set = editions.get(key) ?? new Set<string>();
        set.add(edition.trim());
        editions.set(key, set);
      }
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([code, count]) => ({
      code,
      count,
      editions: [...(editions.get(code) ?? [])].sort().reverse(),
    }));
}

/** How many catalogue products cite at least one standard. */
export function countCertifiedProducts(): number {
  return products.filter((p) => p.standards.length > 0).length;
}

/** Distinct base references cited anywhere in the catalogue. */
export function countDistinctStandards(): number {
  const seen = new Set<string>();
  for (const product of products) {
    for (const raw of product.standards) {
      const code = raw.split(":")[0].trim();
      if (code) seen.add(code);
    }
  }
  return seen.size;
}

/** Distinct standards present in a product set, most common first. */
export function collectStandards(list: Product[]): string[] {
  const tally = new Map<string, number>();
  for (const p of list) {
    for (const s of p.standards) tally.set(s, (tally.get(s) ?? 0) + 1);
  }
  return [...tally.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([s]) => s)
    .slice(0, 14);
}
