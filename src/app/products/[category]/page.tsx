import { notFound } from "next/navigation";
import { jsonLd } from "@/lib/jsonLd";
import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { PageHero } from "@/components/PageHero";
import { ProductBrowser, type Facet } from "@/components/ProductBrowser";
import {
  getMainCategories,
  getCategory,
  getProductsInCategory,
  collectStandards,
} from "@/lib/catalog";
import { site } from "@/lib/site";

type Params = { category: string };

export function generateStaticParams() {
  return getMainCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  const description =
    category.blurb ??
    `Browse ${category.count} ${category.name.toLowerCase()} products from ${site.name}.`;

  return {
    title: category.name,
    description,
    alternates: { canonical: `/products/${category.slug}` },
    openGraph: {
      title: `${category.name} — ${site.name}`,
      description,
      url: `/products/${category.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category: slug } = await params;
  const category = getCategory(slug);

  if (!category || category.depth !== 0) notFound();

  const items = getProductsInCategory(category);

  const subcategories: Facet[] = category.children.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: c.count,
  }));

  const standards = collectStandards(items);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.blurb ?? undefined,
    url: `${site.url}/products/${category.slug}`,
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
  };

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: category.name },
        ]}
        eyebrow="Category"
        title={category.name}
        description={category.blurb}
        meta={`${items.length} products`}
      />

      <div className="container-page py-6 lg:py-10">
        {/* Subcategory links — crawlable, independent of the JS filter. */}
        {category.children.length > 0 && (
          <nav aria-label={`${category.name} subcategories`} className="mb-6">
            <ul className="flex flex-wrap gap-2">
              {category.children.map((child) => (
                <li key={child.slug}>
                  <Link
                    href={`/products/${category.slug}/${child.slug}`}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3.5 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {child.name}
                    <span className="text-xs text-ink-400">{child.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <ProductBrowser
          products={items}
          subcategories={subcategories}
          standards={standards}
          categorySlug={category.slug}
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(collectionSchema) }}
      />
    </>
  );
}
