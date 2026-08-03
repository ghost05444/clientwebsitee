import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Section, SectionHeader } from "@/components/Section";
import { WhatsAppIcon } from "@/components/Header";
import { site, telHref, whatsappHref, GENERAL_ENQUIRY_MESSAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Site hazard assessment, PPE selection and fitment, bulk and tender supply, height-safety equipment inspection, and toolbox-talk support — the work around the equipment that decides whether it gets worn.",
  alternates: { canonical: "/services" },
};

/* ------------------------------------------------------------------ *
 * Content
 * ------------------------------------------------------------------ */

const SERVICES = [
  {
    id: "assessment",
    title: "Site hazard assessment",
    body: "We walk the areas you are buying for and record what people are actually exposed to — cut, arc, heat, fall, chemical, noise, atmosphere — rather than working from a requisition. The output is a written list of exposures mapped to the equipment classes that address them, which is usually where a specification stops being guesswork.",
    bullets: [
      "Area-by-area exposure record you can attach to a risk assessment",
      "Gaps flagged where current issue does not match the hazard",
      "Equipment classes named with the standard each one must carry",
      "Written up so a safety committee can act on it without us present",
    ],
    path: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    id: "selection",
    title: "PPE selection & fitment guidance",
    body: "Equipment that does not fit does not get worn, and equipment that is worn wrongly is not protecting anyone. We work through sizing across the crew, including women's fits and the awkward combinations — spectacles under a full-face mask, a helmet with ear defenders and a visor — before a bulk order is placed rather than after.",
    bullets: [
      "Size range trialled with the actual users, not ordered from a chart",
      "Compatibility checked across head, eye, hearing and respiratory kit",
      "Comfort weighed as a compliance factor, not a luxury",
      "Straight advice when a cheaper item genuinely covers the hazard",
    ],
    path: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
  {
    id: "supply",
    title: "Bulk & tender supply",
    body: "Volume pricing for plant rollouts, contractor fleets and government tenders, with the documentation those processes demand — datasheets, test certificates and standards references assembled per line item. Repeat-order schedules keep consumables arriving before a shutdown rather than during it.",
    bullets: [
      "Volume pricing with clear break points",
      "Datasheets and certification packaged for tender submission",
      "Repeat-order schedules tied to your shutdown calendar",
      "Single point of contact for multi-category orders",
    ],
    path: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
  },
  {
    id: "inspection",
    title: "Height-safety & rescue inspection",
    body: "Harnesses, lanyards, retractables, anchors and rescue kit need documented periodic examination — and textile components degrade whether or not they are used. We help you set the interval, keep the register current, and replace what fails rather than letting a doubtful item go back on the rack.",
    bullets: [
      "Inspection interval set against use and environment",
      "Equipment register kept current for audit",
      "Failed items withdrawn and replaced, not returned to service",
      "Anything that has arrested a fall taken permanently out of use",
    ],
    path: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
  },
  {
    id: "training",
    title: "Toolbox-talk training support",
    body: "Equipment arrives with instructions nobody reads. We provide the short, practical briefing that goes with it — how to don it, how to check it before use, what makes it unfit, and why it matters — pitched at the shift rather than at the safety officer.",
    bullets: [
      "Pre-use check demonstrated on the equipment you actually bought",
      "Donning and adjustment covered hands-on with the crew",
      "Withdrawal criteria made concrete: what to look for, what to do",
      "Delivered in language the floor uses",
    ],
    path: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  },
];

const ENGAGEMENT = [
  {
    label: "Enquiry",
    title: "You tell us the job",
    body: "Hazard, headcount, sizes, standard, deadline — as much or as little as you have. A photograph of the work area is often worth more than a specification document, and a WhatsApp message is a perfectly good way to start.",
  },
  {
    label: "Assessment",
    title: "We establish the exposure",
    body: "For anything beyond a straight resupply we work out what people are actually exposed to, on site where the scale justifies a visit and over a call where it does not. This is the step that stops the wrong equipment being ordered in quantity.",
  },
  {
    label: "Specification",
    title: "We specify and quote",
    body: "Options that match the exposure, each with the standard it carries and the datasheet attached, priced with volume breaks. Where two products both cover the hazard we say which is better value and why, rather than quoting only the dearer one.",
  },
  {
    label: "Supply",
    title: "We supply and keep supplying",
    body: "Delivery to site with the certification your audit file needs, fitment support on arrival where it helps, and a repeat schedule for the consumables so the next shutdown is not a scramble.",
  },
];

/* ------------------------------------------------------------------ */

export default function ServicesPage() {
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
          className="orb pointer-events-none absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-hivis-500/10 blur-[120px]"
          aria-hidden="true"
        />

        <div className="container-page relative py-14 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />

          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="hero-line">
              <span style={{ "--hd": "60ms" } as React.CSSProperties}>
                The work around
              </span>
            </span>
            <span className="hero-line">
              <span style={{ "--hd": "180ms" } as React.CSSProperties}>
                <span className="text-brand-500">the equipment.</span>
              </span>
            </span>
          </h1>

          <p
            className="hero-fade mt-6 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg"
            style={{ "--hd": "300ms" } as React.CSSProperties}
          >
            Anyone can ship a carton of gloves. What decides whether they
            protect somebody is the assessment before the order, the fitment
            after it, and the inspection twelve months later.
          </p>
        </div>

        <div className="hazard-rule hazard-rule-move h-1.5" aria-hidden="true" />
      </section>

      {/* ================= Services ================= */}
      <Section>
        <SectionHeader
          eyebrow="What we do"
          title="Five things beyond the invoice"
          description="None of these are charged as consultancy. They are how we sell equipment that stays in use."
        />

        <ul className="grid gap-5 lg:grid-cols-2" data-stagger="90">
          {SERVICES.map((service) => (
            <li
              key={service.id}
              id={service.id}
              className="spot reveal flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6 sm:p-7"
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
                  <path d={service.path} />
                </svg>
              </span>

              <h2 className="mt-4 font-display text-xl font-bold text-ink-900 sm:text-2xl">
                {service.title}
              </h2>

              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-600">
                {service.body}
              </p>

              <div className="mt-5 border-t border-ink-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                  What you get
                </p>
                <ul className="mt-2.5 space-y-2">
                  {service.bullets.map((bullet) => (
                    <li
                      key={bullet}
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
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ================= How an engagement runs ================= */}
      <Section tone="muted" id="engagement">
        <SectionHeader
          eyebrow="How an engagement runs"
          title="Four steps, start to resupply"
          description="Most enquiries are answered the same day. Larger rollouts get the assessment step first."
        />

        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-stagger="100">
          {ENGAGEMENT.map((step, i) => (
            <li
              key={step.label}
              className="reveal rounded-2xl border border-ink-200 bg-white p-6"
            >
              <span className="font-display text-3xl font-bold text-brand-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="eyebrow mt-2">{step.label}</p>
              <h3 className="mt-1 font-display text-lg font-bold text-ink-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ================= CTA ================= */}
      <Section tone="dark">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="Start here"
              title="Send us the job, not a part number."
              description="Describe the site and the exposure. If a site visit is the right next step we will say so, and if it isn't we won't waste your time with one."
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
            <a href={telHref} className="btn border border-ink-800 px-6 text-white hover:bg-ink-900">
              Call us
            </a>
            <Link href="/contact" className="btn-primary px-6">
              Enquiry form
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
