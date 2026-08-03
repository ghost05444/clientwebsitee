import type { ProductImage as ProductImageType } from "@/lib/catalog";

/**
 * Product imagery renderer.
 *
 * The build step emits two WebP variants per source image (-400 / -900), so we
 * serve a real srcset and let the browser pick. Every image sits inside a
 * fixed-ratio box with `object-contain`, which guarantees zero layout shift
 * regardless of the source aspect ratio — catalog images here range from
 * square studio shots to wide diagrams.
 */

type Props = {
  image?: ProductImageType | null;
  /** Rendered width hint for the browser's srcset selection. */
  sizes?: string;
  /** Skip lazy-loading for above-the-fold imagery (LCP). */
  priority?: boolean;
  className?: string;
  /** Falls back to this when the product has no image. */
  fallbackLabel?: string;
};

const variant = (src: string, size: "400" | "900") =>
  src.replace(/\.webp$/, `-${size}.webp`);

export function ProductImage({
  image,
  sizes = "(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 45vw",
  priority = false,
  className = "",
  fallbackLabel,
}: Props) {
  if (!image) {
    return (
      <div
        className={`flex aspect-square w-full items-center justify-center bg-ink-100 ${className}`}
        role="img"
        aria-label={fallbackLabel ? `${fallbackLabel} — image not available` : "Image not available"}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-10 w-10 text-ink-300"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 9h.008v.008H18V9zm2.25 9a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 18V6A2.25 2.25 0 014.5 3.75h13.5A2.25 2.25 0 0120.25 6v12z"
          />
        </svg>
      </div>
    );
  }

  return (
    /* Deliberately a plain <img>, not next/image. The build pre-generates both
       WebP variants, so there is nothing left for the Next optimizer to do —
       and on a static export it would run `unoptimized` anyway, which emits a
       single-source <img> with no srcset. This gives real responsive loading
       with zero runtime cost. */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={variant(image.src, "400")}
      srcSet={`${variant(image.src, "400")} 400w, ${variant(image.src, "900")} 900w`}
      sizes={sizes}
      alt={image.alt}
      width={900}
      height={900}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={`aspect-square w-full object-contain ${className}`}
    />
  );
}
