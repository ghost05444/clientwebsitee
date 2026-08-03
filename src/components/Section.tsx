import { Link } from "./Link";

/**
 * Shared section scaffolding so vertical rhythm and heading treatment stay
 * identical across every page.
 */
export function Section({
  children,
  className = "",
  tone = "light",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "muted" | "dark";
  id?: string;
}) {
  const toneClass =
    tone === "dark" ? "bg-ink-950 text-ink-300" : tone === "muted" ? "bg-ink-50" : "bg-white";

  return (
    <section id={id} className={`py-14 sm:py-16 lg:py-20 ${toneClass} ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

/**
 * Section heading. Internally staggered: the eyebrow (with its growing dash),
 * title, description and link cascade in one after another via the motion
 * driver instead of arriving as a single block.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  link,
  align = "left",
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  const centered = align === "center";

  return (
    <div
      data-stagger="90"
      className={`mb-8 sm:mb-10 lg:mb-12 ${
        centered ? "mx-auto max-w-2xl text-center" : "flex flex-wrap items-end justify-between gap-4"
      }`}
    >
      <div className={centered ? "" : "max-w-2xl"}>
        {eyebrow && (
          <p className="eyebrow reveal inline-flex items-center gap-2.5">
            <span className="eyebrow-dash" aria-hidden="true" />
            {eyebrow}
          </p>
        )}

        {/* One size step up on the fluid `--text-display` token, so section
            titles scale with the viewport alongside the page heroes. */}
        <h2
          className={`reveal mt-2 text-4xl font-bold tracking-tight sm:text-5xl lg:text-display ${
            tone === "dark" ? "text-white" : "text-ink-900"
          }`}
        >
          {title}
        </h2>

        {description && (
          <p
            className={`reveal mt-3 text-base leading-relaxed sm:text-lg ${
              tone === "dark" ? "text-ink-400" : "text-ink-600"
            }`}
          >
            {description}
          </p>
        )}
      </div>

      {link && (
        <Link
          href={link.href}
          className={`reveal group inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors ${
            tone === "dark" ? "text-white hover:text-brand-400" : "text-brand-600 hover:text-brand-700"
          } ${centered ? "mt-5" : ""}`}
        >
          {link.label}
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
