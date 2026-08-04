import { HeroPhotoRotator, type HeroFrame } from "./HeroPhotoRotator";
/**
 * Full-bleed photographic backdrop with a legibility scrim.
 *
 * The scrim is the point. A photo behind body copy fails WCAG the moment the
 * subject moves, so text never sits directly on the image — a dark gradient is
 * laid over it, weighted to the side the copy occupies, and every foreground
 * colour is chosen against the scrim rather than the photo.
 *
 * Decorative: `aria-hidden`, empty alt, no pointer events. The image carries no
 * information the copy does not already state.
 */

type Props = {
  /** Basename in /public/photo (without the -800/-1600/-2400 suffix). */
  name?: string;
  /** Cross-fading frames. Takes precedence over `name` when supplied. */
  frames?: HeroFrame[];
  /** Which side the copy sits on; the scrim is heaviest there. */
  focus?: "left" | "center";
  /** Object-position, for steering the crop at narrow widths. */
  position?: string;
  className?: string;
  /** Above-the-fold backdrops should not lazy-load. */
  priority?: boolean;
};

export function PhotoBackdrop({
  name,
  frames,
  focus = "left",
  position = "center",
  className = "",
  priority = false,
}: Props) {
  const src = (w: 800 | 1600 | 2400) => `/photo/${name}-${w}.webp`;

  return (
    <div
      data-parallax="0.08"
      className={`light-sweep pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {frames?.length ? (
        <HeroPhotoRotator frames={frames} />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src(1600)}
          srcSet={`${src(800)} 800w, ${src(1600)} 1600w, ${src(2400)} 2400w`}
          sizes="100vw"
          alt=""
          width={2400}
          height={1600}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          /* Ken Burns runs on every device, including touch where the
             scroll-linked parallax is skipped. The two compose: parallax
             translates the wrapper, this scales and pans the image. */
          className="ken-burns h-full w-full object-cover"
          style={{ objectPosition: position }}
        />
      )}

      {/* Scrim 1 — protects the copy. Direction is viewport-dependent; see
          `.scrim-left` in globals.css. */}
      <div className={`absolute inset-0 ${focus === "left" ? "scrim-left" : "scrim-center"}`} />

      {/* Scrim 2 — grounds the bottom edge so the section can hand off to the
          next one without a hard seam. */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: "linear-gradient(to top, rgb(8 11 15 / 0.9), transparent)",
        }}
      />
    </div>
  );
}
