import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppIcon } from "@/components/Header";
import { posts, postsByDate } from "@/data/posts";
import {
  site,
  telHref,
  whatsappHref,
  articleEnquiryMessage,
} from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt.slice(0, 300),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt.slice(0, 300),
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  // Prev / next follow reading order (newest first), so "next" is older.
  const index = postsByDate.findIndex((p) => p.slug === post.slug);
  const newer = index > 0 ? postsByDate[index - 1] : null;
  const older =
    index < postsByDate.length - 1 ? postsByDate[index + 1] : null;

  const enquiry = articleEnquiryMessage(post.title);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: site.legalName, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      url: site.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/blog/${post.slug}`,
    },
    articleSection: post.topic,
    inLanguage: "en-IN",
  };

  return (
    <>
      <div className="border-b border-ink-200 bg-ink-50">
        <div className="container-page py-4">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Safety Notes", href: "/blog" },
              { label: post.title },
            ]}
          />
        </div>
      </div>

      <div className="container-page py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ---------------- Article ---------------- */}
          <article className="min-w-0 lg:col-span-8">
            <p className="eyebrow">{post.topic}</p>

            <h1 className="mt-2 max-w-[22ch] text-3xl font-bold leading-[1.12] tracking-tight text-ink-900 sm:text-4xl lg:text-[2.75rem]">
              {post.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-500">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true" className="text-ink-300">
                ·
              </span>
              <span>{post.readingTime} min read</span>
            </div>

            <p className="mt-6 max-w-[65ch] border-l-2 border-brand-500 pl-5 text-lg leading-relaxed text-ink-700">
              {post.excerpt}
            </p>

            <div className="mt-10 max-w-[65ch] space-y-10">
              {post.body.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-xl font-bold text-ink-900 sm:text-2xl">
                    {section.heading}
                  </h2>

                  <div className="mt-3 space-y-4">
                    {section.paragraphs.map((paragraph, i) => (
                      <p
                        key={i}
                        className="text-[16px] leading-[1.75] text-ink-600"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {section.list && (
                    <ul className="mt-4 space-y-2.5">
                      {section.list.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-[15px] leading-relaxed text-ink-600"
                        >
                          <span
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* ---------------- Prev / next ---------------- */}
            {(newer || older) && (
              <nav
                className="mt-14 grid gap-3 border-t border-ink-200 pt-8 sm:grid-cols-2"
                aria-label="More articles"
              >
                {newer ? (
                  <Link
                    href={`/blog/${newer.slug}`}
                    className="group rounded-xl border border-ink-200 bg-white p-4 transition-colors hover:border-brand-200 hover:bg-ink-50"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                      ← Newer
                    </span>
                    <span className="mt-1 block font-display text-base font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-600">
                      {newer.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}

                {older && (
                  <Link
                    href={`/blog/${older.slug}`}
                    className="group rounded-xl border border-ink-200 bg-white p-4 text-right transition-colors hover:border-brand-200 hover:bg-ink-50 sm:col-start-2"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                      Older →
                    </span>
                    <span className="mt-1 block font-display text-base font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-600">
                      {older.title}
                    </span>
                  </Link>
                )}
              </nav>
            )}
          </article>

          {/* ---------------- Aside ---------------- */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-ink-200 bg-ink-50 p-6">
                <h2 className="font-display text-lg font-bold text-ink-900">
                  Specifying this for your site?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Send the hazard and the headcount. We&apos;ll come back with
                  options that carry the right certification — and say so when
                  the cheaper one is enough.
                </p>

                <div className="mt-5 space-y-2">
                  <a
                    href={whatsappHref(enquiry)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full"
                  >
                    <WhatsAppIcon />
                    Enquire on WhatsApp
                  </a>
                  <a href={telHref} className="btn-secondary w-full">
                    {site.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-ink-200 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Related
                </p>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link
                      href="/solutions"
                      className="flex min-h-10 items-center text-sm font-medium text-ink-700 transition-colors hover:text-brand-600"
                    >
                      Solutions by hazard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/standards"
                      className="flex min-h-10 items-center text-sm font-medium text-ink-700 transition-colors hover:text-brand-600"
                    >
                      Standards &amp; compliance
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="flex min-h-10 items-center text-sm font-medium text-ink-700 transition-colors hover:text-brand-600"
                    >
                      Browse all products
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}
