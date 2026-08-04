import { Link } from "@/components/Link";
import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/Section";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { HeroShowcase } from "@/components/HeroShowcase";
import { HeroBanner } from "@/components/HeroBanner";
import { CountUp } from "@/components/CountUp";
import { KineticMarquee } from "@/components/KineticMarquee";
import { EmberField } from "@/components/EmberField";
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
      <KineticMarquee />
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
    /* Background is sampled from the artwork's own edge (rgb(41,23,22)), not
         a theme neutral. The banners are letterboxed rather than cropped —
         cropping would cut the client's logo and headline — and matching the
         fill to the artwork makes those bars indistinguishable from it at any
         viewport ratio. */
    <section
      className="grain relative overflow-hidden"
      style={{ backgroundColor: "rgb(41 23 22)" }}
    >
      {/* Ambient depth behind the artwork. The banner's own background is
          near-black, so these read through its edges and stop the panel
          sitting on the page as a flat rectangle. */}
      <div
        data-parallax="-0.1"
        className="orb pointer-events-none absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full glow"
        style={{ "--glow-color": "rgb(220 31 31 / 0.22)" } as React.CSSProperties}
        aria-hidden="true"
      />
      <div
        data-parallax="-0.06"
        className="orb orb-slow pointer-events-none absolute -bottom-40 -left-36 h-[28rem] w-[28rem] rounded-full glow"
        style={{ "--glow-color": "rgb(244 95 7 / 0.16)" } as React.CSSProperties}
        aria-hidden="true"
      />

      {/* --- Band 1: the client's artwork ---------------------------------
          Shown complete, never cropped. The artwork already carries the
          wordmark, the "Protecting what matters" headline and the four
          feature labels, so cropping it would cut the client's own copy —
          and overlaying our headline on it would collide with theirs. Hence
          `object-contain` and a height cap rather than `cover`, and hence
          our copy lives in band 2 below rather than on top.

          Two separate artworks, art-directed: portrait stacks the elements
          for a phone, landscape sets them side by side. `<picture>` picks
          one at the source level, so a phone never downloads the desktop
          file. */}
      <div className="relative">
        <HeroBanner />

        {/* Embers drift over the artwork. Low density — this sits on top of
            the client's own composition and must not compete with it. */}
        <EmberField className="z-[1]" density={1.5} max={44} />

        {/* Feathers the artwork's bottom edge into the action band so the two
            read as one section rather than an image with content under it. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-14"
          style={{ background: "linear-gradient(to top, rgb(41 23 22), transparent)" }}
          aria-hidden="true"
        />
      </div>

      {/* --- Band 2: our copy and actions ---------------------------------- */}
      <div className="container-page relative z-[2] pb-12 pt-1 sm:pb-14 lg:pb-16">
        {/* The visible headline is inside the artwork, which crawlers and
            screen readers cannot read. This carries it as real text without
            putting a second competing headline on screen. */}
        <h1 className="sr-only">
          Krushnam Fire — protecting what matters, everyday. Industrial safety
          and fire protection equipment in Anjar, Kachchh.
        </h1>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <p
              className="hero-fade inline-flex items-center gap-2 rounded-full border border-flame-700/40 bg-ink-900/70 px-3 py-1.5 text-xs font-medium text-ink-200 backdrop-blur-sm"
              style={hd(0)}
            >
              <span
                className="ember-flicker h-1.5 w-1.5 rounded-full bg-flame-400 shadow-[0_0_8px_2px_rgb(255_171_61/0.65)]"
                aria-hidden="true"
              />
              Serving Anjar, Kachchh &amp; all of Gujarat
            </p>

            <p
              className="hero-fade mt-5 max-w-xl text-[17px] font-medium leading-[1.55] text-white sm:text-xl"
              style={hd(120)}
            >
              Certified head-to-toe PPE, fall protection and fire safety systems
              from{" "}
              <span className="text-flame text-brand-500">
                {totalProducts}+ products
              </span>{" "}
              — backed by on-site assessment and fast supply across India.
            </p>

            <div className="hero-fade mt-7 flex flex-col gap-3 sm:flex-row" style={hd(240)}>
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
              className="hero-fade mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-6"
              style={hd(360)}
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

          {/* Category entry points. The artwork shows equipment; these are the
              navigable way in, which it cannot be. */}
          <div className="hero-fade min-w-0 lg:col-span-5" style={hd(420)}>
            <HeroShowcase categories={heroCats} />
          </div>
        </div>
      </div>

      {/* Molten seam, then the hazard stripe — the hero burns down into the
          page rather than stopping at a hard edge. */}
      <div
        className="ember-rule ember-flicker relative z-[2] h-px shadow-[0_0_18px_2px_rgb(244_95_7/0.55)]"
        aria-hidden="true"
      />
      <div className="hazard-rule hazard-rule-move relative z-[2] h-1.5" aria-hidden="true" />
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
                className="spot group relative flex h-full flex-col overflow-hidden rounded-xl border border-ink-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-flame-400/60 hover:shadow-xl hover:shadow-flame-600/15"
              >
                {/* Heat rises through the card on hover. */}
                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-flame-500/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />

                <div className="relative bg-ink-50 p-4 transition-colors duration-300 group-hover:bg-flame-300/15">
                  <ProductImage
                    image={img}
                    sizes="(min-width: 1024px) 300px, 45vw"
                    fallbackLabel={cat.name}
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="relative flex flex-1 flex-col p-3.5 sm:p-4">
                  <h3 className="font-display text-base font-bold leading-tight text-ink-900 transition-colors group-hover:text-flame-700 sm:text-lg">
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
    <Section tone="dark" atmosphere>
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
    /* Deep ember base rather than flat brand red, so the fire gradient and
       particles have somewhere dark to burn against. */
    <section className="grain relative overflow-hidden bg-flame-900">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 120% at 50% 108%, rgb(255 138 24 / 0.5) 0%, rgb(204 61 5 / 0.34) 32%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div
        data-parallax="0.08"
        className="stripes-move pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #fff 0 2px, transparent 2px 14px)",
        }}
        aria-hidden="true"
      />

      <EmberField density={2.8} max={70} />

      <div className="container-page relative z-[2] py-14 lg:py-20">
        <div className="reveal zoom mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Tell us what you need protected.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-flame-300/90 sm:text-lg">
            Send us your requirement — quantity, standard, site conditions — and
            we&apos;ll come back with options and pricing.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={whatsappHref(GENERAL_ENQUIRY_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine btn bg-white px-7 text-base text-flame-800 shadow-lg hover:bg-flame-300"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp {site.phoneDisplay}
            </a>

            <Link
              href="/contact"
              className="btn border border-flame-300/40 px-7 text-base text-white backdrop-blur-sm hover:bg-white/10"
            >
              Send an enquiry
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
