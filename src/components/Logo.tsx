import { site } from "@/lib/site";

/**
 * Header / footer brand mark.
 *
 * The real flame, cut from the client's artwork (the same asset the favicon is
 * built from, so the tab and the header agree), plus the wordmark as live text.
 *
 * The full logo is not used here on purpose. It is a wide lockup — swoosh,
 * wordmark, tagline and a full-height mascot — and a header row is ~40px tall.
 * At that size the mascot becomes an unreadable smudge and the tagline renders
 * around 3px. Live text also lets the wordmark invert for the dark footer,
 * which the supplied artwork cannot do: its "NAM" is white, so dropping it
 * straight onto the white header would erase half the name.
 *
 * The full lockup does appear at a size where it works — the hero banner.
 */
export function Logo({
  className = "",
  variant = "dark",
}: {
  className?: string;
  /** `light` = for placing on a dark background. */
  variant?: "dark" | "light";
}) {
  const isLight = variant === "light";

  return (
    <span className={`flex items-center gap-2 sm:gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icon-192.png"
        alt=""
        aria-hidden="true"
        width={192}
        height={192}
        className="h-7 w-7 shrink-0 sm:h-8 sm:w-8"
      />

      <span className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-bold uppercase tracking-[-0.01em] sm:text-xl">
          {/* Two colours, matching the artwork: "KRUSH" red, "NAM" solid. */}
          <span className="text-brand-600">Krush</span>
          <span className={isLight ? "text-white" : "text-ink-900"}>nam</span>
        </span>

        <span
          className={`mt-[3px] hidden text-[9px] font-medium uppercase tracking-[0.13em] sm:block ${
            isLight ? "text-ink-400" : "text-ink-500"
          }`}
        >
          Fire Safety &amp; Control
        </span>
      </span>

      <span className="sr-only">{site.name}</span>
    </span>
  );
}
