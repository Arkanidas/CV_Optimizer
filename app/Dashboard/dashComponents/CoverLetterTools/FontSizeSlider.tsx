"use client";

import { useId } from "react";

interface FontSizeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export default function FontSizeSlider({ label, value, min, max, onChange }: FontSizeSliderProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-white">
          {label}
        </label>
        <span className="text-sm text-white/60">{value} pt</span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow"
      />

      <div className="flex justify-between text-[11px] text-white/35">
        <span>{min} pt</span>
        <span>{max} pt</span>
      </div>
    </div>
  );
}