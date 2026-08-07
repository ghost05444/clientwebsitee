import { Link } from "./Link";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./Header";
import { getMainCategories } from "@/lib/catalog";
import { SOLUTION_NAV } from "@/data/solution-nav";
import {
  site,
  addressLines,
  telHref,
  mailHref,
  whatsappHref,
  GENERAL_ENQUIRY_MESSAGE,
} from "@/lib/site";

export function Footer() {
  const categories = getMainCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-ink-950 text-ink-300">
      {/* Hazard hairline — industrial signature, purely decorative. */}
      <div className="hazard-rule h-1.5" aria-hidden="true" />

      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <Logo variant="light" taglineOnMobile />

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">
              Supplier of certified industrial safety and fire protection
              equipment across Gujarat and India. Head-to-toe PPE, fall
              protection and workplace safety systems.
            </p>

            <address className="mt-6 space-y-3 text-sm not-italic">
              <div className="flex gap-3">
                <PinIcon />
                <span className="text-ink-400">
                  {addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </div>

              <a
                href={telHref}
                className="flex min-h-11 items-center gap-3 text-ink-300 transition-colors hover:text-white"
              >
                <PhoneIcon />
                {site.phoneDisplay}
              </a>

              <a
                href={mailHref}
                className="flex min-h-11 items-center gap-3 break-all text-ink-300 transition-colors hover:text-white"
              >
                <MailIcon />
                {site.email}
              </a>

              <div className="flex gap-3 pt-1 text-ink-400">
                <ClockIcon />
                <span>{site.hours}</span>
              </div>
            </address>

            <a
              href={whatsappHref(GENERAL_ENQUIRY_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-6 w-full sm:w-auto"
            >
              <WhatsAppIcon />
              Message us on WhatsApp
            </a>
          </div>

          {/* Category columns */}
          <div className="lg:col-span-4">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">
              Product Categories
            </h2>

            <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products/${cat.slug}`}
                    className="flex min-h-10 items-center gap-2 text-sm text-ink-400 transition-colors hover:text-white"
                  >
                    {cat.name}
                    <span className="text-xs text-ink-600">{cat.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">
              Solutions
            </h2>

            <ul className="mt-5 space-y-0.5">
              {SOLUTION_NAV.map((solution) => (
                <li key={solution.slug}>
                  <Link
                    href={`/solutions/${solution.slug}`}
                    className="flex min-h-10 items-center text-sm leading-snug text-ink-400 transition-colors hover:text-white"
                  >
                    {solution.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">
              Company
            </h2>

            <ul className="mt-5 space-y-0.5">
              {[
                { label: "Services", href: "/services" },
                { label: "Standards & Compliance", href: "/standards" },
                { label: "Safety Notes", href: "/blog" },
                { label: "About Us", href: "/about" },
                { label: "All Products", href: "/products" },
                { label: "Contact", href: "/contact" },
                { label: "Request a Quote", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex min-h-10 items-center text-sm leading-snug text-ink-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-900">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

/* ---- icons ---- */

const iconClass = "h-4 w-4 shrink-0 text-brand-500 mt-0.5";

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" className={iconClass} fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" className={iconClass} fill="currentColor" aria-hidden="true">
      <path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-7.18 0-13-5.82-13-13V3.5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" className={iconClass} fill="currentColor" aria-hidden="true">
      <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
      <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" className={iconClass} fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
        clipRule="evenodd"
      />
    </svg>
  );
}
