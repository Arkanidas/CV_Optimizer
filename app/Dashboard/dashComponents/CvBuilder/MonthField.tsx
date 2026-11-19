"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { INPUT_BASE, INPUT_ERROR, INPUT_OK, LABEL, SCROLLBAR } from "./cvBuilderTheme";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// The earliest year in the picker
const FIRST_YEAR = 1960;
const POPOVER_WIDTH = 288;
const POPOVER_HEIGHT = 300;
const EDGE = 8;

const pad = (n: number) => String(n).padStart(2, "0");
const yearOf = (value: string) => Number(value.slice(0, 4));

// "2026-11", the month it is now
export function currentMonthValue(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
}

// "2022-03" becomes "Mar 2022"
export function formatMonth(value: string): string {
  if (!/^\d{4}-\d{2}$/.test(value)) return "";
  return `${MONTHS[Number(value.slice(5, 7)) - 1] ?? ""} ${value.slice(0, 4)}`.trim();
}

interface MonthFieldProps {
  id: string;
  label: string;
  // "YYYY-MM", or "" when nothing is chosen
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  // The earliest and latest month that can be chosen, as "YYYY-MM". The
  // latest defaults to the current month, so the future can't be chosen.
  min?: string;
  max?: string;
  error?: string;
  className?: string;
}

export default function MonthField({
  id,
  label,
  value,
  onChange,
  required,
  disabled,
  placeholder = "Month, Year",
  min,
  max,
  error,
  className = "",
}: MonthFieldProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"months" | "years">("months");
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const maxValue = max ?? currentMonthValue();
  const minValue = min ?? `${FIRST_YEAR}-01`;
  const maxYear = yearOf(maxValue);
  const minYear = Math.max(FIRST_YEAR, yearOf(minValue));

  // The popup is drawn in a portal (so the scrolling list can't clip it), which
  // means it has to be positioned from the button's place on the screen.
  const updatePosition = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceBelow < POPOVER_HEIGHT + 12 && rect.top > spaceBelow;
    const top = placeAbove ? Math.max(EDGE, rect.top - POPOVER_HEIGHT - 6) : rect.bottom + 6;
    const left = Math.max(EDGE, Math.min(rect.left, window.innerWidth - POPOVER_WIDTH - EDGE));
    setPosition({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    // The popup closes when the page or the list scrolls, because the button
    // moves and the popup would be left behind. Scrolling inside the year
    // list doesn't count.
    function onScroll(e: Event) {
      if (popoverRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  function toggle() {
    if (disabled) return;
    if (!open) {
      // Open at the chosen year, otherwise at the earliest allowed one, otherwise now
      const start = value ? yearOf(value) : min ? yearOf(min) : maxYear;
      setYear(Math.min(Math.max(start, minYear), maxYear));
      setView("months");
    }
    setOpen((o) => !o);
  }

  function pick(monthIndex: number) {
    onChange(`${year}-${pad(monthIndex + 1)}`);
    setOpen(false);
    buttonRef.current?.focus();
  }

  const years = Array.from({ length: Math.max(0, maxYear - minYear + 1) }, (_, i) => maxYear - i);

  // POPUP BUTTONS. Light: violet-50 on hover, selected = violet-700.
  const navButton =
    "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white/70 transition enabled:hover:bg-white/10 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-30 light:text-stone-600 light:enabled:hover:bg-violet-50 light:enabled:hover:text-stone-900";
  const cell = (selected: boolean) =>
    `cursor-pointer rounded-lg px-2 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-30 ${
      selected
        ? "bg-violet-600 text-white light:bg-violet-700"
        : "text-white/80 enabled:hover:bg-white/10 light:text-stone-700 light:enabled:hover:bg-violet-50"
    }`;

  return (
    <div className={className}>
      <label htmlFor={id} className={`mb-2 block ${LABEL}`}>
        {label}
        {required && <span className="ml-1 text-violet-500 light:text-violet-600">*</span>}
      </label>

      <div className="relative">
        <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45 light:text-stone-400" />
        <button
          ref={buttonRef}
          id={id}
          type="button"
          onClick={toggle}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${INPUT_BASE} flex items-center pl-11 pr-10 text-left ${
            error ? INPUT_ERROR : INPUT_OK
          } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        >
          <span className={value ? "" : "text-white/40 light:text-stone-400"}>
            {value ? formatMonth(value) : placeholder}
          </span>
        </button>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45 light:text-stone-400" />
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400 light:text-red-600">
          {error}
        </p>
      )}

      {open &&
        position &&
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={`Choose ${label.toLowerCase()} date`}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              width: POPOVER_WIDTH,
              height: POPOVER_HEIGHT,
            }}
            // Dark: the same surface as the other dropdowns. Light: white.
            className="z-[60] flex flex-col rounded-2xl border border-white/10 bg-[#17131f] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.5)] light:border-stone-300 light:bg-white light:shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous year"
                disabled={view === "years" || year <= minYear}
                onClick={() => setYear((y) => y - 1)}
                className={navButton}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* The year is a button too: it switches to a list of years */}
              <button
                type="button"
                onClick={() => setView((v) => (v === "months" ? "years" : "months"))}
                aria-label={view === "months" ? "Choose a year" : "Back to the months"}
                className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10 light:text-stone-900 light:hover:bg-violet-50"
              >
                {year}
              </button>

              <button
                type="button"
                aria-label="Next year"
                disabled={view === "years" || year >= maxYear}
                onClick={() => setYear((y) => y + 1)}
                className={navButton}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {view === "months" ? (
              <div className="grid flex-1 grid-cols-3 gap-1.5">
                {MONTHS.map((name, index) => {
                  const monthValue = `${year}-${pad(index + 1)}`;
                  const outOfRange = monthValue < minValue || monthValue > maxValue;
                  return (
                    <button
                      key={name}
                      type="button"
                      disabled={outOfRange}
                      aria-pressed={value === monthValue}
                      onClick={() => pick(index)}
                      className={cell(value === monthValue)}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div
                className={`grid min-h-0 flex-1 grid-cols-4 content-start gap-1.5 overflow-y-auto ${SCROLLBAR}`}
              >
                {years.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      setYear(y);
                      setView("months");
                    }}
                    className={cell(y === year)}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}