"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "./Link";

/**
 * Product search overlay.
 *
 * The index is a static JSON asset fetched the first time the dialog opens,
 * so the 841-product corpus stays out of the initial bundle. Matching is a
 * simple token-AND scan — fast enough for this corpus and dependency-free.
 */

type Row = [
  slug: string,
  name: string,
  categorySlug: string,
  categoryName: string,
  image: string,
  extra: string,
];

type Hit = { slug: string; name: string; category: string; image: string; score: number };

const MAX_RESULTS = 8;

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [index, setIndex] = useState<Row[] | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lazy-load the index on first open.
  useEffect(() => {
    if (!open || index) return;
    let cancelled = false;
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data: Row[]) => {
        if (!cancelled) setIndex(data);
      })
      .catch(() => {
        if (!cancelled) setIndex([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open, index]);

  // Clear the previous search when the dialog is reopened.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) {
      setQuery("");
      setActive(0);
    }
  }

  useEffect(() => {
    if (!open) return;
    // Delay focus until the dialog has painted, or iOS skips the keyboard.
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = useMemo<Hit[]>(() => {
    const q = query.trim().toLowerCase();
    if (!index || q.length < 2) return [];

    const tokens = q.split(/\s+/).filter(Boolean);
    const hits: Hit[] = [];

    for (const [slug, name, , categoryName, image, extra] of index) {
      const lowerName = name.toLowerCase();
      const haystack = `${lowerName} ${categoryName.toLowerCase()} ${extra}`;
      if (!tokens.every((t) => haystack.includes(t))) continue;

      // Rank: exact prefix > name match > anywhere.
      let score = 0;
      if (lowerName.startsWith(q)) score += 100;
      if (lowerName.includes(q)) score += 40;
      for (const t of tokens) if (lowerName.includes(t)) score += 10;
      score -= Math.min(lowerName.length / 20, 5);

      hits.push({ slug, name, category: categoryName, image, score });
    }

    return hits.sort((a, b) => b.score - a.score).slice(0, MAX_RESULTS);
  }, [index, query]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      window.location.href = `/product/${results[active].slug}`;
    }
  };

  const showEmpty = query.trim().length >= 2 && index && results.length === 0;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Search products">
      <div
        className="absolute inset-0 bg-ink-950/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative mx-auto mt-0 flex h-full w-full max-w-2xl flex-col bg-white sm:mt-[8vh] sm:h-auto sm:max-h-[70vh] sm:rounded-2xl sm:shadow-2xl">
        <div className="flex shrink-0 items-center gap-2 border-b border-ink-200 px-3 sm:px-4">
          <svg
            viewBox="0 0 20 20"
            className="h-5 w-5 shrink-0 text-ink-400"
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
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              // Re-point the keyboard cursor at the top hit for the new query.
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search helmets, gloves, harnesses…"
            aria-label="Search products"
            className="h-14 flex-1 bg-transparent text-base text-ink-900 outline-none placeholder:text-ink-400"
            autoComplete="off"
            /* 16px min font-size prevents iOS zoom-on-focus. */
            style={{ fontSize: "16px" }}
          />

          <button
            type="button"
            onClick={onClose}
            className="tap -mr-1 flex shrink-0 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100"
            aria-label="Close search"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {query.trim().length < 2 && (
            <p className="px-4 py-8 text-center text-sm text-ink-500">
              Type at least 2 characters to search {index ? index.length : "800+"} products.
            </p>
          )}

          {showEmpty && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-ink-800">
                No products match “{query}”.
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Try a broader term, or{" "}
                <Link href="/contact" onClick={onClose} className="text-brand-600 underline">
                  ask us directly
                </Link>
                .
              </p>
            </div>
          )}

          {results.length > 0 && (
            <ul className="p-2">
              {results.map((hit, i) => (
                <li key={hit.slug}>
                  <Link
                    href={`/product/${hit.slug}`}
                    onClick={onClose}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-center gap-3 rounded-xl p-2 transition-colors ${
                      i === active ? "bg-ink-100" : "hover:bg-ink-50"
                    }`}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ink-200 bg-white">
                      {hit.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={hit.image.replace(/\.webp$/, "-400.webp")}
                          alt=""
                          width={48}
                          height={48}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-ink-400">—</span>
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink-900">
                        {hit.name}
                      </span>
                      <span className="block truncate text-xs text-ink-500">
                        {hit.category}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {results.length > 0 && (
          <div className="hidden shrink-0 items-center gap-4 border-t border-ink-200 px-4 py-2 text-[11px] text-ink-500 sm:flex">
            <span>
              <kbd className="rounded border border-ink-200 bg-ink-50 px-1">↑</kbd>{" "}
              <kbd className="rounded border border-ink-200 bg-ink-50 px-1">↓</kbd> navigate
            </span>
            <span>
              <kbd className="rounded border border-ink-200 bg-ink-50 px-1">↵</kbd> open
            </span>
            <span>
              <kbd className="rounded border border-ink-200 bg-ink-50 px-1">esc</kbd> close
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
