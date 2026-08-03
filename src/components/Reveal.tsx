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
 *   4. Parallax — `[data-parallax]` elements drift vertically against the
 *      scroll, and the same listener publishes `--scroll-velocity`.
 *   5. Word cascade — `[data-words]` splits its text into per-word spans
 *      that reveal in sequence.
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

    /**
     * Split `[data-words]` text into per-word spans.
     *
     * Only runs on elements whose content is a single text node — anything
     * with nested markup is left alone rather than having its structure
     * flattened, and `data-split` marks the element so a re-scan (which
     * fires on every DOM mutation) never splits the same text twice.
     */
    const splitWords = () => {
      document
        .querySelectorAll<HTMLElement>("[data-words]:not([data-split])")
        .forEach((el) => {
          const text = el.textContent ?? "";
          if (el.childNodes.length !== 1 || el.firstChild?.nodeType !== Node.TEXT_NODE) {
            el.dataset.split = "skipped";
            return;
          }

          const words = text.split(/\s+/).filter(Boolean);
          el.textContent = "";

          words.forEach((word, i) => {
            const span = document.createElement("span");
            span.className = "w";
            span.textContent = word;
            span.style.setProperty("--rd", `${Math.min(i * 34, 700)}ms`);
            el.append(span);
            // Real space between spans, so the text still wraps and is still
            // selectable and readable to assistive tech as one sentence.
            if (i < words.length - 1) el.append(document.createTextNode(" "));
          });

          el.dataset.split = "true";
        });
    };

    const scan = () => {
      splitWords();

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
        .querySelectorAll(".reveal:not(.is-visible), [data-words]:not(.is-visible)")
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

  /* ---- 4. Parallax + scroll velocity ----------------------------------- */
  useEffect(() => {
    // Parallax is decoration that costs a transform every frame. Touch
    // platforms scroll on the compositor and reduced-motion users opted out,
    // so neither gets the listener at all.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    type Target = {
      el: HTMLElement;
      /** Positive drifts slower than the page, negative counter-scrolls. */
      factor: number;
      /** Optional cap on travel, in px. */
      clamp: number;
      /** Document-space centre, measured with the transform cleared. */
      centre: number;
      height: number;
    };

    const root = document.documentElement;
    let targets: Target[] = [];
    let needsMeasure = true;
    let raf = 0;
    let lastY = window.scrollY;
    let velocity = 0;

    const collect = () => {
      targets = Array.from(
        document.querySelectorAll<HTMLElement>("[data-parallax]"),
      ).map((el) => ({
        el,
        factor: Number(el.dataset.parallax) || 0,
        clamp: Number(el.dataset.parallaxClamp) || Infinity,
        centre: 0,
        height: 0,
      }));
      needsMeasure = true;
    };

    /**
     * Measuring a translated element would fold the current offset back into
     * the next one, so transforms are cleared first and every read happens in
     * one batch — one forced reflow per measure, not one per element.
     */
    const measure = () => {
      for (const t of targets) t.el.style.transform = "";
      const scrollY = window.scrollY;
      for (const t of targets) {
        const r = t.el.getBoundingClientRect();
        t.centre = r.top + scrollY + r.height / 2;
        t.height = r.height;
      }
      needsMeasure = false;
    };

    const frame = () => {
      raf = 0;
      if (needsMeasure) measure();

      const scrollY = window.scrollY;
      const viewport = window.innerHeight;
      const viewportCentre = scrollY + viewport / 2;

      // Velocity eases toward the current per-frame delta, then back to rest,
      // so the value never snaps and settles cleanly at zero.
      const delta = scrollY - lastY;
      lastY = scrollY;
      velocity += (delta - velocity) * 0.25;
      if (Math.abs(velocity) < 0.05) velocity = 0;
      root.style.setProperty(
        "--scroll-velocity",
        Math.max(-1, Math.min(1, velocity / 40)).toFixed(3),
      );

      for (const t of targets) {
        const offset = t.centre - viewportCentre;
        // Skip anything comfortably off-screen — long pages keep the per-frame
        // work proportional to what is actually visible.
        if (Math.abs(offset) > viewport * 1.5 + t.height / 2) continue;
        const shift = Math.max(
          -t.clamp,
          Math.min(t.clamp, offset * t.factor),
        );
        t.el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
      }

      // Keep ticking while velocity decays so the value reaches rest even
      // after the last scroll event.
      if (velocity !== 0) raf = requestAnimationFrame(frame);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      needsMeasure = true;
      schedule();
    };

    collect();
    schedule();

    // Client-side navigation swaps the targets out from under us.
    const mo = new MutationObserver(() => {
      collect();
      schedule();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      mo.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      for (const t of targets) t.el.style.transform = "";
      root.style.removeProperty("--scroll-velocity");
    };
  }, []);

  return null;
}
