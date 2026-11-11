import type { CSSProperties } from "react";

// ============================================================
// STARS (TWEAK ZONE)
// ============================================================
const STAR_COUNT = 110; // more = denser
const STAR_SIZE = { min: 1, max: 2.6 }; // px
// Opacity 0 to 1. Each star pulses between a faint and a bright value.
const FAINT = { min: 0.08, max: 0.23 };
const BRIGHT = { min: 0.35, max: 0.8 };
const TWINKLE_SHARE = 0.65; // share of the stars that pulse, the rest stay still
const TWINKLE_SECONDS = { min: 3, max: 9 }; // time for one pulse
const SEED = 20261108; // change it for another arrangement

// The few four-point sparkles. x and y are percent of the page, size is px.
const SPARKLES = [
  { x: 54, y: 14, size: 18 },
  { x: 66, y: 8, size: 12 },
  { x: 75, y: 24, size: 22 },
  { x: 20, y: 26, size: 10 },
  { x: 24, y: 11, size: 8 },
  { x: 86, y: 40, size: 12 },
  { x: 46, y: 30, size: 12 },
  { x: 6, y: 40, size: 13 },
];
const SPARKLE_PATH =
  "M12 0 C12.6 7.4 16.6 11.4 24 12 C16.6 12.6 12.6 16.6 12 24 C11.4 16.6 7.4 12.6 0 12 C7.4 11.4 11.4 7.4 12 0 Z";

// A small seeded random generator. The stars are made once, when the file
// loads, and the same seed always gives the same stars. That keeps the server
// and the browser in agreement, so React reports no hydration mismatch.
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(SEED);
const between = (min: number, max: number) => min + rand() * (max - min);
const round = (n: number, digits = 2) => Math.round(n * 10 ** digits) / 10 ** digits;

const STARS = Array.from({ length: STAR_COUNT }, () => {
  const faint = between(FAINT.min, FAINT.max);
  const bright = between(BRIGHT.min, BRIGHT.max);
  return {
    x: round(rand() * 100),
    y: round(rand() * 100),
    size: round(between(STAR_SIZE.min, STAR_SIZE.max)),
    faint: round(faint),
    bright: round(bright),
    rest: round((faint + bright) / 2), // the opacity of a star that doesn't pulse
    twinkles: rand() < TWINKLE_SHARE,
    seconds: round(between(TWINKLE_SECONDS.min, TWINKLE_SECONDS.max), 1),
    // A negative delay starts each star somewhere inside its cycle, so they
    // don't all pulse in sync
    delay: round(-rand() * TWINKLE_SECONDS.max, 1),
  };
});

const TWINKLE_CSS = `
  @keyframes cv-star-twinkle {
    0%, 100% { opacity: var(--star-faint); }
    50% { opacity: var(--star-bright); }
  }
  .cv-star-twinkle {
    animation: cv-star-twinkle var(--star-seconds) ease-in-out var(--star-delay) infinite;
  }
  /* With reduced motion the stars stay put, still visible */
  @media (prefers-reduced-motion: reduce) {
    .cv-star-twinkle { animation: none; }
  }
`;

export default function CvHomeStars() {
  return (
    <div className="absolute inset-0">
      <style>{TWINKLE_CSS}</style>

      {/* Dots: white in dark mode, violet in light mode */}
      {STARS.map((star, i) => (
        <span
          key={i}
          className={`absolute rounded-full bg-white light:bg-violet-500 ${
            star.size > 2 ? "shadow-[0_0_5px_rgba(255,255,255,0.6)] light:shadow-none" : ""
          } ${star.twinkles ? "cv-star-twinkle" : ""}`}
          style={
            {
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.rest,
              "--star-faint": star.faint,
              "--star-bright": star.bright,
              "--star-seconds": `${star.seconds}s`,
              "--star-delay": `${star.delay}s`,
            } as CSSProperties
          }
        />
      ))}

      {SPARKLES.map((sparkle, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="cv-star-twinkle absolute -translate-x-1/2 -translate-y-1/2 fill-violet-300 drop-shadow-[0_0_6px_rgba(167,139,250,0.7)] light:fill-violet-500 light:drop-shadow-none"
          style={
            {
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: sparkle.size,
              height: sparkle.size,
              opacity: 0.65,
              "--star-faint": 0.3,
              "--star-bright": 0.9,
              "--star-seconds": `${4 + i}s`,
              "--star-delay": `${-i * 1.3}s`,
            } as CSSProperties
          }
        >
          <path d={SPARKLE_PATH} />
        </svg>
      ))}
    </div>
  );
}