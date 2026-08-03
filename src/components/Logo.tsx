import { site } from "@/lib/site";

/**
 * Wordmark. The flame glyph doubles as the favicon shape, so the brand reads
 * consistently in the tab, the header and the footer.
 */
export function Logo({
  className = "",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const primary = variant === "light" ? "text-white" : "text-ink-900";
  const secondary = variant === "light" ? "text-ink-300" : "text-ink-500";

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
        aria-hidden="true"
        fill="none"
      >
        <path
          d="M16 2.5c1.9 4.6.4 7.2-1.9 9.6-2.4 2.5-5.4 4.7-5.4 9.2A7.3 7.3 0 0 0 16 28.5a7.3 7.3 0 0 0 7.3-7.2c0-3.2-1.4-5.2-2.9-7.1-.5 1.2-1.3 2-2.3 2.5.7-3.3-.4-7.3-2.1-9.2Z"
          className="fill-brand-600"
        />
        <path
          d="M16 28.5a7.3 7.3 0 0 0 7.3-7.2c0-1.6-.35-3-.95-4.2-1.1 2.3-2.9 3.3-4.6 3.5 1.1 2.4.4 4.6-1.75 7.9Z"
          className="fill-hivis-400"
        />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-lg font-bold tracking-tight sm:text-xl ${primary}`}
        >
          {site.name}
        </span>
        <span
          className={`mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.14em] sm:block ${secondary}`}
        >
          Safety &amp; Fire Protection
        </span>
      </span>
    </span>
  );
}
