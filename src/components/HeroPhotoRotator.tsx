"use client";

import { useEffect, useState } from "react";

/**
 * Cross-fading hero photography.
 *
 * All frames are rendered and stacked; only opacity changes, so a transition is
 * a compositor-only crossfade with no layout or decode cost at swap time. Each
 * frame carries its own Ken Burns drift, and the drift restarts with the frame
 * because the animation is keyed off the active index.
 *
 * Under `prefers-reduced-motion` the rotation never starts — the first frame is
 * simply shown, which is also exactly what renders before hydration, so there
 * is no flash either way.
 *
 * The scrim lives in the parent (PhotoBackdrop) rather than here, so text
 * contrast is constant across the rotation instead of shifting per photo.
 */

export type HeroFrame = {
  /** Basename in /public/photo (no -800/-1600/-2400 suffix). */
  name: string;
  /** object-position for this frame's crop. */
  position?: string;
};

export function HeroPhotoRotator({
  frames,
  intervalMs = 7000,
}: {
  frames: HeroFrame[];
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (frames.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setInterval>;

    const start = () => {
      timer = setInterval(() => {
        // Skip advancing while the tab is hidden — otherwise returning to the
        // tab shows a jump rather than a fade.
        if (document.hidden) return;
        setActive((i) => (i + 1) % frames.length);
      }, intervalMs);
    };

    start();
    return () => clearInterval(timer);
  }, [frames.length, intervalMs]);

  const src = (name: string, w: 800 | 1600 | 2400) => `/photo/${name}-${w}.webp`;

  return (
    <>
      {frames.map((frame, i) => (
        <img
          // Keying on the active index restarts the Ken Burns animation when a
          // frame becomes active, so every frame gets the full drift.
          key={`${frame.name}-${i === active}`}
          // eslint-disable-next-line @next/next/no-img-element
          src={src(frame.name, 1600)}
          srcSet={`${src(frame.name, 800)} 800w, ${src(frame.name, 1600)} 1600w, ${src(frame.name, 2400)} 2400w`}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          width={2400}
          height={1600}
          /* Only the first frame blocks paint; the rest load lazily behind it. */
          loading={i === 0 ? "eager" : "lazy"}
          decoding={i === 0 ? "sync" : "async"}
          fetchPriority={i === 0 ? "high" : "low"}
          className={`ken-burns absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition: frame.position ?? "center" }}
        />
      ))}
    </>
  );
}
