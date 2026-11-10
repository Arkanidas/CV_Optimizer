"use client";

import Galaxy from "@/src/component/Galaxy";

// ============================================================
// BACKGROUND (TWEAK ZONE)
// ============================================================
// Galaxy settings. hueShift is the star color, in degrees around the color
// wheel (0-360). Around 260-300 is purple to magenta, so try a few values.
const GALAXY = {
  hueShift: 270,
  saturation: 0.5, // 0 = gray stars, 1 = strongly colored
  density: 0.8, // number of stars. Lower = calmer and lighter on the GPU
  glowIntensity: 0.25,
  twinkleIntensity: 0.35,
};

export default function CvHomeBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[#0d0b14]">
      {/* Soft purple glow behind the heading */}
      <div className="absolute left-1/2 top-[-15%] h-[75%] w-[85%] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[130px]" />

      {/* The stars. Galaxy fills its parent, and its background is transparent
          so the colors above show through. */}
      <div className="absolute inset-0">
        <Galaxy
          hueShift={GALAXY.hueShift}
          saturation={GALAXY.saturation}
          density={GALAXY.density}
          glowIntensity={GALAXY.glowIntensity}
          twinkleIntensity={GALAXY.twinkleIntensity}
          mouseRepulsion={false}
          transparent
        />
      </div>

      {/* The two big curved lines from the reference image. non-scaling-stroke
          keeps the lines the same thickness at every window size. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="cv-swoosh" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="0.5" stopColor="#8b5cf6" stopOpacity="0.45" />
            <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M -40 560 C 180 330, 430 150, 780 60 S 1040 8, 1120 0"
          stroke="url(#cv-swoosh)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 1640 430 C 1500 260, 1330 130, 1180 70"
          stroke="url(#cv-swoosh)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Darkens the edges, so the text and cards always stay readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(13,11,20,0.85)_100%)]" />
    </div>
  );
}