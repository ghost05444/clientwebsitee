import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Section, SectionHeader } from "@/components/Section";
import { WhatsAppIcon } from "@/components/Header";
import { solutions, getSolutionImage, countSolutionProducts } from "@/lib/solutions";
import { site, whatsappHref, GENERAL_ENQUIRY_MESSAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Safety Solutions by Hazard",
  description:
    "Confined space entry, rescue from height, arc flash, height access, cryogenic, heat and flame-retardant protection — equipment specified around the hazard on your site, not a catalogue page.",
  alternates: { canonical: "/solutions" },
};

/** Cards carry their imagery and depth from the live catalogue. */
const cards = solutions.map((solution) => ({
  solution,
  image: getSolutionImage(solution),
  count: countSolutionProducts(solution),
}));

export default function SolutionsPage() {
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
        <div
          data-parallax="-0.1"
          className="orb pointer-events-none absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-brand-600/20 blur-[120px]"
          aria-hidden="true"
        />

        <div className="container-page relative py-14 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Solutions" }]} />

          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="hero-line">
              <span style={{ "--hd": "60ms" } as React.CSSProperties}>
                Start from the hazard,
              </span>
            </span>
            <span className="hero-line">
              <span style={{ "--hd": "180ms" } as React.CSSProperties}>
                <span className="text-brand-500">not the catalogue.</span>
              </span>
            </span>
          </h1>

          <p
            className="hero-fade mt-6 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg"
            style={{ "--hd": "300ms" } as React.CSSProperties}
          >
            Seven areas where getting the specification wrong has consequences
            worth more than the equipment. Each one starts with what actually
            goes wrong on site, and ends with kit that carries the right
            certification for it.
          </p>
        </div>

        <div className="hazard-rule hazard-rule-move h-1.5" aria-hidden="true" />
      </section>

      {/* ================= Grid ================= */}
      <Section>
        <SectionHeader
          eyebrow="Where we go deep"
          title="Seven hazards, specified properly"
          description="Every one of these draws on the same catalogue — the difference is that the equipment has been matched to an exposure rather than picked from a list."
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-stagger="80">
          {cards.map(({ solution, image, count }, i) => (
            <li key={solution.slug} className="reveal">
              <Link
                href={`/solutions/${solution.slug}`}
                className="spot group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/5"
              >
                <div className="relative overflow-hidden bg-ink-50 p-6">
                  <span
                    className="absolute right-4 top-3 font-display text-5xl font-bold text-ink-200/80"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={image.src.replace(/\.webp$/, "-400.webp")}
                      alt=""
                      width={400}
                      height={400}
                      loading="lazy"
                      decoding="async"
                      className="relative mx-auto h-28 w-28 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-28" aria-hidden="true" />
                  )}
                </div>

                <div className="flex flex-1 flex-col border-t border-ink-100 p-5">
                  <h3 className="font-display text-lg font-bold leading-tight text-ink-900 transition-colors group-hover:text-brand-600">
                    {solution.name}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-500">
                    {solution.heroTagline}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="text-xs font-semibold text-ink-400">
                      {count} products
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-brand-600">
                      Explore
                      <svg
                        viewBox="0 0 20 20"
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
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
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ================= CTA ================= */}
      <Section tone="dark">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="Not sure which applies?"
              title="Describe the site. We'll tell you what it needs."
              description="Most enquiries cover more than one of these — a shutdown crew entering a vessel is also working at height. Send the job and we'll work through it with you."
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
            <Link href="/contact" className="btn-primary px-6">
              Send an enquiry
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
