"use client";

import { ArrowRight } from "lucide-react";
import SpecularButton from "@/components/SpecularButton";

interface CvGoButtonProps {
  visible: boolean;
  onClick: () => void;
  hint?: string;
  label?: string;

  className?: string;
}

// The violet plate behind the glass button. Match the radius to the button's
// own corner radius. If the button already has its own fill, delete the plate.
const PLATE_RADIUS = "rounded-2xl";

export default function CvGoButton({
  visible,
  onClick,
  hint = "",
  label = "Let's Go",
  className = "mt-8 w-full",
}: CvGoButtonProps) {
  return (
    // The button is always on the page and only fades in and out. inert
    // removes it from mouse and keyboard use while it's hidden. Space is
    // always reserved (min-h-16), so nothing jumps.
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={`${className} flex min-h-16 items-center justify-center transition-opacity duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className={`${PLATE_RADIUS} bg-violet-600 shadow-[0_0_30px_rgba(124,58,237,0.55)] light:bg-violet-700 light:shadow-[0_8px_24px_-6px_rgba(109,40,217,0.55)]`}
      >
        <SpecularButton
          onClick={onClick}
          size="lg"
          radius={14}
          tint="#8900d8"
          tintOpacity={1}
          textColor="#fcf8f8ee"
          lineColor="#9d0de0"
          baseColor="#7500b9"
          intensity={0.9}
          idleIntensity={0.95}
          shineSize={35}
          shineFade={52}
          thickness={1.2}
          glow={1}
          followMouse
          proximity={190}
        >
          <span className="flex items-center gap-2 px-3">
            {label}
            {hint && <span className="sr-only"> {hint}</span>}
            <ArrowRight className="h-5 w-5" />
          </span>
        </SpecularButton>
      </div>
    </div>
  );
}