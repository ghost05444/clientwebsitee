import { site } from "@/lib/site";

/**
 * Hero banner: a text-free scene render with the brand type composed over it.
 *
 * The scenes reserve a deliberate empty zone — the top on the portrait render,
 * the left on the landscape one — and every piece of copy is real HTML placed
 * into it. Nothing is baked into the artwork, so the type stays sharp at any
 * size, reflows, is readable by crawlers and screen readers, and can be
 * corrected without regenerating an image.
 *
 * ── Sizing: container query units, not viewport units ────────────────────
 * The type has to stay inside the artwork's empty zone at every width. Sizing
 * it in `vw` does not achieve that: the frame's height changes with the
 * breakpoint (its aspect ratio is 1:1.58 on phones, 16:9 at md, 2.67:1 at lg),
 * so a block sized against viewport width overflowed — measured at 111% of the
 * frame at 1024px, with the feature row hanging out of the bottom edge.
 *
 * `cqh` fixes it at the root: the frame declares `container-type: size` and
 * every element inside is a percentage of the *frame's own height*. The type
 * then occupies the same proportion of the artwork whatever shape the frame
 * is. The proportions differ between portrait and landscape only because the
 * empty zones themselves do — the portrait render reserves roughly the top
 * 45%, the landscape one reserves a full-height column on the left.
 */

const SCENE_LANDSCAPE =
  "/banner/scene-landscape-1280.webp 1280w, /banner/scene-landscape-1920.webp 1920w, /banner/scene-landscape-2560.webp 2560w";
const SCENE_PORTRAIT =
  "/banner/scene-portrait-640.webp 640w, /banner/scene-portrait-900.webp 900w, /banner/scene-portrait-1200.webp 1200w";

/** Trust markers, matching the client's original artwork. */
const FEATURES = [
  {
    label: ["Trusted", "Protection"],
    path: "M12 3l7 3v5.2c0 4.3-2.9 8.3-7 9.6-4.1-1.3-7-5.3-7-9.6V6l7-3z M9.2 12.1l2 2 3.6-3.9",
  },
  {
    label: ["Quality", "Equipment"],
    path: "M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1v.2a2 2 0 11-4 0v-.1a1.6 1.6 0 00-2.8-1.1l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.6 1.6 0 003.6 15a2 2 0 110-4h.1a1.6 1.6 0 001.1-2.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3h.1A1.6 1.6 0 0010.5 4v-.2a2 2 0 114 0v.1a1.6 1.6 0 002.7 1.1l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8v.1a1.6 1.6 0 001.5 1h.2a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z",
  },
  {
    label: ["Expert", "Support"],
    path: "M4 13a8 8 0 0116 0v4a3 3 0 01-3 3h-1 M4 13v3a3 3 0 003 3h1v-6H6a2 2 0 00-2 2z M20 13v3h-2v-6h.5a1.5 1.5 0 011.5 1.5z",
  },
  {
    label: ["24/7", "Service"],
    path: "M12 7v5l3.2 1.9 M20.5 12a8.5 8.5 0 11-2.6-6.1 M20.5 4v4h-4",
  },
];

