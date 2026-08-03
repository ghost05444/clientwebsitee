import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { EnquiryForm } from "@/components/EnquiryForm";
import { WhatsAppIcon } from "@/components/Header";
import {
  site,
  addressLines,
  telHref,
  mailHref,
  whatsappHref,
  mapEmbedSrc,
  mapDirectionsHref,
  GENERAL_ENQUIRY_MESSAGE,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${site.legalName} in Anjar, Kachchh for safety equipment enquiries and quotations. Call ${site.phoneDisplay}, WhatsApp us or email ${site.email}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Get in touch"
        title="Tell us what you need protected."
        description="Send a requirement and we'll come back with options, certification details and pricing — usually the same working day."
      />

      <div className="container-page py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ---------------- Contact channels ---------------- */}
          <div className="lg:col-span-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <ContactCard
                title="WhatsApp"
                subtitle="Fastest — send photos, specs or a parts list"
                value={site.phoneDisplay}
                href={whatsappHref(GENERAL_ENQUIRY_MESSAGE)}
                external
                accent
                icon={<WhatsAppIcon className="h-5 w-5" />}
              />

              <ContactCard
                title="Call us"
                subtitle={site.hours}
                value={site.phoneDisplay}
                href={telHref}
                icon={
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-7.18 0-13-5.82-13-13V3.5z" />
                  </svg>
                }
              />

              <ContactCard
                title="Email"
                subtitle="For tenders, drawings and bulk schedules"
                value={site.email}
                href={mailHref}
                icon={
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                }
              />

              <div className="rounded-xl border border-ink-200 bg-white p-4">
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-600">
                    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900">Visit us</p>
                    <address className="mt-1 text-sm not-italic leading-relaxed text-ink-600">
                      {addressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>

                    <a
                      href={mapDirectionsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"
                    >
                      Get directions
                      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- Form ---------------- */}
          <div className="lg:col-span-7">
            <EnquiryForm />
          </div>
        </div>
      </div>

      {/* ---------------- Map ---------------- */}
      <section aria-labelledby="map-heading" className="border-t border-ink-200">
        <h2 id="map-heading" className="sr-only">
          Our location
        </h2>

        <div className="aspect-[4/3] w-full sm:aspect-[16/7]">
          <iframe
            src={mapEmbedSrc}
            title={`Map showing ${site.legalName} in ${site.address.city}, ${site.address.district}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

function ContactCard({
  title,
  subtitle,
  value,
  href,
  icon,
  external,
  accent,
}: {
  title: string;
  subtitle: string;
  value: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
  accent?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group flex gap-3 rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        accent
          ? "border-[#25D366]/30 bg-[#25D366]/5 hover:border-[#25D366]/50"
          : "border-ink-200 bg-white hover:border-ink-300"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          accent ? "bg-[#25D366] text-white" : "bg-brand-50 text-brand-600"
        }`}
      >
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink-900">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
          {subtitle}
        </span>
        <span className="mt-1.5 block break-all text-sm font-semibold text-brand-600 group-hover:underline">
          {value}
        </span>
      </span>
    </a>
  );
}
