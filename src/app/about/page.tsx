import { Link } from "@/components/Link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeader } from "@/components/Section";
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

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="About us"
        title="Safety equipment, supplied properly."
        description={`${site.legalName} supplies certified personal protective equipment and fire safety systems to industrial sites across Gujarat and India — from our base in Anjar, Kachchh.`}
      />

      {/* ---------------- Story ---------------- */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
              We sell the equipment people go home in.
            </h2>

            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-600 sm:text-base">
              <p>
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
                  { term: "Range", detail: `${products.length}+ products, ${categories.length} categories` },
                  { term: "Standards", detail: "EN, IS and ANSI certified equipment" },
                  { term: "Supply", detail: "Single units to full plant rollouts" },
                  { term: "Sectors", detail: "Manufacturing, chemicals, ports, construction, power" },
                  { term: "Hours", detail: site.hours },
                ].map((row) => (
                  <div key={row.term} className="border-t border-ink-200 pt-3 first:border-0 first:pt-0">
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

      {/* ---------------- How we work ---------------- */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="How we work"
          title="Four steps, no mystery"
          description="Most enquiries are resolved the same day. Larger rollouts get a site visit first."
        />

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* ---------------- Coverage ---------------- */}
      <Section>
        <SectionHeader
          eyebrow="What we stock"
          title="Complete head-to-toe coverage"
          link={{ href: "/products", label: "Browse all products" }}
        />

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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

      {/* ---------------- Visit ---------------- */}
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
