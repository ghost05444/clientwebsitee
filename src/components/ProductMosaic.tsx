/**
 * Ambient backdrop built from the client's own product photography.
 *
 * Stock imagery for this trade is either licence-encumbered or off-brand
 * (a Belgian fire engine does not belong on a Gujarati PPE supplier's site).
 * The catalogue already ships ~1900 owned, optimised product shots, so the
 * backdrop is assembled from those: unambiguously on-domain, no licensing
 * questions.
 *
 * The blur is baked in at build time by `scripts/build-mosaics.mjs`, not
 * applied here. An earlier version rendered a live grid of ~28 <img> under
 * `filter: blur(30px)`; the compositor then re-blurred that full-viewport
 * stack on every scroll frame and the home page ran at 4fps. As a single flat
 * texture it is one ordinary layer at ~55KB, and costs nothing to scroll.
 */

export type MosaicVariant = "hero" | "dark" | "light";

export function ProductMosaic({
  variant = "dark",
  className = "",
  opacity = 0.14,
}: {
  variant?: MosaicVariant;
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        maskImage:
          "radial-gradient(ellipse 95% 85% at 50% 45%, black 10%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 95% 85% at 50% 45%, black 10%, transparent 80%)",
      }}
    >
      <img
        // eslint-disable-next-line @next/next/no-img-element
        src={`/bg/mosaic-${variant}.webp`}
        alt=""
        width={1280}
        height={800}
        loading="lazy"
        decoding="async"
        data-parallax="0.05"
        className="h-full w-full object-cover"
        style={{ opacity }}
      />
    </div>
  );
}
