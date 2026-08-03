import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/**
 * Compact page header used on every interior page — keeps breadcrumb, title
 * and supporting copy in one consistent block.
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
    <div className="border-b border-ink-200 bg-ink-50">
      <div className="container-page py-5 sm:py-6">
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
