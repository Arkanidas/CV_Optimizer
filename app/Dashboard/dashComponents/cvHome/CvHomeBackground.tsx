import CvHomeStars from "./CvHomeStars";

export default function CvHomeBackground() {
  return (
    // BASE COLORS (tweak here)
    // Dark:  #0d0b14, the dashboard's dark page color.
    // Light: #ededed, the dashboard's light page color. For the lavender white
    //        of the reference image, try light:bg-[#f5f2ff]. If you change it,
    //        change the light vignette below and the top strip in
    //        DashboardChrome (light:bg-[#ededed]) to the same color, or a
    //        band shows at the top and the edges.
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#0d0b14] light:bg-[#ededed]"
    >
      {/* Soft glow behind the heading. Light: violet-300 (#c4b5fd) at 40% */}
      <div className="absolute left-1/2 top-[-15%] h-[75%] w-[85%] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[130px] light:bg-violet-300/40" />

      <CvHomeStars />

      {/* DARK: the two thin curves. non-scaling-stroke keeps them the same
          thickness at every window size. */}
      <svg
        className="absolute inset-0 h-full w-full light:hidden"
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

      {/* LIGHT: two big soft bands, like the pale swooshes in the reference.
          Colors: violet-300 (#c4b5fd) and violet-200 (#ddd6fe), fading out.
          Raise a stopOpacity for a stronger band. */}
      <svg
        className="absolute inset-0 hidden h-full w-full light:block"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="cv-band-a" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c4b5fd" stopOpacity="0.55" />
            <stop offset="1" stopColor="#c4b5fd" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cv-band-b" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ddd6fe" stopOpacity="0.7" />
            <stop offset="1" stopColor="#ddd6fe" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 1600 0 L 1600 560 C 1470 400, 1260 270, 1010 205 C 800 150, 610 80, 540 0 Z"
          fill="url(#cv-band-a)"
        />
        <path d="M 0 0 L 560 0 C 470 130, 290 270, 0 340 Z" fill="url(#cv-band-b)" />
      </svg>

      {/* Fades the edges into the base color, so the text and cards stay readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(13,11,20,0.85)_100%)] light:hidden" />
      <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(237,237,237,0.85)_100%)] light:block" />
    </div>
  );
}