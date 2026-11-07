"use client";

import { useRef } from "react";
import { RotateCcw } from "lucide-react";

interface StartOverButtonProps {
  onClick: () => void;
}

// TWEAK: how long the icon takes to turn once, in ms
const SPIN_MS = 600;

export default function StartOverButton({ onClick }: StartOverButtonProps) {
  const iconRef = useRef<HTMLSpanElement>(null);

  // One full turn, counter-clockwise like the icon's arrow. It plays each time
  // the mouse enters (or the keyboard focuses) the button, and it ends where
  // it began, so leaving the button doesn't spin it back.
  function spinIcon() {
    iconRef.current?.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(-360deg)" }],
      { duration: SPIN_MS, easing: "ease-in-out" }
    );
  }

  return (
    // BUTTON COLORS (tweak here)
    // Dark:  #262430 is the solid gray from your reference image, with a thin
    //        light border. It's opaque on purpose, so the page text doesn't
    //        show through when you scroll underneath it.
    // Light: white with a gray border. Stronger border: stone-400.
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={spinIcon}
      onFocus={spinIcon}
      className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-[#262430] px-3.5 py-2 text-sm font-medium text-white/75 shadow-[0_4px_14px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#33303e] hover:text-white light:border-stone-300 light:bg-white light:text-stone-700 light:shadow-[0_4px_14px_rgba(0,0,0,0.1)] light:hover:bg-stone-100 light:hover:text-stone-900"
    >
      <span ref={iconRef} className="flex">
        <RotateCcw className="h-4 w-4" />
      </span>
      Start over
    </button>
  );
}