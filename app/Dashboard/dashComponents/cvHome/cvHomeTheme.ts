// The animated purple word. Light mode uses deeper violets so it stays
// readable: violet-700, violet-400, violet-700.
export const GRADIENT_DARK = ["#8b5cf6", "#c084fc", "#8b5cf6"];
export const GRADIENT_LIGHT = ["#6d28d9", "#a78bfa", "#6d28d9"];

// Thin lines beside the subtitle and the footer line. They fade out toward
// the outer end. Light: stone-500 at 35%.
export const LINE_LEFT =
  "bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.2))] light:bg-[linear-gradient(to_right,transparent,rgba(120,113,108,0.35))]";
export const LINE_RIGHT =
  "bg-[linear-gradient(to_left,transparent,rgba(255,255,255,0.2))] light:bg-[linear-gradient(to_left,transparent,rgba(120,113,108,0.35))]";