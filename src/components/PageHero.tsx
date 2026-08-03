import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { ProductMosaic } from "./ProductMosaic";

/**
 * Compact page header used on every interior page — keeps breadcrumb, title
 * and supporting copy in one consistent block.
 *
 * Carries a restrained version of the home page's fire treatment: a warm
 * wash, a blurred product-photo backdrop and a molten bottom rule. Deliberately
 * lighter than the hero — these sit above dense catalogue content, so the
 * atmosphere has to stay out of the way of scanning.
 */
export function PageHero({
  crumbs,
  title,
  description,
  eyebrow,
  meta,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  description?: string | null;
  eyebrow?: string;
  meta?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="warm-wash relative overflow-hidden">
      <ProductMosaic variant="light" opacity={0.18} />

      <div
        className="heat-top pointer-events-none absolute inset-x-0 top-0 h-full opacity-60"
        aria-hidden="true"
      />

      {/* Molten hairline instead of a flat border. */}
      <div
        className="ember-rule absolute inset-x-0 bottom-0 h-px opacity-70"
        aria-hidden="true"
      />

      <div className="container-page relative z-[1] py-5 sm:py-6">
        <Breadcrumbs items={crumbs} />

        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="max-w-3xl">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl lg:text-4xl">
              {title}
            </h1>

            {description && (
              <p className="mt-2.5 text-sm leading-relaxed text-ink-600 sm:text-base">
                {description}
              </p>
            )}
          </div>

          {meta && (
            <p className="shrink-0 text-sm font-medium text-ink-500">{meta}</p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
