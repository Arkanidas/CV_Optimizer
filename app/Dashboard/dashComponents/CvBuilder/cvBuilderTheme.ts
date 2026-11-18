// ============================================================
// SHARED COLORS FOR THE CV BUILDER (TWEAK ZONE)
// ============================================================
// Dark values first, then the light: version. A hover: class beats a light:
// class, so every hover has its own light:hover: version.

// The big glass cards. Light: white at 85% with a stone-300 border.
export const CARD =
  "border-white/10 bg-white/[0.04] backdrop-blur-md light:border-stone-300 light:bg-white/85 light:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)]";

// Inputs. Light: white with a stone-300 border, violet-500 when focused.
export const INPUT_BASE =
  "w-full rounded-xl border py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 light:text-stone-900 light:placeholder:text-stone-400";
export const INPUT_OK =
  "border-white/10 bg-white/[0.04] focus:border-violet-400/60 focus:ring-violet-400/40 light:border-stone-300 light:bg-white light:focus:border-violet-500 light:focus:ring-violet-500/30";
export const INPUT_ERROR =
  "border-red-500/60 bg-white/[0.04] focus:border-red-500 focus:ring-red-500/30 light:border-red-400 light:bg-white";

// Field labels. Light: stone-900.
export const LABEL = "text-sm font-semibold text-white light:text-stone-900";

// Small square icon buttons: move up, move down and the trash icon. The hover
// effects only apply to enabled buttons, so a dimmed arrow stays still.
const ICON_BUTTON_BASE =
  "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-30";
const ICON_BUTTON_LOOK =
  "border-white/10 bg-white/[0.04] text-white/70 light:border-stone-300 light:bg-white light:text-stone-600";

export const ICON_BUTTON = `${ICON_BUTTON_BASE} ${ICON_BUTTON_LOOK} enabled:hover:bg-white/10 enabled:hover:text-white light:enabled:hover:bg-stone-100 light:enabled:hover:text-stone-900`;

// The trash icon turns red on hover
export const ICON_BUTTON_DANGER = `${ICON_BUTTON_BASE} ${ICON_BUTTON_LOOK} enabled:hover:border-red-400/50 enabled:hover:bg-red-500/10 enabled:hover:text-red-300 light:enabled:hover:border-red-300 light:enabled:hover:bg-red-50 light:enabled:hover:text-red-600`;

// A thin scrollbar that is actually visible. The app's global style hides
// the scrollbar thumb, which would hide the fact that a list scrolls.
export const SCROLLBAR =
  "[scrollbar-color:rgba(255,255,255,0.25)_transparent] [scrollbar-width:thin] light:[scrollbar-color:rgba(0,0,0,0.3)_transparent]";