export function HeroBanner() {
  return (
    <div className="relative isolate">
      {/*
        Three aspect ratios. The landscape render is 2.67:1, but at 768px that
        frame is only 288px tall and the type will not fit — so the md band
        gets a taller box and lets `object-cover` trim the sides instead, which
        costs nothing because the scene is deliberately empty at both edges.

        `container-type: size` is what makes the cqh units resolve.
      */}
      <div
        className="relative aspect-[100/158] w-full overflow-hidden md:aspect-[16/9] lg:aspect-[2048/768]"
        style={{ containerType: "size" }}
      >
        {/* `<picture>` art-directs between two genuinely different
            compositions rather than reflowing one, so a phone never downloads
            the 2560px landscape file. */}
        <picture>
          <source media="(min-width: 768px)" srcSet={SCENE_LANDSCAPE} sizes="100vw" />
          <img
            src="/banner/scene-portrait-900.webp"
            srcSet={SCENE_PORTRAIT}
            sizes="100vw"
            alt=""
            aria-hidden="true"
            width={2048}
            height={768}
            /* LCP element — never lazy. */
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            /* Bottom-anchored on phones so the frame's extra height becomes
               clear sky above the equipment, not empty floor below it. */
            className="absolute inset-0 h-full w-full object-cover object-bottom md:object-center"
          />
        </picture>

        {/* Scrim over the reserved zone only. The scene is already near-black
            there; this guarantees the contrast floor if the render changes.
            Vertical on phones, horizontal on desktop — matching where the
            empty space actually is. */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[rgb(6_4_4/0.8)] via-[rgb(6_4_4/0.3)] to-transparent md:bg-gradient-to-r md:from-[rgb(6_4_4/0.85)] md:via-[rgb(6_4_4/0.35)] md:to-transparent"
          aria-hidden="true"
        />

        {/* --- Type, composed into the reserved zone ---------------------- */}
        <div className="absolute inset-0">
          <div className="container-page flex h-full flex-col justify-start pt-[4cqh] md:justify-center md:pt-0">
            <div className="w-full md:max-w-[35%]">
              {/* The wordmark is genuinely graphical — custom lettering, swoosh
                  and mascot — so it stays an image. Transparency is baked into
                  the PNG at build time (luminance -> alpha) rather than done
                  here with `mix-blend-mode`: this element also carries an
                  entrance animation, and `opacity` creates a stacking context
                  that isolates the blend. `alt` carries the brand name, since
                  the lettering is pixels. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/banner/logo-lockup-700.png"
                srcSet="/banner/logo-lockup-420.png 420w, /banner/logo-lockup-700.png 700w"
                sizes="(min-width: 768px) 34vw, 70vw"
                alt={`${site.name} — Fire Safety & Control Service`}
                width={706}
                height={330}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                className="hero-fade block h-[11.5cqh] w-auto md:h-[24cqh]"
                style={{ ["--hd" as string]: "0ms" }}
              />

              <h2
                className="hero-fade mt-[1.6cqh] font-display text-[4.6cqh] font-bold uppercase leading-[1.02] tracking-[-0.01em] text-white md:mt-[3cqh] md:text-[11cqh]"
                style={{ ["--hd" as string]: "120ms" }}
              >
                Protecting
                <br />
                what <span className="text-brand-500">matters.</span>
                <br />
                Everyday.
              </h2>

              {/* Real text, so the labels reflow and stay legible at any width.
                  In the original artwork they were baked in at a size that
                  became unreadable once the image scaled down. */}
              <ul
                className="hero-fade mt-[2cqh] grid max-w-[92%] grid-cols-4 gap-[2%] md:mt-[4cqh]"
                style={{ ["--hd" as string]: "260ms" }}
              >
                {FEATURES.map((feature) => (
                  <li
                    key={feature.label.join(" ")}
                    className="flex flex-col items-center text-center"
                  >
                    <span className="flex items-center justify-center rounded-full border border-brand-600/70 bg-[rgb(8_5_5/0.55)] p-[1.1cqh] shadow-[0_0_14px_-2px_rgb(220_31_31/0.65)] md:p-[2cqh]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[2.1cqh] w-[2.1cqh] text-brand-500 md:h-[4cqh] md:w-[4cqh]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d={feature.path} />
                      </svg>
                    </span>

                    <span className="mt-[1cqh] font-display text-[1.35cqh] font-semibold uppercase leading-[1.2] tracking-[0.05em] text-white drop-shadow-[0_1px_6px_rgb(0_0_0/0.9)] md:text-[2.4cqh]">
                      {feature.label[0]}
                      <br />
                      {feature.label[1]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
