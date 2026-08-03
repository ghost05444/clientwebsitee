"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "./Link";

export type ShowcasePanel = {
  slug: string;
  name: string;
  tagline: string;
  href: string;
  /** Pre-sized WebP path, or null when the category has no imagery. */
  image: string | null;
  count: number;
};

/**
 * Scroll-driven horizontal showcase.
 *
 * Desktop: a tall outer wrapper provides the scroll distance, an inner
 * viewport sticks below the header, and the track translates on X in
 * proportion to how far through the wrapper the page has scrolled. The
 * result is a horizontal pan driven entirely by vertical scrolling.
 *
 * Everything else — touch devices, reduced motion, and anything under `lg`
 * where the panels would not fit — renders exactly the same markup as a
 * normal vertical grid. The branch is a single `enabled` flag rather than
 * two component trees, so there is no risk of the two drifting apart.
 */
export function HorizontalShowcase({ panels }: { panels: ShowcasePanel[] }) {
  const [enabled, setEnabled] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);

  /* ---- Decide whether the horizontal mode applies at all --------------- */
  useEffect(() => {
    const queries = [
      window.matchMedia("(min-width: 1024px)"),
      window.matchMedia("(pointer: fine)"),
      window.matchMedia("(prefers-reduced-motion: no-preference)"),
    ];

    const evaluate = () => setEnabled(queries.every((q) => q.matches));
    evaluate();

    queries.forEach((q) => q.addEventListener("change", evaluate));
    return () => queries.forEach((q) => q.removeEventListener("change", evaluate));
  }, []);

  /* ---- Drive the track ------------------------------------------------- */
  useEffect(() => {
    if (!enabled) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const wrapper = wrapperRef.current;
      const track = trackRef.current;
      if (!wrapper || !track) return;

      const rect = wrapper.getBoundingClientRect();
      // Distance the wrapper travels while its sticky child is pinned.
      const travel = wrapper.offsetHeight - window.innerHeight;
      if (travel <= 0) return;

      // How far the track has to slide: its full width minus the width of the
      // window it slides behind. That window is the sticky parent — the track
      // itself is a flex row with no width constraint, so it stretches to fit
      // its children and its own scrollWidth and clientWidth are always equal.
      const viewport = track.parentElement;
      if (!viewport) return;
      const distance = track.scrollWidth - viewport.clientWidth;
      if (distance <= 0) return;

      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      track.style.transform = `translate3d(${-(progress * distance).toFixed(2)}px, 0, 0)`;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
      if (trackRef.current) trackRef.current.style.transform = "";
    };
  }, [enabled]);

  const cards = panels.map((panel, i) => (
    <PanelCard key={panel.slug} panel={panel} index={i} horizontal={enabled} />
  ));

  // Fallback brings its own gutter: the caller renders this full-bleed so the
  // horizontal track can use the whole viewport width.
  if (!enabled) {
    return (
      <div className="container-page">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-stagger="80">
          {cards}
        </ul>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      // Height sets how much scrolling the pan consumes: one viewport to pin,
      // plus 0.85 of one per additional panel.
      style={{ height: `${100 * (1 + (panels.length - 1) * 0.85)}vh` }}
      className="relative"
    >
      {/* Offsets and the calc live in `style` rather than arbitrary Tailwind
          values: `calc()` needs real spaces around its operator, which would
          have to be underscore-escaped in a class name. */}
      <div
        className="sticky flex items-center overflow-hidden"
        style={{
          top: "var(--spacing-header-lg)",
          height: "calc(100vh - var(--spacing-header-lg))",
        }}
      >
        <ul
          ref={trackRef}
          className="flex gap-5 will-change-transform"
          style={{ paddingInline: "max(1rem, calc((100vw - 1320px) / 2 + 2rem))" }}
        >
          {cards}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function PanelCard({
  panel,
  index,
  horizontal,
}: {
  panel: ShowcasePanel;
  index: number;
  horizontal: boolean;
}) {
  return (
    <li
      className={
        horizontal
          ? "w-[min(78vw,24rem)] shrink-0"
          : "reveal"
      }
    >
      <Link
        href={panel.href}
        className="spot group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/5"
      >
        {/* Taller in horizontal mode: the card sits in a pinned full-height
            band, and a short card leaves most of it empty. */}
        <div
          className={`relative overflow-hidden bg-ink-50 p-6 ${
            horizontal ? "py-10" : ""
          }`}
        >
          <span
            className="text-outline absolute right-4 top-2 font-display text-6xl font-bold leading-none text-ink-300"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {panel.image ? (
            <div data-parallax="0.04" className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={panel.image}
                alt=""
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
                className={`mx-auto w-full object-contain transition-transform duration-300 group-hover:scale-105 ${
                  horizontal ? "h-56" : "h-32"
                }`}
              />
            </div>
          ) : (
            <div className={horizontal ? "h-56" : "h-32"} aria-hidden="true" />
          )}
        </div>

        <div className="flex flex-1 flex-col border-t border-ink-100 p-5">
          <h3 className="font-display text-lg font-bold leading-tight text-ink-900 transition-colors group-hover:text-brand-600">
            {panel.name}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-500">
            {panel.tagline}
          </p>

          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-xs font-semibold text-ink-400">
              {panel.count} products
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-brand-600">
              Explore
              <svg
                viewBox="0 0 20 20"
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
