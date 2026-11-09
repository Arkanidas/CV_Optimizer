"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { Check, ChevronDown } from "lucide-react";
import { hasTierAccess, type SubscriptionTier } from "@/lib/AI/tiers";
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
  maxHeight: number;
}


const TIER_LABEL: Record<SubscriptionTier, string> = {
  free: "",
  standard: "Standard",
  pro: "Pro",
};


const MENU_MAX_HEIGHT = 288;
const MENU_MIN_HEIGHT = 120;
const VIEWPORT_MARGIN = 12;

export default function FontSelect({ label, options, value, onChange }: FontSelectProps) {
  const { data: session } = useSession();
  const userTier: SubscriptionTier = session?.user?.tier ?? "free";

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

    const top = rect.bottom + 4;
    // Never let the menu run off the bottom of the window
    const maxHeight = Math.max(
      MENU_MIN_HEIGHT,
      Math.min(MENU_MAX_HEIGHT, window.innerHeight - top - VIEWPORT_MARGIN)
    );
    const next = { top, left: rect.left, width: rect.width, maxHeight };

    setPosition((prev) =>
      prev &&
      prev.top === next.top &&
      prev.left === next.left &&
      prev.width === next.width &&
      prev.maxHeight === next.maxHeight
        ? prev
        : next
    );
  }, []);


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
      <span id={labelId} className="text-sm font-medium text-white light:text-stone-900">
        {label}
      </span>

      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm text-white/90 transition light:text-stone-900 ${
          open
            ? "border-violet-400/60 bg-violet-500/10 light:border-violet-500 light:bg-violet-50"
            : "border-white/10 bg-white/[0.03] hover:border-white/20 light:border-black/15 light:bg-white light:hover:border-black/30"
        }`}
      >
        <span className="truncate" style={{ fontFamily: selected.css }}>
          {selected.label}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 light:text-stone-500 ${
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
              maxHeight: position.maxHeight,
            }}

            className="z-[60] overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-[#17131f] p-1 shadow-[0_16px_48px_rgba(0,0,0,0.5)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden light:border-black/10 light:bg-white light:shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
          >
            {options.map((option) => {
              const requiredTier: SubscriptionTier = option.minTier ?? "free";
              const tierLabel = TIER_LABEL[requiredTier];
              const locked = !hasTierAccess(userTier, requiredTier);
              const isSelected = option.id === value;

              return (
                <li
                  key={option.id}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={locked}
                  title={locked ? `Available on the ${tierLabel} plan` : undefined}
                >
                  <button
                    type="button"
                    disabled={locked}
                    onClick={() => {
                      onChange(option.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                      isSelected
                        ? "bg-violet-500/15 text-white light:bg-violet-100 light:text-stone-900"
                        : locked
                        ? "cursor-not-allowed text-white/30 light:text-stone-400"
                        : "text-white/75 hover:bg-white/[0.06] hover:text-white light:text-stone-700 light:hover:bg-black/5 light:hover:text-stone-900"
                    }`}
                  >
                    <span style={{ fontFamily: option.css }}>{option.label}</span>

                    <span className="flex shrink-0 items-center gap-2">
                      {tierLabel && (
                        <span className="text-[11px] text-white/35 light:text-stone-400">
                          {tierLabel}
                        </span>
                      )}
                      {/* Fixed width, so the tier labels line up in a column
                          whether or not a row has the check mark */}
                      <span className="flex h-4 w-4 items-center justify-center">
                        {isSelected && (
                          <Check className="h-4 w-4 text-violet-300 light:text-violet-600" />
                        )}
                      </span>
                    </span>
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