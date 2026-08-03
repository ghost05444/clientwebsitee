"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated number. Server-renders the final value (so no-JS and reduced-motion
 * users see real content immediately), then counts up from zero the first
 * time it scrolls into view. Uses `tabular-nums` via the `.tabular` utility
 * to stop digits wobbling mid-count.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1400,
  className = "",
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();

        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          setDisplay(Math.round(value * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {display}
      {suffix}
    </span>
  );
}
