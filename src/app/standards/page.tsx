import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Section, SectionHeader } from "@/components/Section";
import { CountUp } from "@/components/CountUp";
import { WhatsAppIcon } from "@/components/Header";
import {
  getStandardsTally,
  countCertifiedProducts,
  countDistinctStandards,
  products,
} from "@/lib/catalog";
import { site, whatsappHref, GENERAL_ENQUIRY_MESSAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Standards & Compliance",
  description:
    "What EN and IS marks actually certify, the standards cited most often across our catalogue, and how we support audits, safety-committee sign-off and tender submissions with datasheets on every product.",
  alternates: { canonical: "/standards" },
};

/**
 * Plain-language meaning for the standards our catalogue cites.
 *
 * Keyed on the base reference without an edition year, matching how
 * `getStandardsTally` normalises. Anything not in this map still renders —
 * with the count and a pointer to the datasheet rather than an invented
 * description.
 */
const MEANINGS: Record<string, { scope: string; detail: string }> = {
  "EN 166": {
    scope: "Eye protection",
    detail:
      "The base specification for all safety eyewear. Carries an optical class and an impact rating — F for low energy, B for medium, A for high — plus symbols for the specific field of use.",
  },
  "EN 388": {
    scope: "Hand protection",
    detail:
      "Mechanical risks, reported as four digits and up to two letters: abrasion, coupe cut, tear, puncture, TDM cut (A–F) and impact. The TDM letter is the meaningful cut rating.",
  },
  "IS 15298": {
    scope: "Foot protection",
    detail:
      "The Indian specification for safety, protective and occupational footwear, issued in parts. This is the reference most Indian tenders cite for safety shoes.",
  },
  "IS 3521": {
    scope: "Fall protection",
    detail:
      "Industrial safety belts and harnesses — the Indian standard commonly specified alongside its EN equivalents in tender documents.",
  },
  "EN 795": {
    scope: "Fall protection",
    detail:
      "Anchor devices, Classes A to E. The class tells you how it is fixed and whether it is permanent structure or a portable device such as a tripod.",
  },
  "EN 361": {
    scope: "Fall protection",
    detail:
      "Full body harnesses — the only harness type permitted to arrest a fall. A waist belt alone is never fall arrest equipment.",
  },
  "EN 354": {
    scope: "Fall protection",
    detail:
      "Lanyards. Note that a lanyard to EN 354 on its own has no energy absorption — for fall arrest it must be paired with an absorber to EN 355.",
  },
  "EN 355": {
    scope: "Fall protection",
    detail:
      "Energy absorbers. Limits arrest force to a survivable level by tearing a stitched pack in a controlled way. Once deployed the lanyard is scrap.",
  },
  "EN 170": {
    scope: "Eye protection",
    detail:
      "Ultraviolet filters, used with EN 166. The scale number tells you the level of UV attenuation and how colour recognition is affected.",
  },
  "EN 360": {
    scope: "Fall protection",
    detail:
      "Retractable type fall arresters. They pay out and lock like a seat belt, arresting in a much shorter distance than a lanyard — the answer where fall clearance is tight.",
  },
  "EN 172": {
    scope: "Eye protection",
    detail:
      "Sunglare filters for industrial use, for outdoor work where glare rather than a specific radiation hazard is the problem.",
  },
  "EN 358": {
    scope: "Work positioning",
    detail:
      "Belts and lanyards for work positioning and restraint. Holds a worker in place to work with both hands; it is not a fall arrest device on its own.",
  },
  "EN 397": {
    scope: "Head protection",
    detail:
      "Industrial safety helmets. Read the optional marks — low and high temperature, 440 V, lateral deformation, molten metal — and note the chinstrap is designed to release.",
  },
  "EN 362": {
    scope: "Connectors",
    detail:
      "Karabiners and hooks, classified by type, with defined gate strength and locking action. The connector is a rated part of the system, not a fitting.",
  },
  "EN 407": {
    scope: "Hand protection",
    detail:
      "Gloves against thermal risks, with six separately rated numbers — burning behaviour, contact, convective and radiant heat, and small and large molten metal splash.",
  },
  "IS 2925": {
    scope: "Head protection",
    detail:
      "The Indian standard for industrial safety helmets, covering shock absorption and penetration resistance.",
  },
  "EN 352": {
    scope: "Hearing protection",
    detail:
      "Hearing protectors, issued in parts — ear-muffs, ear-plugs, helmet-mounted. Look for the SNR or the H/M/L values against your measured noise exposure.",
  },
  "EN 14470": {
    scope: "Storage",
    detail:
      "Fire resistant storage cabinets, classified by how long they hold back a fire — Type 90 for ninety minutes, and so on down.",
  },
  "NFPA 30": {
    scope: "Storage",
    detail:
      "The US Flammable and Combustible Liquids Code, frequently cited alongside EN classifications on safety storage cabinets.",
  },
};

