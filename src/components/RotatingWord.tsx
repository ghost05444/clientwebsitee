"use client";

import { useEffect, useState } from "react";

/**
 * Vertically flipping word in the hero headline.
 *
 * Server-renders `resting` — the word the line is really about — and only
 * starts cycling once mounted and motion is allowed. Under reduced motion it
 * never advances, so the sentence a reduced-motion user sees is the same one
 * that ships in the HTML.
 *
 * Layout stability: an invisible copy of the longest word sits in the normal
 * flow to size the element, and every visible word is stacked on top of it in
 * the same grid cell. The headline therefore never reflows as the word
 * changes — which matters because this sits inside an H1 that is also
 * running the hero entrance animation.
 */
export function RotatingWord({
  words,
  resting,
  interval = 2400,
}: {
  words: string[];
  /** Shown on the server and held under reduced motion. Defaults to first. */
  resting?: string;
  interval?: number;
}) {
  const restIndex = Math.max(0, resting ? words.indexOf(resting) : 0);
  const [index, setIndex] = useState(restIndex);

  useEffect(() => {
    if (words.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      {/* Width setter — in flow, never painted, never announced. */}
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>

      {words.map((word, i) => {
        // Position each word by where it sits in the cycle relative to the
        // active one: the word just shown exits upward, everything still to
        // come waits below. Without this the outgoing and incoming words
        // would travel the same way and it reads as a jump, not a flip.
        const offset = (i - index + words.length) % words.length;
        const position =
          offset === 0
            ? "translate-y-0 opacity-100"
            : offset === words.length - 1
              ? "pointer-events-none -translate-y-full opacity-0"
              : "pointer-events-none translate-y-full opacity-0";

        return (
          <span
            key={word}
            className={`col-start-1 row-start-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${position}`}
            // Only the live word is exposed; the rest would otherwise be read
            // out as a run-on list.
            aria-hidden={offset !== 0}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}
