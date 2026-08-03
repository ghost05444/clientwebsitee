"use client";

import { useEffect } from "react";

/**
 * Motion driver.
 *
 * One client component wires up every ambient interaction on the site:
 *
 *   1. Scroll reveal — anything with `.reveal` fades up once as it enters
 *      the viewport. Children of a `[data-stagger]` container additionally
 *      get a cascade delay (`--rd`), so grids ripple in instead of popping
 *      all at once. `data-stagger="90"` overrides the 70ms step.
 *   2. Spotlight — `.spot` elements get a cursor-following glow by feeding
 *      `--mx` / `--my` to a CSS radial gradient.
 *   3. Tilt — `.tilt` elements rotate subtly toward the cursor.
 *
 * Everything is delegated or observer-based (no per-card React state or
 * listeners), pointer effects only bind on hover-capable devices, and the
 * whole thing bails out under `prefers-reduced-motion` — the CSS already
 * renders those users a fully visible, static page.
 */
export function Reveal() {
  /* ---- 1. Scroll reveal + stagger cascade ------------------------------ */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const scan = () => {
      // Assign cascade delays. Only direct members of a group (not items of
      // a nested group) inherit its step, and the delay is capped so long
      // grids don't leave the tail waiting forever.
      document
        .querySelectorAll<HTMLElement>("[data-stagger]")
        .forEach((group) => {
          const step = Number(group.dataset.stagger) || 70;
          const items = Array.from(
            group.querySelectorAll<HTMLElement>(".reveal"),
          ).filter((el) => el.parentElement?.closest("[data-stagger]") === group);

          items.forEach((el, i) => {
            el.style.setProperty("--rd", `${Math.min(i * step, 560)}ms`);
          });
        });

      document
        .querySelectorAll(".reveal:not(.is-visible)")
        .forEach((el) => observer.observe(el));
    };

    scan();

    // Re-scan after client-side navigation swaps the page content.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);

  /* ---- 2 + 3. Pointer spotlight & tilt --------------------------------- */
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let tilted: HTMLElement | null = null;

    const resetTilt = () => {
      if (!tilted) return;
      tilted.style.setProperty("--rx", "0deg");
      tilted.style.setProperty("--ry", "0deg");
      tilted = null;
    };

    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || typeof target.closest !== "function") return;

      const spot = target.closest<HTMLElement>(".spot");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }

      if (reduce) return;

      const tilt = target.closest<HTMLElement>(".tilt");
      if (tilt !== tilted) resetTilt();
      if (tilt) {
        tilted = tilt;
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty("--rx", `${(-py * 8).toFixed(2)}deg`);
        tilt.style.setProperty("--ry", `${(px * 10).toFixed(2)}deg`);
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", resetTilt);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", resetTilt);
    };
  }, []);

  return null;
}
