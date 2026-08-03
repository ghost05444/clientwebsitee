import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Section, SectionHeader } from "@/components/Section";
import { HorizontalShowcase } from "@/components/HorizontalShowcase";
import { WhatsAppIcon } from "@/components/Header";
import { solutions, getSolutionImage, countSolutionProducts } from "@/lib/solutions";
import { site, whatsappHref, GENERAL_ENQUIRY_MESSAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Safety Solutions by Hazard",
  description:
    "Confined space entry, rescue from height, arc flash, height access, cryogenic, heat and flame-retardant protection — equipment specified around the hazard on your site, not a catalogue page.",
  alternates: { canonical: "/solutions" },
};

/** Panels carry their imagery and depth from the live catalogue. */
const panels = solutions.map((solution) => {
  const image = getSolutionImage(solution);
  return {
    slug: solution.slug,
    name: solution.name,
    tagline: solution.heroTagline,
    href: `/solutions/${solution.slug}`,
    image: image ? image.src.replace(/\.webp$/, "-400.webp") : null,
    count: countSolutionProducts(solution),
  };
});

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
          className="orb pointer-events-none absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full glow" style={{ "--glow-color": "rgb(220 31 31 / 0.20)" } as React.CSSProperties}
          aria-hidden="true"
        />

        <div className="container-page relative py-14 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Solutions" }]} />

          <h1 className="text-mega mt-6 max-w-5xl font-bold text-white">
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

      {/* ================= Showcase ================= */}
      <section className="bg-white py-14 sm:py-16 lg:pt-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Where we go deep"
            title="Seven hazards, specified properly"
            description="Every one of these draws on the same catalogue — the difference is that the equipment has been matched to an exposure rather than picked from a list."
          />
        </div>

        {/* Full-bleed: the horizontal track needs the whole viewport width,
            and pads itself back to the page gutter internally. */}
        <HorizontalShowcase panels={panels} />
      </section>

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
