import CvHomeStars from "./CvHomeStars";

interface CvHomeBackgroundProps {
  // The two thin curves in dark mode. They fade in and out, so switching
  // steps doesn't make them pop.
  showDarkLines?: boolean;
  // For pages that scroll or change height. The background is then exactly as
  // tall as the screen and stays in place, so nothing in it moves when the
  // content grows or shrinks. It must be the FIRST child of the page wrapper,
  // and that wrapper needs no padding of its own.
  // false (the default): the background fills the page wrapper and is as tall
  // as the content.
  pinned?: boolean;
}

export default function CvHomeBackground({ showDarkLines = true, pinned = false }: CvHomeBackgroundProps) {
  return (
    // BASE COLORS (tweak here)
    // Dark:  #0d0b14, the dashboard's dark page color.
    // Light: #ededed, the dashboard's light page color. If you change it,
    //        change the light vignette below and the top strip in
    //        DashboardChrome (light:bg-[#ededed]) to the same color, or a
    //        band shows at the top and the edges.
    // Pinned: sticky + top-0 keeps it at the top of the scrolling area, h-dvh
    // gives it the height of the screen, and -mb-[100dvh] cancels that height
    // again, so it takes no space and the content starts at the top.
    <div
      aria-hidden
      className={`pointer-events-none overflow-hidden bg-[#0d0b14] light:bg-[#ededed] ${
        pinned ? "sticky -mb-[100dvh] h-dvh w-full" : "absolute inset-0"
      }`}
    >
      {/* Soft glow behind the heading. Light: violet-300 (#c4b5fd) at 40% */}
      <div className="absolute left-1/2 top-[-15%] h-[75%] w-[85%] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[130px] light:bg-violet-300/40" />

      <CvHomeStars />

      {/* DARK: the two thin curves. non-scaling-stroke keeps them the same
          thickness at every window size. */}
      <svg
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 light:hidden ${
          showDarkLines ? "opacity-100" : "opacity-0"
        }`}
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

      {/* LIGHT: two big soft bands, one on each side.
          Colors: violet-300 (#c4b5fd) for the right band, violet-200
          (#ddd6fe) for the left one, both fading out. Raise a stopOpacity for
          a stronger band.
          To reshape the left band, change the numbers in its path. It starts
          at the top left corner, runs down the left edge to y=640, and sweeps
          back up to the top at x=470. Keep that last x below about 540, or it
          starts to overlap the right band. */}
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
          <linearGradient id="cv-band-b" x1="0" y1="0" x2="1" y2="0.9">
            <stop offset="0" stopColor="#ddd6fe" stopOpacity="0.8" />
            <stop offset="1" stopColor="#ddd6fe" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Right band */}
        <path
          d="M 1600 0 L 1600 560 C 1470 400, 1260 270, 1010 205 C 800 150, 610 80, 540 0 Z"
          fill="url(#cv-band-a)"
        />
        {/* Left band */}
        <path
          d="M 0 0 L 0 640 C 120 480, 300 350, 520 270 C 600 240, 520 90, 470 0 Z"
          fill="url(#cv-band-b)"
        />
      </svg>

      {/* Fades the edges into the base color, so the text and cards stay readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(13,11,20,0.85)_100%)] light:hidden" />
      <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(237,237,237,0.85)_100%)] light:block" />
    </div>
  );
}