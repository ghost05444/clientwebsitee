/**
 * The client-supplied hero artwork.
 *
 * Two constraints drive the whole component:
 *
 *  1. The artwork carries its own text — the wordmark, "Protecting what
 *     matters. Everyday." and the four feature labels. So it can never be
 *     cropped (`object-cover` would cut the logo or the labels), and our own
 *     headline can never sit on top of it. Hence `object-contain`, and hence
 *     the page's copy lives in a band below rather than overlaid.
 *
 *  2. `object-contain` letterboxes. A flat fill behind it does not disappear,
 *     because the artwork's edge colour is not uniform down its height — it
 *     shifts from warm brown at the corners to near-black mid-frame, so any
 *     single colour shows a seam somewhere.
 *
 * The fix is a blur-extend: the same image is painted behind itself with
 * `object-cover`, scaled up and heavily blurred. The bars become a soft
 * continuation of the artwork instead of a border around it, at every viewport
 * ratio, with nothing cropped.
 *
 * Portrait and landscape are genuinely different compositions — stacked versus
 * side-by-side — so `<picture>` art-directs between them at the source level
 * and a phone never downloads the desktop file.
 */

const PORTRAIT_SET =
  "/banner/hero-portrait-640.webp 640w, /banner/hero-portrait-900.webp 900w, /banner/hero-portrait-1200.webp 1200w";
const LANDSCAPE_SET =
  "/banner/hero-landscape-1200.webp 1200w, /banner/hero-landscape-1700.webp 1700w, /banner/hero-landscape-2400.webp 2400w";

const ALT =
  "Krushnam Fire — Fire Safety & Control Service. Protecting what matters, everyday. " +
  "Trusted protection, quality equipment, expert support, 24/7 service. Fire extinguisher, " +
  "hydrant, hose reel, smoke detectors, sprinkler and manual call point.";

export function HeroBanner() {
  return (
    <div className="relative isolate">
      {/* Blur-extend fill. Decorative duplicate of the artwork, so it is
          `aria-hidden` and carries an empty alt — a screen reader must not
          hear the banner described twice. */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <picture>
          <source media="(min-width: 768px)" srcSet={LANDSCAPE_SET} sizes="100vw" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner/hero-portrait-640.webp"
            srcSet={PORTRAIT_SET}
            sizes="100vw"
            alt=""
            width={1702}
            height={924}
            loading="eager"
            decoding="async"
            className="h-full w-full scale-125 object-cover blur-2xl saturate-[0.85]"
          />
        </picture>
        {/* Knock the fill back so the sharp artwork stays dominant. */}
        <div className="absolute inset-0 bg-[rgb(24_13_12/0.55)]" />
      </div>

      <picture>
        <source media="(min-width: 768px)" srcSet={LANDSCAPE_SET} sizes="100vw" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/banner/hero-portrait-900.webp"
          srcSet={PORTRAIT_SET}
          sizes="100vw"
          alt={ALT}
          width={1702}
          height={924}
          /* Above the fold and the LCP element — never lazy. */
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="mx-auto block max-h-[62vh] w-full object-contain md:max-h-[52vh]"
        />
      </picture>
    </div>
  );
}
