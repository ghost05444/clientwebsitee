import { Link } from "@/components/Link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Section, SectionHeader } from "@/components/Section";
import { CountUp } from "@/components/CountUp";
import { WhatsAppIcon } from "@/components/Header";
import { getMainCategories, products } from "@/lib/catalog";
import {
  site,
  addressLines,
  telHref,
  whatsappHref,
  GENERAL_ENQUIRY_MESSAGE,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `${site.legalName} supplies certified industrial safety and fire protection equipment from Anjar, Kachchh — serving manufacturing, chemical, construction and energy sites across Gujarat and India.`,
  alternates: { canonical: "/about" },
};

const categories = getMainCategories();

/**
 * Districts we describe ourselves as serving.
 *
 * Deliberately a named list rather than a claimed number: we can point at
 * where Kachchh's industry actually is without asserting a client count.
 */
const DISTRICTS = [
  "Kachchh",
  "Morbi",
  "Rajkot",
  "Jamnagar",
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Bharuch",
];

const VALUES = [
  {
    title: "Safety first",
    body: "If a product does not cover the hazard you described, we say so — even when the order is already written and the cheaper item would have shipped today.",
    path: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z",
  },
  {
    title: "Certified only",
    body: "Everything we list carries the standard it was tested against, with the datasheet available. If a product cannot show its certification, it does not go in the catalogue.",
    path: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
  },
  {
    title: "Straight answers",
    body: "Plain technical advice about what a standard does and does not cover. No upselling a class of protection the exposure does not call for.",
    path: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z",
  },
  {
    title: "Supply reliability",
    body: "One replacement harness or a full plant rollout, with repeat-order schedules built around your shutdown calendar rather than ours.",
    path: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ================= Parallax hero ================= */}
      <section className="relative overflow-hidden bg-ink-950">
        <div
          data-parallax="0.06"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 85% 75% at 45% 30%, black 25%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 75% at 45% 30%, black 25%, transparent 78%)",
          }}
          aria-hidden="true"
        />
        <div
          data-parallax="-0.12"
          className="orb pointer-events-none absolute -right-40 -top-44 h-[34rem] w-[34rem] rounded-full bg-brand-600/20 blur-[130px]"
          aria-hidden="true"
        />
        <div
          data-parallax="-0.08"
          className="orb orb-slow pointer-events-none absolute -bottom-44 -left-36 h-[28rem] w-[28rem] rounded-full bg-hivis-500/10 blur-[110px]"
          aria-hidden="true"
        />

        <div className="container-page relative py-14 sm:py-20 lg:py-28">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

          <p className="hero-fade eyebrow mt-6 text-brand-400">About us</p>

          <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="hero-line">
              <span style={{ "--hd": "80ms" } as React.CSSProperties}>
                We sell the equipment
              </span>
            </span>
            <span className="hero-line">
              <span style={{ "--hd": "200ms" } as React.CSSProperties}>
                <span className="text-brand-500">people go home in.</span>
              </span>
            </span>
          </h1>

          <p
            className="hero-fade mt-6 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg"
            style={{ "--hd": "320ms" } as React.CSSProperties}
          >
            {site.legalName} supplies certified personal protective equipment
            and fire safety systems to industrial sites across Gujarat and
            India — from our base in Anjar, Kachchh.
          </p>
        </div>

        <div className="hazard-rule hazard-rule-move h-1.5" aria-hidden="true" />
      </section>

      {/* ================= Who we are ================= */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
              Who we are
            </h2>

            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-600 sm:text-base">
              <p data-words className="text-lg text-ink-800 sm:text-xl">
                Kachchh runs on heavy industry — ports, cement, chemicals,
                textiles, power and the construction that keeps pace with them.
                Every one of those sites depends on equipment that has to work
                the one time it matters.
              </p>
              <p>
                {site.name} exists to make that equipment easy to get hold of,
                and easy to get right. We stock a full head-to-toe range across{" "}
                {categories.length} categories and {products.length}+ products —
                helmets and eye protection through to fall arrest systems, arc
                flash garments, respiratory protection and spill control.
              </p>
              <p>
                Every product we list carries the standard it is tested
                against — EN, IS, ANSI — with datasheets available for your
                safety committee, audit file or tender submission. If a product
                does not carry the right certification for your hazard, we will
                tell you so.
              </p>
              <p>
                Most of what we do is unglamorous: getting the right size range
                on site before a shutdown, matching a glove to an actual cut
                risk instead of a catalogue page, replacing a harness that
                failed inspection. That is the job.
              </p>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-ink-200 bg-ink-50 p-6">
              <h3 className="font-display text-lg font-bold text-ink-900">
                At a glance
              </h3>

              <dl className="mt-5 space-y-4">
                {[
                  { term: "Based in", detail: "Anjar, Kachchh — Gujarat" },
                  {
                    term: "Range",
                    detail: `${products.length}+ products, ${categories.length} categories`,
                  },
                  { term: "Standards", detail: "EN, IS and ANSI certified equipment" },
                  { term: "Supply", detail: "Single units to full plant rollouts" },
                  {
                    term: "Sectors",
                    detail: "Manufacturing, chemicals, ports, construction, power",
                  },
                  { term: "Hours", detail: site.hours },
                ].map((row) => (
                  <div
                    key={row.term}
                    className="border-t border-ink-200 pt-3 first:border-0 first:pt-0"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                      {row.term}
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium text-ink-800">
                      {row.detail}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 space-y-2">
                <a
                  href={whatsappHref(GENERAL_ENQUIRY_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full"
                >
                  <WhatsAppIcon />
                  WhatsApp us
                </a>
                <a href={telHref} className="btn-secondary w-full">
                  {site.phoneDisplay}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* ================= Stats band ================= */}
      <section className="border-y border-ink-200 bg-ink-50">
        <div
          className="container-page grid gap-8 py-12 sm:grid-cols-3 lg:py-14"
          data-stagger="110"
        >
          {[
            {
              value: products.length,
              suffix: "+",
              label: "Products stocked",
              note: "Across head-to-toe PPE and workplace safety systems",
            },
            {
              value: categories.length,
              suffix: "",
              label: "Safety categories",
              note: "From head protection to spill containment",
            },
            {
              value: DISTRICTS.length,
              suffix: "+",
              label: "Districts served",
              note: DISTRICTS.slice(0, 4).join(", ") + " and beyond",
            },
          ].map((stat) => (
            <div key={stat.label} className="reveal">
              <CountUp
                value={stat.value}
                suffix={stat.suffix}
                className="block font-display text-4xl font-bold text-ink-900 sm:text-5xl"
              />
              <p className="mt-1.5 font-display text-base font-bold text-ink-800">
                {stat.label}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-500">
                {stat.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Values ================= */}
      <Section>
        <SectionHeader
          eyebrow="What we hold to"
          title="Four things we don't trade away"
          description="Short list, and none of it is unusual. The difference is whether a supplier still applies it when the order is large and the deadline is tight."
        />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-stagger="90">
          {VALUES.map((value) => (
            <li
              key={value.title}
              className="spot reveal flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
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
                  <path d={value.path} />
                </svg>
              </span>

              <h3 className="mt-4 font-display text-lg font-bold text-ink-900">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {value.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ================= How we work ================= */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="How we work"
          title="Four steps, no mystery"
          description="Most enquiries are resolved the same day. Larger rollouts get a site visit first."
          link={{ href: "/services", label: "More on our services" }}
        />

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-stagger="100">
          {[
            {
              n: "01",
              title: "Tell us the hazard",
              body: "Send the requirement over WhatsApp or the enquiry form — hazard, quantity, sizes, standard needed.",
            },
            {
              n: "02",
              title: "We spec it",
              body: "We come back with options that actually match the exposure, including the certification each one carries.",
            },
            {
              n: "03",
              title: "Quotation",
              body: "Clear pricing with volume breaks. Datasheets attached for your audit and approval process.",
            },
            {
              n: "04",
              title: "Supply & resupply",
              body: "Delivery to site, with repeat-order schedules for consumables and shutdown planning.",
            },
          ].map((step) => (
            <li
              key={step.n}
              className="reveal rounded-xl border border-ink-200 bg-white p-5"
            >
              <span className="font-display text-2xl font-bold text-brand-600">
                {step.n}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-ink-900">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ================= Coverage ================= */}
      <Section>
        <SectionHeader
          eyebrow="What we stock"
          title="Complete head-to-toe coverage"
          link={{ href: "/products", label: "Browse all products" }}
        />

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" data-stagger="50">
          {categories.map((cat) => (
            <li key={cat.slug} className="reveal">
              <Link
                href={`/products/${cat.slug}`}
                className="flex h-full min-h-20 flex-col justify-between rounded-xl border border-ink-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <span className="font-display text-sm font-bold leading-tight text-ink-900 sm:text-base">
                  {cat.name}
                </span>
                <span className="mt-2 text-xs font-semibold text-ink-400">
                  {cat.count} products
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ================= Visit ================= */}
      <Section tone="dark">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Find us"
              title="Come and see the range"
              description="Walk in during working hours, or call ahead and we'll have the relevant products ready to look at."
              tone="dark"
            />
          </div>

          <div className="reveal">
            <address className="not-italic">
              <p className="font-display text-lg font-bold text-white">
                {site.legalName}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>

              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex gap-2">
                  <dt className="text-ink-500">Phone</dt>
                  <dd>
                    <a href={telHref} className="text-white hover:text-brand-400">
                      {site.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-ink-500">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${site.email}`}
                      className="break-all text-white hover:text-brand-400"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-ink-500">Hours</dt>
                  <dd className="text-ink-300">{site.hours}</dd>
                </div>
              </dl>
            </address>

            <Link href="/contact" className="btn-primary mt-6">
              Get directions &amp; enquire
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
