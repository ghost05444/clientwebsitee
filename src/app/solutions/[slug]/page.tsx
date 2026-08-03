import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { Section, SectionHeader } from "@/components/Section";
import { WhatsAppIcon } from "@/components/Header";
import {
  solutions,
  getSolution,
  getSolutionProducts,
  getSolutionCategoryHref,
  getSolutionImage,
  countSolutionProducts,
} from "@/lib/solutions";
import {
  site,
  telHref,
  whatsappHref,
  solutionEnquiryMessage,
} from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return {};

  const description = `${solution.heroTagline} ${solution.intro[0].slice(0, 150)}`;

  return {
    title: solution.name,
    description: description.slice(0, 300),
    alternates: { canonical: `/solutions/${solution.slug}` },
    openGraph: {
      type: "website",
      title: `${solution.name} | ${site.name}`,
      description: description.slice(0, 300),
      url: `/solutions/${solution.slug}`,
    },
  };
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const related = getSolutionProducts(solution, 8);
  const total = countSolutionProducts(solution);
  const categoryHref = getSolutionCategoryHref(solution);
  const heroImage = getSolutionImage(solution);
  const enquiry = solutionEnquiryMessage(solution.name);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Solutions", href: "/solutions" },
    { label: solution.name },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: solution.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      {/* ================= Parallax hero ================= */}
      <section className="relative isolate overflow-hidden bg-ink-950">
        {heroImage && (
          <div
            data-parallax="-0.15"
            data-parallax-clamp="90"
            className="pointer-events-none absolute inset-0 -z-10 scale-110"
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage.src.replace(/\.webp$/, "-900.webp")}
              alt=""
              width={900}
              height={900}
              className="h-full w-full object-cover opacity-[0.13] blur-[2px]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-950/85 to-ink-950" />
          </div>
        )}

        <div
          className="orb pointer-events-none absolute -right-40 -top-48 -z-10 h-[34rem] w-[34rem] rounded-full bg-brand-600/20 blur-[130px]"
          data-parallax="-0.1"
          aria-hidden="true"
        />

        <div className="container-page relative py-14 sm:py-20 lg:py-24">
          <Breadcrumbs items={crumbs} />

          <p className="hero-fade eyebrow mt-6 text-brand-400">Solution</p>

          <h1 className="text-mega mt-3 max-w-5xl font-bold text-white">
            <span className="hero-line">
              <span style={{ "--hd": "80ms" } as React.CSSProperties}>
                {solution.name}
              </span>
            </span>
          </h1>

          <p
            className="hero-fade mt-5 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg"
            style={{ "--hd": "220ms" } as React.CSSProperties}
          >
            {solution.heroTagline}
          </p>

          {/* Counter-parallax: chips drift the opposite way to the backdrop. */}
          <ul
            data-parallax="0.06"
            className="hero-fade mt-8 flex flex-wrap gap-2"
            style={{ "--hd": "320ms" } as React.CSSProperties}
          >
            {solution.standards.slice(0, 5).map((s) => (
              <li
                key={s.code}
                className="rounded-full border border-ink-700 bg-ink-900/70 px-3.5 py-1.5 text-xs font-semibold text-ink-200"
              >
                {s.code}
              </li>
            ))}
          </ul>

          <div
            className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ "--hd": "420ms" } as React.CSSProperties}
          >
            <a
              href={whatsappHref(enquiry)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp px-7 text-base"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Discuss this on WhatsApp
            </a>

            {categoryHref && (
              <Link
                href={categoryHref}
                className="btn border border-ink-700 px-7 text-base text-white hover:bg-ink-900"
              >
                Browse the equipment
              </Link>
            )}
          </div>
        </div>

        <div className="hazard-rule hazard-rule-move h-1.5" aria-hidden="true" />
      </section>

      {/* ================= Intro + hazards ================= */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="space-y-5 text-[15px] leading-relaxed text-ink-600 sm:text-base">
              <p
                data-words
                className="text-lg font-medium text-ink-800 sm:text-xl"
              >
                {solution.intro[0]}
              </p>
              <p>{solution.intro[1]}</p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-ink-200 bg-ink-50 p-6">
              <h2 className="font-display text-lg font-bold text-ink-900">
                What goes wrong on site
              </h2>

              <ul className="mt-4 space-y-3.5" data-stagger="80">
                {solution.hazards.map((hazard) => (
                  <li
                    key={hazard}
                    className="reveal from-right flex gap-3 text-sm leading-relaxed text-ink-600"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {hazard}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ================= Approach ================= */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="How we approach it"
          title="Assess, specify, supply"
          description="The same three steps every time — the detail changes with the hazard, the order does not."
        />

        <ol className="grid gap-5 lg:grid-cols-3" data-stagger="110">
          {solution.approach.map((step, i) => (
            <li
              key={step.title}
              className="spot reveal rounded-2xl border border-ink-200 bg-white p-6"
            >
              <span className="font-display text-3xl font-bold text-brand-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-ink-900">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ================= Standards strip ================= */}
      <Section tone="dark">
        <SectionHeader
          eyebrow="What the marks mean"
          title="Standards that apply here"
          description="The codes you will see on a datasheet for this hazard, and what each one actually certifies."
          tone="dark"
          link={{ href: "/standards", label: "All standards explained" }}
        />

        <ul className="grid gap-px overflow-hidden rounded-2xl bg-ink-800 sm:grid-cols-2" data-stagger="70">
          {solution.standards.map((s) => (
            <li key={s.code} className="reveal bg-ink-950 p-5">
              <p className="font-display text-base font-bold text-hivis-400">
                {s.code}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
                {s.meaning}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ================= Related products ================= */}
      {related.length > 0 && (
        <Section>
          <SectionHeader
            eyebrow="Equipment"
            title="Products for this hazard"
            description={`Pulled live from the catalogue — ${total} product${total === 1 ? "" : "s"} sit behind this solution.`}
            {...(categoryHref
              ? { link: { href: categoryHref, label: "View all" } }
              : {})}
          />

          <ul
            className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
            data-stagger="60"
          >
            {related.map((product) => (
              <li key={product.id} className="reveal zoom">
                <ProductCard
                  product={product}
                  sizes="(min-width: 1024px) 300px, 45vw"
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ================= FAQ ================= */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="Common questions"
          title="Questions we get asked"
        />

        <div className="mx-auto max-w-3xl" data-stagger="90">
          {solution.faq.map((item) => (
            <details
              key={item.q}
              className="reveal group border-b border-ink-200 last:border-0"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-left font-display text-lg font-bold text-ink-900 transition-colors hover:text-brand-600 [&::-webkit-details-marker]:hidden">
                {item.q}
                <svg
                  viewBox="0 0 20 20"
                  className="mt-1 h-5 w-5 shrink-0 text-ink-400 transition-transform duration-200 group-open:rotate-45"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10 4.25a.75.75 0 01.75.75v4.25H15a.75.75 0 010 1.5h-4.25V15a.75.75 0 01-1.5 0v-4.25H5a.75.75 0 010-1.5h4.25V5a.75.75 0 01.75-.75z" />
                </svg>
              </summary>

              <p className="pb-5 pr-9 text-[15px] leading-relaxed text-ink-600">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Section>

      {/* ================= CTA ================= */}
      <section className="relative overflow-hidden bg-brand-700">
        <div
          data-parallax="0.08"
          className="stripes-move pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #fff 0 2px, transparent 2px 14px)",
          }}
          aria-hidden="true"
        />

        <div className="container-page relative py-14 lg:py-20">
          <div className="reveal zoom mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Tell us about the job.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-100 sm:text-lg">
              Describe the site and the exposure — we&apos;ll come back with a
              specification, the standards it meets and a price.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={whatsappHref(enquiry)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white px-7 text-base text-brand-700 shadow-sm hover:bg-brand-50"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp {site.phoneDisplay}
              </a>

              <a
                href={telHref}
                className="btn border border-white/40 px-7 text-base text-white hover:bg-white/10"
              >
                Call {site.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
