"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll.
 *
 * Lenis interpolates the real scroll position (it calls `scrollTo` under the
 * hood rather than transforming a wrapper), so `position: sticky`, every
 * IntersectionObserver on the site and the header's scroll listener all keep
 * working untouched.
 *
 * Deliberately inert in two cases:
 *
 *   - `prefers-reduced-motion: reduce` — smoothing is motion the user asked
 *     not to have.
 *   - `(pointer: coarse)` — touch platforms already have momentum scrolling
 *     tuned to the device, and hijacking it costs more than it adds.
 *
 * In both cases nothing is instantiated and the browser's native scroll is
 * left completely alone.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduce.matches || coarse.matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      // Lenis intercepts same-page hash links itself; without this the browser
      // would jump natively while Lenis kept animating from the old position.
      anchors: true,
    });

    let raf = requestAnimationFrame(function frame(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