const tally = getStandardsTally(12);
const certified = countCertifiedProducts();
const withDatasheet = products.filter((p) => p.datasheet).length;

export default function StandardsPage() {
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
          className="orb pointer-events-none absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-brand-600/20 blur-[120px]"
          aria-hidden="true"
        />

        <div className="container-page relative py-14 sm:py-20 lg:py-24">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Standards" }]}
          />

          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="hero-line">
              <span style={{ "--hd": "60ms" } as React.CSSProperties}>
                The mark on the label
              </span>
            </span>
            <span className="hero-line">
              <span style={{ "--hd": "180ms" } as React.CSSProperties}>
                <span className="text-brand-500">is the whole claim.</span>
              </span>
            </span>
          </h1>

          <p
            className="hero-fade mt-6 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg"
            style={{ "--hd": "300ms" } as React.CSSProperties}
          >
            A standard number tells you what a product was tested against —
            and, just as importantly, what it was not. This page explains the
            marks you will meet most often in our catalogue.
          </p>

          <dl
            className="hero-fade mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-ink-800 pt-7"
            style={{ "--hd": "400ms" } as React.CSSProperties}
          >
            {[
              { label: "Products with a cited standard", value: certified },
              { label: "Products with a datasheet", value: withDatasheet },
              { label: "Distinct standards", value: countDistinctStandards() },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <CountUp
                    value={stat.value}
                    className="block font-display text-2xl font-bold text-white sm:text-3xl"
                  />
                  <span className="mt-0.5 block text-xs text-ink-400">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hazard-rule hazard-rule-move h-1.5" aria-hidden="true" />
      </section>

      {/* ================= EN vs IS ================= */}
      <Section>
        <SectionHeader
          eyebrow="EN or IS"
          title="Two systems, and when each one matters"
          description="Most of what we supply carries a European reference, an Indian one, or both. Neither is automatically better — what matters is which one your specification, your client or your tender actually asks for."
        />

        <div className="grid gap-5 lg:grid-cols-2" data-stagger="100">
          {[
            {
              title: "EN — European Norms",
              body: "Harmonised European standards, written around a hazard and usually reported as a graded performance rather than a pass mark. That grading is the useful part: EN 388 gives six separate ratings, EN ISO 11612 gives letter codes for six different kinds of heat. An EN mark without its accompanying numbers tells you very little.",
              points: [
                "Performance is graded, not binary — read the numbers, not just the code",
                "Widely recognised by multinational clients and export customers",
                "Optional clauses are marked on the product, so specify the ones you need",
              ],
            },
            {
              title: "IS — Indian Standards",
              body: "Published by the Bureau of Indian Standards, and the reference most Indian government and PSU tenders are written against. For several categories — safety footwear, helmets, harnesses — an IS reference is what the paperwork will demand, regardless of what else the product also meets.",
              points: [
                "Frequently mandatory in government and PSU tender documents",
                "Often carried alongside an EN reference on the same product",
                "Check which the buyer's specification names before ordering in volume",
              ],
            },
          ].map((column) => (
            <div
              key={column.title}
              className="spot reveal rounded-2xl border border-ink-200 bg-white p-6 sm:p-7"
            >
              <h3 className="font-display text-xl font-bold text-ink-900 sm:text-2xl">
                {column.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
                {column.body}
              </p>
              <ul className="mt-4 space-y-2 border-t border-ink-100 pt-4">
                {column.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2.5 text-sm leading-relaxed text-ink-600"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-600"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ================= The table ================= */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="Most cited"
          title="The standards you'll meet most often"
          description="Counted directly from the catalogue at build time, so this table reflects what we actually stock rather than a generic list."
        />

        {/* Wide table scrolls inside its own box rather than widening the page. */}
        <div className="reveal overflow-x-auto rounded-2xl border border-ink-200 bg-white">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <caption className="sr-only">
              The twelve standards cited most often across the {site.name}{" "}
              catalogue, with what each one certifies
            </caption>
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50">
                <th scope="col" className="px-4 py-3 font-display font-bold text-ink-900">
                  Standard
                </th>
                <th scope="col" className="px-4 py-3 font-display font-bold text-ink-900">
                  Applies to
                </th>
                <th scope="col" className="px-4 py-3 font-display font-bold text-ink-900">
                  What it certifies
                </th>
                <th scope="col" className="px-4 py-3 text-right font-display font-bold text-ink-900">
                  Products
                </th>
              </tr>
            </thead>
            <tbody>
              {tally.map((row) => {
                const meaning = MEANINGS[row.code];
                return (
                  <tr
                    key={row.code}
                    className="border-b border-ink-100 last:border-0 odd:bg-ink-50/50"
                  >
                    <th scope="row" className="whitespace-nowrap px-4 py-3.5 align-top">
                      <span className="font-display font-bold text-ink-900">
                        {row.code}
                      </span>
                      {row.editions.length > 0 && (
                        <span className="mt-0.5 block text-xs font-normal text-ink-400">
                          {row.editions.join(" · ")}
                        </span>
                      )}
                    </th>
                    <td className="whitespace-nowrap px-4 py-3.5 align-top text-ink-600">
                      {meaning?.scope ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 align-top leading-relaxed text-ink-600">
                      {meaning?.detail ?? (
                        <>
                          Cited on products in this catalogue — see the
                          datasheet on the product page for the full scope.
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right align-top font-semibold tabular text-ink-700">
                      {row.count}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="reveal mt-4 text-sm text-ink-500">
          A standard covers only the hazard it was written for. A glove rated
          under EN 388 has no established chemical or thermal protection unless
          it also carries EN 374 or EN 407 — always read the full set of marks.
        </p>
      </Section>

      {/* ================= Audits & tenders ================= */}
      <Section tone="dark">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Audits & tenders"
              title="Paperwork that survives the auditor"
              description="Certification is only useful if you can produce it on the day someone asks. Every product page carries what it was tested against."
              tone="dark"
            />

            <div className="reveal flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="btn-primary px-6">
                Browse the catalogue
              </Link>
              <Link
                href="/contact"
                className="btn border border-ink-800 px-6 text-white hover:bg-ink-900"
              >
                Request documentation
              </Link>
            </div>
          </div>

          <ul className="lg:col-span-7 lg:pt-4" data-stagger="110">
            {[
              {
                n: "01",
                title: "Standards printed on the product page",
                body: "Every item lists the references it is certified to, so a specification can be checked before an order is placed rather than when the delivery arrives.",
              },
              {
                n: "02",
                title: "Datasheets available for download",
                body: `${withDatasheet} products in the catalogue carry a manufacturer datasheet, served from this site — attach it to a tender response or a safety-committee paper directly.`,
              },
              {
                n: "03",
                title: "Documentation assembled per order",
                body: "For tender submissions and audits we assemble the certification per line item rather than leaving you to collate it. Ask at quotation stage and it ships with the goods.",
              },
            ].map((item) => (
              <li
                key={item.n}
                className="reveal from-right flex gap-5 border-t border-ink-800 py-6 first:border-t-0 first:pt-0 sm:gap-7"
              >
                <span className="font-display text-2xl font-bold text-brand-500 sm:text-3xl">
                  {item.n}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400 sm:text-base">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ================= CTA ================= */}
      <Section>
        <div className="reveal zoom mx-auto max-w-3xl rounded-2xl border border-ink-200 bg-ink-50 p-8 text-center sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            Not sure which standard your tender needs?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-ink-600 sm:text-base">
            Send us the clause. We&apos;ll tell you which products in the range
            meet it, and where a specification asks for something that does not
            match the hazard.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
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
