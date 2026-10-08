"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { FontOption } from "./letterFormat";

interface FontSelectProps {
  label: string;
  options: FontOption[];
  value: string;
  onChange: (id: string) => void;
}

export default function FontSelect({ label, options, value, onChange }: FontSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const selected = options.find((option) => option.id === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      <span id={labelId} className="text-sm font-medium text-white">
        {label}
      </span>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm text-white/90 transition ${
          open
            ? "border-violet-400/60 bg-violet-500/10"
            : "border-white/10 bg-white/[0.03] hover:border-white/20"
        }`}
      >
        <span className="truncate" style={{ fontFamily: selected.css }}>
          {selected.label}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby={labelId}
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-[#17131f] p-1 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
        >
          {options.map((option) => {
            const isSelected = option.id === value;
            return (
              <li key={option.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                    isSelected
                      ? "bg-violet-500/15 text-white"
                      : "text-white/75 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span style={{ fontFamily: option.css }}>{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-violet-300" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}