import { Link } from "@/components/Link";
import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/Section";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { CountUp } from "@/components/CountUp";
import { WhatsAppIcon } from "@/components/Header";
import {
  getMainCategories,
  getFeaturedProducts,
  getCategoryHeroImage,
  products,
} from "@/lib/catalog";
import {
  site,
  telHref,
  whatsappHref,
  GENERAL_ENQUIRY_MESSAGE,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

const categories = getMainCategories();
const featured = getFeaturedProducts(8);
const totalProducts = products.length;

/** Entrance delay for the hero's load-time choreography. */
const hd = (ms: number) => ({ "--hd": `${ms}ms` }) as React.CSSProperties;

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Categories />
      <WhyUs />
      <Featured />
      <Industries />
      <CtaBanner />
    </>
  );
}

/* ================================================================== *
 * Hero
 * ================================================================== */

function Hero() {
  const heroCats = categories.slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-ink-950">
      {/* Depth: fine grid faded at the edges + two slowly drifting glows. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 55% 30%, black 25%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 55% 30%, black 25%, transparent 78%)",
        }}
        aria-hidden="true"
      />
      <div
        className="orb pointer-events-none absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-brand-600/25 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="orb orb-slow pointer-events-none absolute -bottom-44 -left-36 h-[28rem] w-[28rem] rounded-full bg-hivis-500/10 blur-[110px]"
        aria-hidden="true"
      />

      <div className="container-page relative py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p
              className="hero-fade inline-flex items-center gap-2 rounded-full border border-ink-800 bg-ink-900/60 px-3 py-1.5 text-xs font-medium text-ink-300"
              style={hd(0)}
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-hivis-400"
                aria-hidden="true"
              />
              Serving Anjar, Kachchh &amp; all of Gujarat
            </p>

            {/* Each line rises out of its own overflow mask, one beat apart. */}
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
              <span className="hero-line">
                <span style={hd(120)}>Safety equipment</span>
              </span>
              <span className="hero-line">
                <span style={hd(230)}>
                  <span className="text-brand-500">that comes home</span>
                </span>
              </span>
              <span className="hero-line">
                <span style={hd(340)}>with your team.</span>
              </span>
            </h1>

            <p
              className="hero-fade mt-6 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg"
              style={hd(430)}
            >
              Certified head-to-toe PPE, fall protection and fire safety systems
              from {totalProducts}+ products — backed by on-site assessment and
              fast supply across India.
            </p>

            <div className="hero-fade mt-8 flex flex-col gap-3 sm:flex-row" style={hd(520)}>
              <Link href="/products" className="btn-primary px-7 text-base">
                Browse products
              </Link>

              <a
                href={whatsappHref(GENERAL_ENQUIRY_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp px-7 text-base"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Get a quote on WhatsApp
              </a>
            </div>

            <dl
              className="hero-fade mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-ink-800 pt-7"
              style={hd(620)}
            >
              {[
                {
                  label: "Products stocked",
                  render: (
                    <CountUp
                      value={totalProducts}
                      suffix="+"
                      className="block font-display text-2xl font-bold text-white sm:text-3xl"
                    />
                  ),
                },
                {
                  label: "Safety categories",
                  render: (
                    <CountUp
                      value={categories.length}
                      duration={1100}
                      className="block font-display text-2xl font-bold text-white sm:text-3xl"
                    />
                  ),
                },
                {
                  label: "Certified range",
                  render: (
                    <span className="block font-display text-2xl font-bold text-white sm:text-3xl">
                      EN / IS
                    </span>
                  ),
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    {stat.render}
                    <span className="mt-0.5 block text-xs text-ink-400 sm:text-sm">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Category preview tiles — real product imagery, cursor tilt + glow. */}
          <div className="hero-fade lg:col-span-5" style={hd(300)}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {heroCats.map((cat, i) => {
                const img = getCategoryHeroImage(cat);
                return (
                  <Link
                    key={cat.slug}
                    href={`/products/${cat.slug}`}
                    className="tilt spot spot-dark group relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 p-4 transition-colors hover:border-ink-600"
                  >
                    <div className="rounded-xl bg-white/95 p-2">
                      <ProductImage
                        image={img}
                        priority={i < 2}
                        sizes="(min-width: 1024px) 200px, 40vw"
                        fallbackLabel={cat.name}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <p className="mt-3 font-display text-sm font-semibold leading-tight text-white">
                      {cat.name}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-400">
                      {cat.count} products
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="hazard-rule hazard-rule-move h-1.5" aria-hidden="true" />
    </section>
  );
}

/* ================================================================== *
 * Trust strip
 * ================================================================== */

function TrustStrip() {
  const items = [
    {
      title: "Certified to EN & IS",
      body: "Every product carries the standards it is tested against.",
      path: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
    },
    {
      title: "Same-day response",
      body: "Send a requirement on WhatsApp and get a quote back fast.",
      path: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Bulk & site supply",
      body: "Volume pricing for plants, contractors and government tenders.",
      path: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
    },
    {
      title: "Technical guidance",
      body: "We help match the right PPE to the actual hazard on site.",
      path: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z",
    },
  ];

  return (
    <div className="border-b border-ink-200 bg-white">
      <div
        className="container-page grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:py-12"
        data-stagger="90"
      >
        {items.map((item) => (
          <div key={item.title} className="reveal flex gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={item.path} />
              </svg>
            </span>

            <div>
              <h3 className="text-sm font-semibold text-ink-900">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-500">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== *
 * Categories
 * ================================================================== */

function Categories() {
  return (
    <Section tone="muted">
      <SectionHeader
        eyebrow="What we supply"
        title="Protection for every hazard on site"
        description="Fourteen categories covering head-to-toe personal protective equipment, working at height, and workplace safety systems."
        link={{ href: "/products", label: "View all products" }}
      />

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" data-stagger="60">
        {categories.map((cat) => {
          const img = getCategoryHeroImage(cat);
          return (
            <li key={cat.slug} className="reveal">
              <Link
                href={`/products/${cat.slug}`}
                className="spot group flex h-full flex-col overflow-hidden rounded-xl border border-ink-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/5"
              >
                <div className="bg-ink-50 p-4 transition-colors group-hover:bg-brand-50/60">
                  <ProductImage
                    image={img}
                    sizes="(min-width: 1024px) 300px, 45vw"
                    fallbackLabel={cat.name}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                  <h3 className="font-display text-base font-bold leading-tight text-ink-900 transition-colors group-hover:text-brand-600 sm:text-lg">
                    {cat.name}
                  </h3>

                  {cat.blurb && (
                    <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-ink-500 sm:text-[13px]">
                      {cat.blurb}
                    </p>
                  )}

                  <p className="mt-auto pt-3 text-xs font-semibold text-ink-400">
                    {cat.count} products
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/* ================================================================== *
 * Why us
 * ================================================================== */

function WhyUs() {
  const pillars = [
    {
      n: "01",
      title: "Hazard-first advice",
      body: "We start from the risk on your floor — cut, arc flash, heat, fall, chemical — and match equipment to the actual exposure, not a catalogue page.",
    },
    {
      n: "02",
      title: "Certified, traceable stock",
      body: "Products carry their EN and IS test standards, with datasheets available for audit, tender and safety-committee sign-off.",
    },
    {
      n: "03",
      title: "Supply that keeps up",
      body: "From a single replacement harness to a full plant rollout, with volume pricing and repeat-order schedules for maintenance shutdowns.",
    },
  ];

  return (
    <Section tone="dark">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeader
            eyebrow="Why Krushnam Fire"
            title="Compliance is the floor. Going home safe is the point."
            description="Buying PPE is easy. Buying the right PPE, that workers will actually wear for a full shift, is the part we help with."
            tone="dark"
          />

          <div className="reveal flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link href="/contact" className="btn-primary px-6">
              Request a site assessment
            </Link>
            <a href={telHref} className="btn border border-ink-800 text-white hover:bg-ink-900">
              {site.phoneDisplay}
            </a>
          </div>
        </div>

        <ul className="lg:col-span-7 lg:pt-4" data-stagger="110">
          {pillars.map((p) => (
            <li
              key={p.n}
              className="reveal from-right flex gap-5 border-t border-ink-800 py-6 first:border-t-0 first:pt-0 sm:gap-7"
            >
              <span className="font-display text-2xl font-bold text-brand-500 sm:text-3xl">
                {p.n}
              </span>

              <div>
                <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400 sm:text-base">
                  {p.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ================================================================== *
 * Featured
 * ================================================================== */

function Featured() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Featured equipment"
        title="A cross-section of the range"
        description="One well-specified product from each of our largest categories."
        link={{ href: "/products", label: "See all products" }}
      />

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" data-stagger="60">
        {featured.map((product) => (
          <li key={product.id} className="reveal zoom">
            <ProductCard product={product} sizes="(min-width: 1024px) 300px, 45vw" />
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ================================================================== *
 * Industries — dual-direction marquee
 * ================================================================== */

const INDUSTRIES = [
  "Manufacturing",
  "Chemicals & Pharma",
  "Oil & Gas",
  "Construction",
  "Power & Energy",
  "Steel & Metals",
  "Ports & Shipping",
  "Textiles",
  "Railways",
  "Warehousing",
  "Municipal & Fire",
  "Food Processing",
];

function MarqueeRow({ items, reverse = false, duration }: {
  items: string[];
  reverse?: boolean;
  duration: string;
}) {
  return (
    <div className="marquee-mask">
      <div
        className={`marquee-track ${reverse ? "reverse" : ""}`}
        style={{ "--mq": duration } as React.CSSProperties}
      >
        {/* Four identical groups: the track loops at -50%, so each half must
            be pixel-identical — and wide enough for ultrawide screens. */}
        {[0, 1, 2, 3].map((dup) => (
          <ul
            key={dup}
            aria-hidden={dup > 0}
            className="flex items-center gap-3 pr-3"
          >
            {items.map((name) => (
              <li
                key={name}
                className="whitespace-nowrap rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:border-brand-200 hover:text-brand-700"
              >
                {name}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function Industries() {
  return (
    <Section tone="muted">
      <SectionHeader
        eyebrow="Who we supply"
        title="Trusted across heavy industry"
        description="From single-site contractors to multi-plant operations across Kachchh and the wider region."
        align="center"
      />

      <div className="reveal space-y-3">
        <MarqueeRow items={INDUSTRIES.slice(0, 6)} duration="38s" />
        <MarqueeRow items={INDUSTRIES.slice(6)} reverse duration="46s" />
      </div>
    </Section>
  );
}

/* ================================================================== *
 * CTA
 * ================================================================== */

function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-brand-700">
      <div
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
            Tell us what you need protected.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-100 sm:text-lg">
            Send us your requirement — quantity, standard, site conditions — and
            we&apos;ll come back with options and pricing.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={whatsappHref(GENERAL_ENQUIRY_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white px-7 text-base text-brand-700 shadow-sm hover:bg-brand-50"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp {site.phoneDisplay}
            </a>

            <Link
              href="/contact"
              className="btn border border-white/40 px-7 text-base text-white hover:bg-white/10"
            >
              Send an enquiry
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
