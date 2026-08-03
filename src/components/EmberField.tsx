"use client";

import { useEffect, useRef } from "react";

/**
 * Drifting ember particles — the fire-safety identity, rendered on a canvas.
 *
 * Design constraints this respects:
 *  - Decorative only: `aria-hidden`, `pointer-events: none`, never carries
 *    meaning a screen reader would need.
 *  - Silent under `prefers-reduced-motion` — nothing mounts, no RAF loop.
 *  - Pauses when scrolled out of view and when the tab is hidden, so it never
 *    burns battery behind other content.
 *  - Particle count scales with area and is capped, so a 4K monitor doesn't
 *    get thousands of embers.
 *  - Canvas is sized in device pixels but drawn in CSS pixels, so it stays
 *    crisp on retina without the loop doing DPR maths.
 */

type Ember = {
  x: number;
  y: number;
  /** Radius in CSS px. */
  r: number;
  /** Upward speed, px per second. */
  vy: number;
  /** Horizontal drift speed, px per second. */
  vx: number;
  /** Sway phase and rate, so no two embers wobble in step. */
  phase: number;
  sway: number;
  alpha: number;
  hue: number;
};

export function EmberField({
  className = "",
  /** Embers per 100,000 px² of surface. */
  density = 2.2,
  max = 90,
}: {
  className?: string;
  density?: number;
  max?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let embers: Ember[] = [];
    let raf = 0;
    let last = 0;
    let onScreen = true;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    /*
     * Ember sprites, rendered once up front.
     *
     * The obvious implementation builds a `createRadialGradient` per particle
     * per frame. With ~80 embers that is 80 gradient objects and 80 arc fills
     * every frame, and it held the home page at 18fps. Pre-rendering one small
     * canvas per hue bucket turns the loop into plain `drawImage` blits, which
     * the compositor handles almost for free.
     */
    const SPRITE_HUES = [18, 24, 30, 36, 42];
    const SPRITE_PX = 64;

    const sprites = SPRITE_HUES.map((hue) => {
      const s = document.createElement("canvas");
      s.width = SPRITE_PX;
      s.height = SPRITE_PX;
      const sctx = s.getContext("2d");
      if (!sctx) return s;

      const c = SPRITE_PX / 2;
      const g = sctx.createRadialGradient(c, c, 0, c, c, c);
      g.addColorStop(0, `hsl(${hue} 100% 68% / 1)`);
      g.addColorStop(0.35, `hsl(${hue - 6} 96% 52% / 0.5)`);
      g.addColorStop(1, "hsl(20 90% 45% / 0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, SPRITE_PX, SPRITE_PX);
      return s;
    });

    /** Fresh ember, seeded anywhere vertically on first fill. */
    const spawn = (seed = false): Ember => ({
      x: rand(0, width),
      y: seed ? rand(0, height) : height + rand(4, 40),
      r: rand(0.9, 3.1),
      vy: rand(11, 38),
      vx: rand(-5, 5),
      phase: rand(0, Math.PI * 2),
      sway: rand(0.25, 0.9),
      alpha: rand(0.45, 1),
      // Index into the pre-rendered sprites: deep ember red -> hot amber.
      hue: Math.floor(rand(0, sprites.length)),
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      // Draw in CSS pixels from here on.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(max, Math.round((width * height) / 100000 * density));
      embers = Array.from({ length: Math.max(target, 0) }, () => spawn(true));
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!onScreen) {
        last = now;
        return;
      }

      // Seconds since last frame, clamped so a backgrounded tab returning
      // doesn't teleport every ember off the top.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (const e of embers) {
        e.y -= e.vy * dt;
        e.phase += e.sway * dt;
        e.x += (e.vx + Math.sin(e.phase) * 9) * dt;

        // Fade out over the top third of the travel.
        const lifeFade = Math.min(1, e.y / (height * 0.34));
        const a = e.alpha * lifeFade;

        if (e.y < -12 || e.x < -30 || e.x > width + 30) {
          Object.assign(e, spawn());
          continue;
        }

        // Blit the pre-rendered sprite; alpha carries the fade.
        const size = e.r * 8.4;
        ctx.globalAlpha = a;
        ctx.drawImage(sprites[e.hue], e.x - size / 2, e.y - size / 2, size, size);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Only animate while the field is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting && !document.hidden;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      onScreen = !document.hidden && onScreen;
      last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    last = performance.now();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, max]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
