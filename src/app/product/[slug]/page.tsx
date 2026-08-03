import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/Header";
import {
  products,
  getProduct,
  getProductTrail,
  getRelatedProducts,
} from "@/lib/catalog";
import {
  site,
  telHref,
  whatsappHref,
  productEnquiryMessage,
} from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const trail = getProductTrail(product);
  const categoryName = trail[trail.length - 1]?.name ?? "Safety Equipment";

  const description =
    product.summary ||
    `${product.name} — ${categoryName} from ${site.name}. ${
      product.standards.length ? `Certified to ${product.standards.join(", ")}.` : ""
    } Enquire for pricing and availability.`;

  const image = product.images[0]?.src.replace(/\.webp$/, "-900.webp");

  return {
    title: product.name,
    description: description.slice(0, 300),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${site.name}`,
      description: description.slice(0, 300),
      url: `/product/${product.slug}`,
      ...(image ? { images: [{ url: image, width: 900, height: 900, alt: product.name }] } : {}),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const trail = getProductTrail(product);
  const main = trail[0];
  const leaf = trail[trail.length - 1];
  const related = getRelatedProducts(product, 8);

  const enquiryMessage = productEnquiryMessage(product.name);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    ...(main ? [{ label: main.name, href: `/products/${main.slug}` }] : []),
    ...(leaf && main && leaf.slug !== main.slug && !leaf.synthetic
      ? [{ label: leaf.name, href: `/products/${main.slug}/${leaf.slug}` }]
      : []),
    { label: product.name },
  ];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary || product.name,
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.images.length
      ? { image: product.images.map((i) => `${site.url}${i.src.replace(/\.webp$/, "-900.webp")}`) }
      : {}),
    brand: { "@type": "Brand", name: site.name },
    category: leaf?.name,
    ...(product.standards.length
      ? {
          additionalProperty: product.standards.map((s) => ({
            "@type": "PropertyValue",
            name: "Standard",
            value: s,
          })),
        }
      : {}),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      // The business quotes per enquiry rather than listing prices.
      price: "0",
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      seller: { "@type": "Organization", name: site.legalName },
      url: `${site.url}/product/${product.slug}`,
    },
  };

  return (
    <>
      <div className="border-b border-ink-200 bg-ink-50">
        <div className="container-page py-4">
          <Breadcrumbs items={crumbs} />
        </div>
      </div>

      <article className="container-page py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* ---------------- Gallery ---------------- */}
          {/* min-w-0: grid children default to min-width:auto, which lets wide
              content (spec tables, long model names) push the track past the
              viewport instead of wrapping. */}
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* ---------------- Summary + actions ---------------- */}
          <div className="min-w-0">
            {leaf && main && (
              <Link
                href={
                  leaf.synthetic || leaf.slug === main.slug
                    ? `/products/${main.slug}`
                    : `/products/${main.slug}/${leaf.slug}`
                }
                className="eyebrow inline-flex min-h-11 items-center hover:underline"
              >
                {leaf.name}
              </Link>
            )}

            <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-ink-900 sm:text-4xl">
              {product.name}
            </h1>

            {product.sku && (
              <p className="mt-2 text-sm text-ink-500">
                Model / SKU: <span className="font-medium text-ink-700">{product.sku}</span>
              </p>
            )}

            {product.summary && (
              <p className="mt-4 text-base leading-relaxed text-ink-600">
                {product.summary}
              </p>
            )}

            {product.standards.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Certified to
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {product.standards.map((s) => (
                    <li
                      key={s}
                      className="rounded-md border border-ink-200 bg-ink-50 px-2.5 py-1 text-xs font-semibold text-ink-700"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Enquiry actions — this business quotes, it does not sell online. */}
            <div className="mt-7 rounded-2xl border border-ink-200 bg-ink-50 p-4 sm:p-5">
              <p className="font-display text-lg font-bold text-ink-900">
                Price on enquiry
              </p>
              <p className="mt-1 text-sm text-ink-600">
                Send us quantity and site details for a quotation — usually same day.
              </p>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <a
                  href={whatsappHref(enquiryMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full"
                >
                  <WhatsAppIcon />
                  Enquire on WhatsApp
                </a>

                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="btn-primary w-full"
                >
                  Send an enquiry
                </Link>

                <a href={telHref} className="btn-secondary w-full">
                  Call {site.phoneDisplay}
                </a>

                {product.datasheet && (
                  <a
                    href={product.datasheet}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a.75.75 0 01.75.75v8.19l2.72-2.72a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 111.06-1.06l2.72 2.72V2.75A.75.75 0 0110 2zM3.5 14.75a.75.75 0 01.75.75v.75c0 .414.336.75.75.75h10a.75.75 0 00.75-.75v-.75a.75.75 0 011.5 0v.75A2.25 2.25 0 0115 18.5H5a2.25 2.25 0 01-2.25-2.25v-.75a.75.75 0 01.75-.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Datasheet (PDF)
                  </a>
                )}
              </div>
            </div>

            {product.attributes.length > 0 && (
              <dl className="mt-6 space-y-3">
                {product.attributes.map((attr) => (
                  <div key={attr.name} className="flex flex-wrap gap-x-3 gap-y-1.5">
                    <dt className="w-24 shrink-0 text-sm font-semibold text-ink-700">
                      {attr.name}
                    </dt>
                    <dd className="flex flex-1 flex-wrap gap-1.5">
                      {attr.values.map((v) => (
                        <span
                          key={v}
                          className="rounded-md bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-700"
                        >
                          {v}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        {/* ---------------- Details ---------------- */}
        {(product.specs.length > 0 ||
          product.paragraphs.length > 0 ||
          product.bullets.length > 0) && (
          <div className="mt-12 grid gap-8 border-t border-ink-200 pt-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-7">
              {product.paragraphs.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
                    Description
                  </h2>
                  <div className="mt-4 space-y-3">
                    {product.paragraphs.map((para, i) => (
                      <p key={i} className="text-[15px] leading-relaxed text-ink-600">
                        {para}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {product.bullets.length > 0 && (
                <section className={product.paragraphs.length ? "mt-8" : ""}>
                  <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
                    Features &amp; benefits
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {product.bullets.map((b, i) => (
                      <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink-600">
                        <svg
                          viewBox="0 0 20 20"
                          className="mt-1 h-4 w-4 shrink-0 text-brand-600"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {b}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {product.specs.length > 0 && (
              <section className="min-w-0 lg:col-span-5">
                <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
                  Specifications
                </h2>

                {/* Long spec values scroll inside this box rather than
                    widening the page. */}
                <div className="mt-4 overflow-x-auto rounded-xl border border-ink-200">
                  <table className="w-full min-w-[19rem] text-sm">
                    <caption className="sr-only">
                      Technical specifications for {product.name}
                    </caption>
                    <tbody>
                      {product.specs.map((spec, i) => (
                        <tr
                          key={`${spec.label}-${i}`}
                          className="border-b border-ink-100 last:border-0 odd:bg-ink-50/60"
                        >
                          <th
                            scope="row"
                            className="w-2/5 px-3.5 py-2.5 text-left align-top font-semibold text-ink-700"
                          >
                            {spec.label}
                          </th>
                          <td className="px-3.5 py-2.5 align-top text-ink-600">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ---------------- Related ---------------- */}
        {related.length > 0 && (
          <section className="mt-14 border-t border-ink-200 pt-10 lg:mt-20">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                Related products
              </h2>

              {main && (
                <Link
                  href={`/products/${main.slug}`}
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-600 hover:underline"
                >
                  All {main.name}
                </Link>
              )}
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {related.map((r) => (
                <li key={r.id}>
                  <ProductCard
                    product={r}
                    sizes="(min-width: 1280px) 280px, (min-width: 768px) 30vw, 45vw"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}
