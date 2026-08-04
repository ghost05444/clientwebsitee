import { Link } from "@/components/Link";
import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/Section";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { CountUp } from "@/components/CountUp";
import { RotatingWord } from "@/components/RotatingWord";
import { KineticMarquee } from "@/components/KineticMarquee";
import { EmberField } from "@/components/EmberField";
import { PhotoBackdrop } from "@/components/PhotoBackdrop";
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
    <section className="grain relative overflow-hidden bg-ink-950">
      {/* --- Depth stack, back to front -------------------------------------
          1. photograph      — firefighter at a live burn, under a heavy scrim
          2. blueprint grid  — technical structure
          3. drifting glows  — colour depth
          4. heat wash       — ember light rising from the bottom edge
          5. ember field     — live particles (canvas, motion-gated)
          All decorative, all non-interactive. The scrim on the photograph is
          what keeps the copy legible; nothing here is load-bearing for
          contrast on its own. */}
      <PhotoBackdrop
        focus="left"
        priority
        frames={[
          { name: "hero-firefighter", position: "70% center" },
          { name: "interior-burn", position: "55% center" },
          { name: "crew-aluminised", position: "60% center" },
        ]}
      />

      <div
        data-parallax="0.06"
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
        data-parallax="-0.12"
        className="orb pointer-events-none absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full glow" style={{ "--glow-color": "rgb(220 31 31 / 0.25)" } as React.CSSProperties}
        aria-hidden="true"
      />
      <div
        data-parallax="-0.08"
        className="orb orb-slow pointer-events-none absolute -bottom-44 -left-36 h-[28rem] w-[28rem] rounded-full glow" style={{ "--glow-color": "rgb(244 95 7 / 0.14)" } as React.CSSProperties}
        aria-hidden="true"
      />

      <div
        className="heat-base heat-pulse pointer-events-none absolute inset-x-0 bottom-0 h-[62%]"
        aria-hidden="true"
      />

      <EmberField className="z-[1]" density={2.4} max={80} />

      <div className="container-page relative z-[2] py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
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

            {/* Each line rises out of its own overflow mask, one beat apart.
                `drop-shadow` rather than `text-shadow`: it follows the glyph
                edges, so it lifts the type off the flames without the muddy
                halo a blurred box shadow leaves behind. */}
            <h1 className="mt-6 text-[2.75rem] font-bold leading-[0.98] tracking-[-0.03em] text-white [text-wrap:balance] drop-shadow-[0_2px_24px_rgb(0_0_0/0.65)] sm:text-6xl lg:text-7xl xl:text-[5rem]">
              <span className="hero-line">
                <span style={hd(120)}>Safety equipment</span>
              </span>
              <span className="hero-line">
                <span style={hd(230)}>
                  {/* text-brand-500 is the fallback if background-clip:text
                      is unsupported; .text-flame paints over it. */}
                  <span className="text-flame text-brand-500">that comes home</span>
                </span>
              </span>
              <span className="hero-line">
                <span style={hd(340)}>
                  with{" "}
                  <RotatingWord
                    words={["your team.", "factories.", "refineries.", "ports."]}
                    resting="your team."
                  />
                </span>
              </span>
            </h1>

            <p
              className="hero-fade mt-7 max-w-lg text-[15px] leading-[1.7] text-ink-200/90 drop-shadow-[0_1px_10px_rgb(0_0_0/0.6)] sm:text-[17px]"
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
              className="hero-fade mt-11 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-7"
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

          {/* Category preview tiles — real product imagery, cursor tilt + glow.
              Parallax sits on the inner grid, not the `.hero-fade` wrapper:
              the entrance animation owns `transform` there (fill: both keeps
              holding it after it finishes) and would swallow the drift. */}
          <div className="hero-fade lg:col-span-5" style={hd(300)}>
            <div data-parallax="0.05" className="grid grid-cols-2 gap-3 sm:gap-4">
              {heroCats.map((cat, i) => {
                const img = getCategoryHeroImage(cat);
                return (
                  <Link
                    key={cat.slug}
                    href={`/products/${cat.slug}`}
                    className="tilt spot spot-dark group relative isolate flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] p-3 shadow-[0_8px_32px_-12px_rgb(0_0_0/0.7)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-flame-400/50 hover:bg-white/[0.1] hover:shadow-[0_18px_44px_-14px_rgb(244_95_7/0.45)] sm:p-3.5"
                  >
                    {/* Ember wash that lifts on hover, behind the content. */}
                    <span
                      className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-flame-500/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden="true"
                    />

                    {/* The catalogue is shot on white, so the product needs a
                        light plate to read against a dark glass card. A radial
                        rather than a flat fill keeps it from looking like a
                        pasted-on box. */}
                    <div
                      className="rounded-xl p-2.5"
                      style={{
                        background:
                          "radial-gradient(120% 100% at 50% 0%, #fff 0%, #f3f5f8 55%, #e6eaf0 100%)",
                      }}
                    >
                      <ProductImage
                        image={img}
                        priority={i < 2}
                        sizes="(min-width: 1024px) 200px, 40vw"
                        fallbackLabel={cat.name}
                        className="drop-shadow-[0_6px_10px_rgb(14_20_28/0.18)] transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-[1.07]"
                      />
                    </div>

                    <p className="mt-3 font-display text-[15px] font-bold leading-tight text-white transition-colors group-hover:text-flame-300">
                      {cat.name}
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-ink-400">
                      <span
                        className="h-1 w-1 rounded-full bg-flame-500"
                        aria-hidden="true"
                      />
                      {cat.count} products
                    </p>
                  </Link>
                );
              })}
            </div>
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
