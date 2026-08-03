import { Link } from "@/components/Link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProductImage } from "@/components/ProductImage";
import { getMainCategories, getCategoryHeroImage, products } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Products",
  description: `Browse ${products.length} certified safety products across 14 categories — head, eye, hearing, respiratory, hand, body, foot and fall protection, plus workplace safety systems.`,
  alternates: { canonical: "/products" },
};

const categories = getMainCategories();

export default function ProductsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
        eyebrow="Full catalogue"
        title="Safety equipment, category by category"
        description={`${products.length} products across 14 categories. Every item lists the standards it is certified to, with datasheets where available.`}
        meta={`${products.length} products`}
      />

      <div className="container-page py-10 lg:py-14">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const img = getCategoryHeroImage(cat);

            return (
              <li key={cat.slug} className="reveal">
                <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink-200 bg-white transition-all duration-200 hover:border-brand-200 hover:shadow-lg">
                  <Link
                    href={`/products/${cat.slug}`}
                    className="flex items-center gap-4 p-4 pb-3"
                  >
                    <span className="w-20 shrink-0 rounded-lg bg-ink-50 p-2 transition-colors group-hover:bg-brand-50/70">
                      <ProductImage
                        image={img}
                        sizes="80px"
                        fallbackLabel={cat.name}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-bold leading-tight text-ink-900 transition-colors group-hover:text-brand-600">
                        {cat.name}
                      </span>
                      <span className="mt-0.5 block text-xs font-semibold text-ink-400">
                        {cat.count} products
                      </span>
                    </span>
                  </Link>

                  {cat.blurb && (
                    <p className="px-4 text-[13px] leading-relaxed text-ink-500">
                      {cat.blurb}
                    </p>
                  )}

                  {cat.children.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-1.5 border-t border-ink-100 p-4 pt-3">
                      {cat.children.slice(0, 4).map((child) => (
                        <li key={child.slug}>
                          <Link
                            href={`/products/${cat.slug}/${child.slug}`}
                            className="inline-flex min-h-9 items-center rounded-full border border-ink-200 px-3 text-xs font-medium text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}

                      {cat.children.length > 4 && (
                        <li>
                          <Link
                            href={`/products/${cat.slug}`}
                            className="inline-flex min-h-9 items-center px-2 text-xs font-semibold text-brand-600 hover:underline"
                          >
                            +{cat.children.length - 4} more
                          </Link>
                        </li>
                      )}
                    </ul>
                  ) : (
                    <div className="mt-auto p-4 pt-3">
                      <Link
                        href={`/products/${cat.slug}`}
                        className="text-xs font-semibold text-brand-600 hover:underline"
                      >
                        Browse category
                      </Link>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="reveal mt-10 rounded-2xl bg-ink-950 px-6 py-10 text-center sm:px-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Looking for something specific?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-400 sm:text-base">
            Search the full catalogue by product name, model or standard — or
            send us the specification and we&apos;ll source it.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary px-7">
              Send an enquiry
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="btn border border-ink-800 text-white hover:bg-ink-900"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
