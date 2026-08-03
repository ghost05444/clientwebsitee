import { Link } from "./Link";
import { site } from "@/lib/site";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumb trail plus matching BreadcrumbList structured data, so the path
 * shows in search results as well as on the page.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${site.url}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="min-w-0">
        {/* Crumbs cascade in one after another via the motion driver. The
            short 45ms step keeps a four-level trail under a quarter second. */}
        <ol
          data-stagger="45"
          className="no-scrollbar flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-[13px]"
        >
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li
                key={`${item.label}-${i}`}
                className="reveal flex shrink-0 items-center gap-1.5"
              >
                {i > 0 && (
                  <svg
                    viewBox="0 0 20 20"
                    className="h-3.5 w-3.5 shrink-0 text-ink-300"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}

                {item.href && !last ? (
                  /* `min-h-11` keeps the crumb a 44px tap target on touch —
                     13px inline text is otherwise only ~20px tall. */
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-ink-500 transition-colors hover:text-brand-600"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-ink-800" aria-current={last ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
