import { site } from "@/lib/site";

/**
 * Full-bleed kinetic band.
 *
 * Two rows of oversized outlined type running in opposite directions, on top
 * of the existing `.marquee-track` loop. The whole band skews slightly into
 * the scroll direction via `--scroll-velocity`, which the motion driver
 * publishes on `<html>`.
 *
 * A server component — the animation is pure CSS and the lean is a CSS
 * variable, so nothing here needs to ship JavaScript. With the driver absent
 * (no JS) or under reduced motion the variable rests at 0 and the band is
 * simply static text.
 */
export function KineticMarquee({
  phrases = ["Certified PPE", "Fire Safety", "Fall Protection", "Confined Space"],
  tone = "dark",
}: {
  phrases?: string[];
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";

  return (
    /* Two elements on purpose. `.kinetic-band` skews with scroll velocity, and
       an element's own `overflow: hidden` clips its children but not its own
       transformed box — the skewed corners still widened the document by a
       pixel mid-scroll. The outer wrapper does the clipping; the inner one
       does the skewing. */
    <section
      className={`relative overflow-x-clip ${dark ? "bg-ink-950" : "warm-wash"}`}
      aria-label={`${site.name} — what we supply`}
    >
      <div className="kinetic-band py-10 sm:py-14">
        <MarqueeRow phrases={phrases} dark={dark} duration="52s" />
        <MarqueeRow
          phrases={[...phrases].reverse()}
          dark={dark}
          duration="64s"
          reverse
        />
      </div>
    </section>
  );
}

function MarqueeRow({
  phrases,
  dark,
  duration,
  reverse = false,
}: {
  phrases: string[];
  dark: boolean;
  duration: string;
  reverse?: boolean;
}) {
  return (
    <div className="marquee-mask">
      <div
        className={`marquee-track ${reverse ? "reverse" : ""}`}
        style={{ "--mq": duration } as React.CSSProperties}
      >
        {/* Four identical groups: the track loops at -50%, so each half has to
            be pixel-identical and wide enough for an ultrawide viewport. */}
        {[0, 1, 2, 3].map((dup) => (
          <p
            key={dup}
            // Only the first copy is announced; the rest are visual padding.
            aria-hidden={dup > 0}
            className={`text-mega text-outline whitespace-nowrap font-bold ${
              dark ? "text-ink-700" : "text-ink-300"
            }`}
          >
            {phrases.map((phrase) => (
              <span key={phrase} className="pr-8">
                {phrase}
                <span className="text-brand-600" aria-hidden="true">
                  {" "}
                  •
                </span>
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
