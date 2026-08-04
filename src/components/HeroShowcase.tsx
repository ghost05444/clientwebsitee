import { Link } from "./Link";
import { ProductImage } from "./ProductImage";
import { getCategoryHeroImage, type Category } from "@/lib/catalog";

/**
 * The equipment display beside the hero copy.
 *
 * Two genuinely different layouts, not one grid reflowed:
 *
 *  - Phone: a snap-scrolling rail with the next card peeking. A 2x2 grid on a
 *    375px screen gives four cramped tiles and no sense that there is more
 *    behind them; a rail reads as a catalogue you can push through, and it is
 *    the interaction people already expect on a phone.
 *  - Desktop: a staggered stack. Cards sit at different vertical offsets and
 *    drift at different parallax rates, so the group has depth instead of
 *    reading as a flat 2x2 block.
 *
 * The technical framing — corner ticks, standards rail, target rings — is what
 * stops the panel looking like four product photos on a dark rectangle. All of
 * it is decorative and `aria-hidden`.
 */

/** Parallax factor per card, so the stack separates as the page scrolls. */
const DEPTH = [0.09, 0.03, 0.05, 0.11];
/** Vertical offset per card at `lg`, in rem. */
const OFFSET = ["0", "2.25", "-1.25", "1"];

export function HeroShowcase({ categories }: { categories: Category[] }) {
  return (
    <div className="relative">
      {/* --- Decoration behind the cards ---------------------------------- */}

      {/* Concentric target rings — a faint technical anchor for the stack. */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 lg:block"
        aria-hidden="true"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute inset-0 rounded-full border border-white/[0.055]"
            style={{ transform: `scale(${1 - i * 0.26})` }}
          />
        ))}
      </div>

      {/* Vertical hazard rail down the outer edge. */}
      <div
        className="hazard-rule pointer-events-none absolute -right-4 top-6 -z-10 hidden w-1 rounded-full opacity-40 lg:block xl:-right-6"
        style={{ height: "calc(100% - 3rem)" }}
        aria-hidden="true"
      />

      {/* Standards rail — the compliance story, set as technical marginalia. */}
      <div
        className="pointer-events-none absolute -left-8 top-1/2 hidden -translate-y-1/2 xl:block"
        aria-hidden="true"
      >
        <p
          className="whitespace-nowrap font-display text-[10px] font-semibold uppercase tracking-[0.32em] text-white/25"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          EN 397 · IS 2925 · EN 166 · EN 388 · EN 361
        </p>
      </div>

      {/* --- Cards -------------------------------------------------------- */}
      {/* The negative margin + padding lets the rail bleed to the screen edge
          on phones while keeping the first card aligned to the page gutter. */}
      <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
        {categories.map((cat, i) => {
          const img = getCategoryHeroImage(cat);

          return (
            <li
              key={cat.slug}
              /* Cards are ~62% of viewport on a phone, so the next one peeks
                 and the rail is visibly scrollable without any affordance. */
              className="w-[62vw] max-w-[15rem] shrink-0 snap-start sm:w-[15rem] lg:w-auto lg:max-w-none"
              data-parallax={DEPTH[i % DEPTH.length]}
              data-parallax-clamp="34"
              style={{ ["--lg-offset" as string]: `${OFFSET[i % OFFSET.length]}rem` }}
            >
              <Link
                href={`/products/${cat.slug}`}
                className="tilt spot spot-dark group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] p-3 shadow-[0_10px_38px_-14px_rgb(0_0_0/0.75)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-flame-400/55 hover:bg-white/[0.1] hover:shadow-[0_20px_48px_-14px_rgb(244_95_7/0.5)] lg:translate-y-[var(--lg-offset)] sm:p-3.5"
              >
                {/* Ember wash, lifts on hover. */}
                <span
                  className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-flame-500/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />

                {/* Corner ticks — instrument framing around the product. */}
                <span
                  className="absolute left-2 top-2 h-3 w-3 border-l border-t border-white/25 transition-colors duration-300 group-hover:border-flame-400/80"
                  aria-hidden="true"
                />
                <span
                  className="absolute right-2 top-2 h-3 w-3 border-r border-t border-white/25 transition-colors duration-300 group-hover:border-flame-400/80"
                  aria-hidden="true"
                />

                {/* The catalogue is shot on white, so the product needs a light
                    plate. Radial rather than flat, so it reads as a lit surface
                    rather than a pasted-on box. */}
                <div
                  className="rounded-xl p-3"
                  style={{
                    background:
                      "radial-gradient(120% 100% at 50% 0%, #fff 0%, #f2f5f8 55%, #e4e9ef 100%)",
                  }}
                >
                  <ProductImage
                    image={img}
                    priority={i < 2}
                    sizes="(min-width: 1024px) 200px, 55vw"
                    fallbackLabel={cat.name}
                    className="drop-shadow-[0_6px_10px_rgb(14_20_28/0.2)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.08]"
                  />
                </div>

                <p className="mt-3 font-display text-[15px] font-bold leading-tight text-white transition-colors group-hover:text-flame-300">
                  {cat.name}
                </p>

                <p className="mt-auto flex items-center gap-1.5 pt-1.5 text-[11px] font-medium text-ink-400">
                  <span className="h-1 w-1 rounded-full bg-flame-500" aria-hidden="true" />
                  {cat.count} products
                </p>
              </Link>
            </li>
          );
        })}

        {/* Rail tail-card: makes the rail feel like an entry point rather than
            a truncated list. Phone only — desktop has the nav for this. */}
        <li className="w-[46vw] max-w-[11rem] shrink-0 snap-start lg:hidden">
          <Link
            href="/products"
            className="flex h-full flex-col items-start justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-4 text-white transition-colors active:bg-white/[0.07]"
          >
            <span className="font-display text-base font-bold leading-tight">
              All 14 categories
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-flame-300">
              Browse catalogue
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
