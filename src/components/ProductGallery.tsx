"use client";

import { useState } from "react";
import type { ProductImage as ProductImageType } from "@/lib/catalog";
import { ProductImage } from "./ProductImage";

/**
 * Product image gallery. Thumbnails are real buttons (not hover targets), so
 * it works identically on touch. Single-image products render without any
 * thumbnail strip.
 */
export function ProductGallery({
  images,
  name,
}: {
  images: ProductImageType[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div>
      {/* Capped by viewport height so the name and enquiry buttons stay
          reachable without scrolling on a phone. */}
      <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white p-4 sm:p-6">
        <div className="mx-auto w-full max-w-[min(100%,38vh)] sm:max-w-[min(100%,52vh)]">
          <ProductImage
            image={current}
            priority
            sizes="(min-width: 1024px) 520px, 80vw"
            fallbackLabel={name}
          />
        </div>
      </div>

      {images.length > 1 && (
        <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1} of ${images.length}`}
                aria-current={i === active}
                className={`block w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white p-1 transition-colors sm:w-20 ${
                  i === active
                    ? "border-brand-600"
                    : "border-ink-200 hover:border-ink-300"
                }`}
              >
                {/* Pre-generated WebP; see ProductImage for why not next/image. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src.replace(/\.webp$/, "-400.webp")}
                  alt=""
                  width={80}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
