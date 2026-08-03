import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Section, SectionHeader } from "@/components/Section";
import { WhatsAppIcon } from "@/components/Header";
import { postsByDate } from "@/data/posts";
import { site, whatsappHref, GENERAL_ENQUIRY_MESSAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Safety Notes",
  description:
    "Practical guidance on specifying industrial safety equipment — helmet standards, glove markings, fall protection systems and fire extinguisher selection, written for the people who buy and use them.",
  alternates: { canonical: "/blog" },
};

/** Long month name, no leading zero — reads better than a numeric date. */
const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export default function BlogPage() {
  const [lead, ...rest] = postsByDate;

  return (
    <>
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden bg-ink-950">
        <div
          data-parallax="0.06"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 85% 75% at 50% 30%, black 25%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 75% at 50% 30%, black 25%, transparent 78%)",
          }}
          aria-hidden="true"
        />

        <div className="container-page relative py-14 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Safety Notes" }]} />

          <h1 className="text-mega mt-6 max-w-5xl font-bold text-white">
            <span className="hero-line">
              <span style={{ "--hd": "60ms" } as React.CSSProperties}>
                Safety notes
              </span>
            </span>
          </h1>

          <p
            className="hero-fade mt-6 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg"
            style={{ "--hd": "200ms" } as React.CSSProperties}
          >
            What the markings mean, which standard applies, and where
            specifications commonly go wrong. Written for the people who sign
            the requisition and the people who wear the result.
          </p>
        </div>

        <div className="hazard-rule hazard-rule-move h-1.5" aria-hidden="true" />
      </section>

      {/* ================= Lead article ================= */}
      {lead && (
        <Section>
          <Link
            href={`/blog/${lead.slug}`}
            className="spot reveal group block rounded-2xl border border-ink-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/5 sm:p-9"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">
                Latest
              </span>
              <span className="text-ink-400">{lead.topic}</span>
              <span className="text-ink-300" aria-hidden="true">
                ·
              </span>
              <time dateTime={lead.date} className="text-ink-400">
                {formatDate(lead.date)}
              </time>
              <span className="text-ink-300" aria-hidden="true">
                ·
              </span>
              <span className="text-ink-400">{lead.readingTime} min read</span>
            </div>

            <h2 className="mt-4 max-w-3xl font-display text-2xl font-bold leading-tight text-ink-900 transition-colors group-hover:text-brand-600 sm:text-3xl lg:text-4xl">
              {lead.title}
            </h2>

            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-600 sm:text-base">
              {lead.excerpt}
            </p>

            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
              Read the article
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Link>
        </Section>
      )}

      {/* ================= Rest ================= */}
      {rest.length > 0 && (
        <Section tone="muted">
          <SectionHeader eyebrow="More reading" title="Everything else" />

          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-stagger="80">
            {rest.map((post) => (
              <li key={post.slug} className="reveal">
                <Link
                  href={`/blog/${post.slug}`}
                  className="spot group flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/5"
                >
                  <p className="eyebrow">{post.topic}</p>

                  <h3 className="mt-2 font-display text-lg font-bold leading-tight text-ink-900 transition-colors group-hover:text-brand-600 sm:text-xl">
                    {post.title}
                  </h3>

                  <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-ink-500">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center gap-2 pt-5 text-xs font-medium text-ink-400">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ================= CTA ================= */}
      <Section tone="dark">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="Still deciding?"
              title="A five-minute call beats an hour of standards."
              description="If you are weighing two specifications against each other, send them over. We will tell you which one covers your hazard — including when the cheaper one does."
              tone="dark"
            />
          </div>

          <div className="reveal flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <a
              href={whatsappHref(GENERAL_ENQUIRY_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp px-6"
            >
              <WhatsAppIcon />
              WhatsApp {site.phoneDisplay}
            </a>
            <Link href="/solutions" className="btn border border-ink-800 px-6 text-white hover:bg-ink-900">
              Browse solutions
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
