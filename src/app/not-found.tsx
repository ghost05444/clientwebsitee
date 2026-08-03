import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { getMainCategories } from "@/lib/catalog";

/** Without this the 404 inherits the root layout's title — the same one the
    homepage uses — so both pages present identically in a tab or a crawl. */
export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page could not be found. Browse our safety equipment categories or get in touch and we'll point you to the right product.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const categories = getMainCategories().slice(0, 8);

  return (
    <div className="container-page flex flex-col items-center py-20 text-center lg:py-28">
      <p className="font-display text-6xl font-bold text-brand-600 sm:text-7xl">404</p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
        We couldn&apos;t find that page.
      </h1>

      <p className="mt-3 max-w-md text-base leading-relaxed text-ink-600">
        The link may be out of date, or the product may have moved. Try browsing
        by category, or ask us directly.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/products" className="btn-primary px-7">
          Browse products
        </Link>
        <Link href="/contact" className="btn-secondary px-7">
          Contact us
        </Link>
      </div>

      <div className="mt-12 w-full max-w-3xl border-t border-ink-200 pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-400">
          Popular categories
        </h2>

        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/products/${cat.slug}`}
                className="inline-flex min-h-10 items-center rounded-lg border border-ink-200 bg-white px-3.5 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
