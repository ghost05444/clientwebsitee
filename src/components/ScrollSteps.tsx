"use client";

import { useEffect, useRef, useState } from "react";

export type ScrollStep = {
  /** Short kicker above the title, e.g. "Assessment". */
  label: string;
  title: string;
  body: string;
};

/**
 * Two-column scrollytelling.
 *
 * Desktop: the left column sticks while the right column's step blocks
 * scroll past it. An IntersectionObserver with a tight band across the
 * middle of the viewport decides which step is active, and the sticky panel
 * crossfades its number and label to match.
 *
 * Mobile (and any single-column case): the panel is not sticky — each step
 * renders its own number as a static header, so the content reads as a plain
 * ordered list with no motion and no dependency on the observer.
 *
 * The step text is always in the DOM regardless of active state, so this
 * degrades to readable content with JS off.
 */
export function ScrollSteps({
  steps,
  eyebrow,
}: {
  steps: ScrollStep[];
  eyebrow?: string;
}) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean) as HTMLLIElement[];
    if (nodes.length === 0) return;

    // A band across the middle of the viewport: a step becomes active only
    // once it occupies the reader's actual focus area, not when it first
    // pokes in at the bottom.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = nodes.indexOf(entry.target as HTMLLIElement);
          if (index !== -1) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [steps.length]);

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
      {/* ---------------- Sticky panel (lg and up) ---------------- */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="lg:sticky lg:top-32">
          {eyebrow && (
            <p className="eyebrow inline-flex items-center gap-2.5">
              <span className="eyebrow-dash" aria-hidden="true" />
              {eyebrow}
            </p>
          )}

          {/* Fixed height so the crossfade never reflows the column. */}
          <div className="relative mt-4 h-[15rem]">
            {steps.map((step, i) => (
              <div
                key={step.label}
                className={`absolute inset-0 transition-all duration-500 ${
                  i === active
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-3 opacity-0"
                }`}
                aria-hidden={i !== active}
              >
                <span className="text-outline block font-display text-[7rem] font-bold leading-none text-ink-300">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <p className="mt-3 font-display text-2xl font-bold text-ink-900">
                  {step.label}
                </p>
              </div>
            ))}
          </div>

          {/* Progress rail — one bar per step, filled up to the active one. */}
          <ol className="mt-6 flex gap-1.5" aria-hidden="true">
            {steps.map((step, i) => (
              <li
                key={step.label}
                className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                  i <= active ? "bg-brand-600" : "bg-ink-200"
                }`}
              />
            ))}
          </ol>
        </div>
      </div>

      {/* ---------------- Steps ---------------- */}
      <ol className="lg:col-span-7" data-stagger="90">
        {steps.map((step, i) => (
          <li
            key={step.label}
            ref={(node) => {
              stepRefs.current[i] = node;
            }}
            className="reveal border-t border-ink-200 py-8 first:border-t-0 first:pt-0 lg:py-14"
          >
            {/* Mobile header — the sticky panel's job, inlined per step. */}
            <div className="flex items-baseline gap-3 lg:hidden">
              <span className="font-display text-3xl font-bold text-brand-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="eyebrow">{step.label}</span>
            </div>

            <h3 className="mt-3 font-display text-2xl font-bold text-ink-900 sm:text-3xl lg:mt-0">
              {step.title}
            </h3>

            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-600 sm:text-base">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
