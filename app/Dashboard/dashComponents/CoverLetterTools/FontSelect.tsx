"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import type { FontOption } from "./letterFormat";

interface FontSelectProps {
  label: string;
  options: FontOption[];
  value: string;
  onChange: (id: string) => void;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
}

export default function FontSelect({ label, options, value, onChange }: FontSelectProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const labelId = useId();
  const selected = options.find((option) => option.id === value) ?? options[0];

  // The menu is rendered in a portal on document.body (so no scroll
  // container can clip it), which means it has to be positioned from the
  // trigger button's on-screen rectangle.
  const updatePosition = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = { top: rect.bottom + 4, left: rect.left, width: rect.width };
    setPosition((prev) =>
      prev && prev.top === next.top && prev.left === next.left && prev.width === next.width
        ? prev
        : next
    );
  }, []);

  // Measure before paint so the menu never flashes in the wrong place.
  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    // capture: true also catches scrolling of any ancestor (the sticky
    // panel, the dashboard), so the menu follows the button.
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  return (
    <div className="flex flex-col gap-2">
      <span id={labelId} className="text-sm font-medium text-white">
        {label}
      </span>

      <button
        ref={buttonRef}
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

      {open &&
        position &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            aria-labelledby={labelId}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              width: position.width,
            }}
            className="z-[60] max-h-60 overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-[#17131f] p-1 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
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
          </ul>,
          document.body
        )}
    </div>
  );
}