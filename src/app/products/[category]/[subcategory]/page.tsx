import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { PageHero } from "@/components/PageHero";
import { ProductBrowser, type Facet } from "@/components/ProductBrowser";
import {
  getMainCategories,
  getCategory,
  getProductsInCategory,
  getCategoryTrail,
  collectStandards,
} from "@/lib/catalog";
import { site } from "@/lib/site";

type Params = { category: string; subcategory: string };

/**
 * Second-level pages are generated for every direct child of a main category.
 * Deeper taxonomy levels stay reachable as filter chips inside these pages
 * rather than as their own routes — the source site nests up to four levels,
 * which is unusable on a phone.
 */
export function generateStaticParams() {
  const params: Params[] = [];
  for (const cat of getMainCategories()) {
    for (const child of cat.children) {
      params.push({ category: cat.slug, subcategory: child.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: catSlug, subcategory: subSlug } = await params;
  const parent = getCategory(catSlug);
  const sub = getCategory(subSlug);
  if (!parent || !sub) return {};

  const description = `${sub.count} ${sub.name.toLowerCase()} products in ${parent.name} from ${site.name}. Certified industrial safety equipment with datasheets and standards.`;

  return {
    title: `${sub.name} — ${parent.name}`,
    description,
    alternates: { canonical: `/products/${parent.slug}/${sub.slug}` },
    openGraph: {
      title: `${sub.name} — ${parent.name} | ${site.name}`,
      description,
      url: `/products/${parent.slug}/${sub.slug}`,
    },
  };
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category: catSlug, subcategory: subSlug } = await params;
  const parent = getCategory(catSlug);
  const sub = getCategory(subSlug);

  if (!parent || !sub) notFound();
  // Guard against mismatched pairs (e.g. /products/helmet/gumboot).
  if (!parent.children.some((c) => c.slug === sub.slug)) notFound();

  const items = getProductsInCategory(sub);

  const subcategories: Facet[] = sub.children.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: c.count,
  }));

  const standards = collectStandards(items);
  const trail = getCategoryTrail(sub.slug);

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: parent.name, href: `/products/${parent.slug}` },
          { label: sub.name },
        ]}
        eyebrow={parent.name}
        title={sub.name}
        description={sub.blurb}
        meta={`${items.length} products`}
      />

      <div className="container-page py-6 lg:py-10">
        {/* Sibling navigation keeps lateral movement one tap away. */}
        {parent.children.length > 1 && (
          <nav aria-label={`Other ${parent.name} categories`} className="mb-6">
            <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              <li>
                <Link
                  href={`/products/${parent.slug}`}
                  className="inline-flex min-h-10 shrink-0 items-center rounded-lg border border-ink-200 bg-white px-3.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-300"
                >
                  All {parent.name}
                </Link>
              </li>

              {parent.children.map((child) => {
                const current = child.slug === sub.slug;
                return (
                  <li key={child.slug}>
                    <Link
                      href={`/products/${parent.slug}/${child.slug}`}
                      aria-current={current ? "page" : undefined}
                      className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3.5 text-sm font-medium transition-colors ${
                        current
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                      }`}
                    >
                      {child.name}
                      <span className={`text-xs ${current ? "text-brand-100" : "text-ink-400"}`}>
                        {child.count}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <ProductBrowser
          products={items}
          subcategories={subcategories}
          standards={standards}
          categorySlug={`${parent.slug}/${sub.slug}`}
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${sub.name} — ${parent.name}`,
            url: `${site.url}/products/${parent.slug}/${sub.slug}`,
            breadcrumb: trail.map((t) => t.name).join(" > "),
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: items.length,
              itemListElement: items.slice(0, 30).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: p.name,
                url: `${site.url}/product/${p.slug}`,
              })),
            },
          }),
        }}
      />
    </>
  );
}
