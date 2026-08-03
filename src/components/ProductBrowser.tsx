"use client";

import { useMemo, useState, useDeferredValue } from "react";
import { Link } from "./Link";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/catalog";

/**
 * Client-side browsing surface for a category: filter by subcategory and
 * standard, sort, and page in with "Load more".
 *
 * Filtering runs in the browser over an already-rendered set (largest category
 * is ~180 products), so it stays instant with no network round-trip while the
 * first page remains fully server-rendered for SEO.
 */

export type Facet = { slug: string; name: string; count: number };

type SortKey = "featured" | "name-asc" | "name-desc" | "documented";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "name-asc", label: "Name (A–Z)" },
  { key: "name-desc", label: "Name (Z–A)" },
  { key: "documented", label: "Most detailed" },
];

const PAGE_SIZE = 24;

export function ProductBrowser({
  products,
  subcategories,
  standards,
  categorySlug,
}: {
  products: Product[];
  subcategories: Facet[];
  standards: string[];
  categorySlug: string;
}) {
  const [query, setQuery] = useState("");
  const [sub, setSub] = useState<string | null>(null);
  const [standard, setStandard] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();

    let list = products.filter((p) => {
      if (sub && !p.categorySlugs.includes(sub) && p.syntheticBucket !== sub) return false;
      if (standard && !p.standards.includes(standard)) return false;
      if (q) {
        const hay = `${p.name} ${p.summary} ${p.categoryNames.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list = list.slice();
    switch (sort) {
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "documented":
        list.sort(
          (a, b) =>
            b.specs.length * 2 + b.standards.length * 3 + b.paragraphs.length -
            (a.specs.length * 2 + a.standards.length * 3 + a.paragraphs.length),
        );
        break;
      default:
        // Featured: images and documentation first, then alphabetical.
        list.sort(
          (a, b) =>
            Number(b.images.length > 0) - Number(a.images.length > 0) ||
            Number(b.summary.length > 0) - Number(a.summary.length > 0) ||
            a.name.localeCompare(b.name),
        );
    }
    return list;
  }, [products, deferredQuery, sub, standard, sort]);

  const shown = filtered.slice(0, visible);
  const activeFilters = (sub ? 1 : 0) + (standard ? 1 : 0);

  const reset = () => {
    setSub(null);
    setStandard(null);
    setQuery("");
    setVisible(PAGE_SIZE);
  };

  return (
    <div>
      {/* ---- Toolbar ---- */}
      <div className="sticky top-16 z-20 -mx-4 border-b border-ink-200 bg-white/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:top-20 lg:mx-0 lg:rounded-xl lg:border lg:px-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <svg
              viewBox="0 0 20 20"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.45 4.39l3.58 3.58a1 1 0 01-1.42 1.42l-3.58-3.58A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>

            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Filter in this category…"
              aria-label="Filter products in this category"
              className="h-11 w-full rounded-lg border border-ink-200 bg-white pl-9 pr-3 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500"
              style={{ fontSize: "16px" }}
            />
          </div>

          {(subcategories.length > 0 || standards.length > 0) && (
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              aria-expanded={filtersOpen}
              className={`btn-secondary shrink-0 px-3 lg:hidden ${
                activeFilters ? "border-brand-300 bg-brand-50 text-brand-700" : ""
              }`}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v.938a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629v-.938c0-.365.266-.676.628-.74z" />
              </svg>
              Filters
              {activeFilters > 0 && (
                <span className="ml-0.5 rounded-full bg-brand-600 px-1.5 text-[11px] text-white">
                  {activeFilters}
                </span>
              )}
            </button>
          )}

          <label className="sr-only" htmlFor="sort">
            Sort products
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="hidden h-11 shrink-0 rounded-lg border border-ink-200 bg-white px-3 text-sm font-medium text-ink-800 outline-none transition-colors focus:border-brand-500 sm:block"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter panel — inline on desktop, collapsible on mobile. */}
        <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          {subcategories.length > 0 && (
            <FacetRow label="Type">
              <Chip active={sub === null} onClick={() => setSub(null)}>
                All
              </Chip>
              {subcategories.map((s) => (
                <Chip
                  key={s.slug}
                  active={sub === s.slug}
                  onClick={() => {
                    setSub(sub === s.slug ? null : s.slug);
                    setVisible(PAGE_SIZE);
                  }}
                >
                  {s.name}
                  <span className="ml-1 text-[11px] opacity-60">{s.count}</span>
                </Chip>
              ))}
            </FacetRow>
          )}

          {standards.length > 0 && (
            <FacetRow label="Standard">
              <Chip active={standard === null} onClick={() => setStandard(null)}>
                Any
              </Chip>
              {standards.map((s) => (
                <Chip
                  key={s}
                  active={standard === s}
                  onClick={() => {
                    setStandard(standard === s ? null : s);
                    setVisible(PAGE_SIZE);
                  }}
                >
                  {s}
                </Chip>
              ))}
            </FacetRow>
          )}
        </div>
      </div>

      {/* ---- Result count ---- */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-4">
        <p className="text-sm text-ink-500">
          Showing <span className="font-semibold text-ink-900">{shown.length}</span> of{" "}
          <span className="font-semibold text-ink-900">{filtered.length}</span> products
        </p>

        {(activeFilters > 0 || query) && (
          <button
            type="button"
            onClick={reset}
            className="flex min-h-11 items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ---- Grid ---- */}
      {shown.length > 0 ? (
        <>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {shown.map((product, i) => (
              <li key={product.id}>
                <ProductCard
                  product={product}
                  priority={i < 4}
                  sizes="(min-width: 1280px) 280px, (min-width: 768px) 30vw, 45vw"
                />
              </li>
            ))}
          </ul>

          {visible < filtered.length && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="btn-secondary px-8"
              >
                Load {Math.min(PAGE_SIZE, filtered.length - visible)} more
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-ink-300 py-16 text-center">
          <p className="font-medium text-ink-800">No products match these filters.</p>
          <p className="mt-1 text-sm text-ink-500">
            Try clearing them, or{" "}
            <Link href="/contact" className="text-brand-600 underline">
              tell us what you need
            </Link>
            .
          </p>
          <button type="button" onClick={reset} className="btn-secondary mt-5">
            Clear filters
          </button>
        </div>
      )}

      {/* Deep-link back to the plain category URL for crawlers/sharing. */}
      <noscript>
        <p className="mt-6 text-sm text-ink-500">
          Filtering requires JavaScript.{" "}
          <Link href={`/products/${categorySlug}`} className="text-brand-600 underline">
            View all products in this category
          </Link>
          .
        </p>
      </noscript>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function FacetRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 flex items-start gap-3 border-t border-ink-100 pt-3">
      <span className="mt-2 hidden shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-400 sm:block">
        {label}
      </span>
      <div className="no-scrollbar -mx-1 flex flex-wrap gap-1.5 overflow-x-auto px-1">
        {children}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-9 shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[13px] font-medium transition-colors ${
        active
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50"
      }`}
    >
      {children}
    </button>
  );
}
