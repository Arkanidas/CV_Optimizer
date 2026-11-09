"use client";

import { useRef } from "react";
import { RotateCcw } from "lucide-react";

interface StartOverButtonProps {
  onClick: () => void;
  // "sm": the compact button used on the Review step.
  // "md": the same height as the Continue button, for the bottom row of a step.
  size?: "sm" | "md";
}

// TWEAK: how long the icon takes to turn once, in ms
const SPIN_MS = 600;

const SIZE_CLASSES = {
  sm: { button: "gap-1.5 rounded-lg px-3 py-2 text-xs", icon: "h-3.5 w-3.5" },
  md: { button: "gap-2 rounded-xl px-4 py-2.5 text-sm", icon: "h-4 w-4" },
};

export default function StartOverButton({ onClick, size = "sm" }: StartOverButtonProps) {
  const iconRef = useRef<HTMLSpanElement>(null);
  const sizeClasses = SIZE_CLASSES[size];

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
    // Dark:  #262430 is the solid gray from your reference image.
    // Light: white with a gray border. Stronger border: stone-400.
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={spinIcon}
      onFocus={spinIcon}
      className={`flex cursor-pointer items-center border border-white/10 bg-[#262430] font-medium text-white/75 shadow-[0_3px_10px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#33303e] hover:text-white light:border-stone-300 light:bg-white light:text-stone-700 light:shadow-[0_3px_10px_rgba(0,0,0,0.1)] light:hover:bg-stone-100 light:hover:text-stone-900 ${sizeClasses.button}`}
    >
      <span ref={iconRef} className="flex">
        <RotateCcw className={sizeClasses.icon} />
      </span>
      Start over
    </button>
  );
}