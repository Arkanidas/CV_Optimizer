"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import { INPUT_BASE, INPUT_ERROR, INPUT_OK, LABEL, SCROLLBAR } from "./cvBuilderTheme";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  icon?: LucideIcon;
  required?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
}

const MAX_HEIGHT = 288;
const OPTION_HEIGHT = 40;

interface Position {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  maxHeight: number;
}

export default function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  icon: Icon,
  required,
  placeholder = "Choose...",
  error,
  className = "",
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  // The list is drawn in a portal (so the page can't clip it), which means it
  // is positioned from the button's place on the screen. It opens below the
  // button, or above it when there is more room there.
  const updatePosition = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const wanted = Math.min(MAX_HEIGHT, options.length * OPTION_HEIGHT + 12);
    const above = spaceBelow < wanted && spaceAbove > spaceBelow;

    setPosition({
      left: rect.left,
      width: rect.width,
      ...(above ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }),
      maxHeight: Math.max(120, Math.min(MAX_HEIGHT, above ? spaceAbove : spaceBelow)),
    });
  }, [options.length]);

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  // Move the focus into the list when it opens: to the chosen option, or the first
  const ready = open && position !== null;
  useEffect(() => {
    if (!ready) return;
    const chosen = popoverRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    (chosen ?? popoverRef.current?.querySelector<HTMLElement>('[role="option"]'))?.focus();
  }, [ready]);

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
    // The list closes when the page scrolls, because the button moves and the
    // list would be left behind. Scrolling inside the list doesn't count.
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

  function pick(next: string) {
    onChange(next);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function onListKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    const items = Array.from(popoverRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    const index = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[Math.min(items.length - 1, index + 1)]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[Math.max(0, index - 1)]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === "Tab") {
      // The list is at the end of the page, so Tab would jump far away. Close
      // it and let Tab continue from the button instead.
      setOpen(false);
      buttonRef.current?.focus();
    }
  }

  return (
    <div className={className}>
      <label htmlFor={id} className={`mb-2 block ${LABEL}`}>
        {label}
        {required && <span className="ml-1 text-violet-500 light:text-violet-600">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-300 light:text-violet-600" />
        )}
        <button
          ref={buttonRef}
          id={id}
          type="button"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" && !open) {
              e.preventDefault();
              setOpen(true);
            }
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${INPUT_BASE} flex cursor-pointer items-center pr-10 text-left ${
            Icon ? "pl-11" : "pl-4"
          } ${error ? INPUT_ERROR : INPUT_OK}`}
        >
          <span className={`truncate ${selected ? "" : "text-white/40 light:text-stone-400"}`}>
            {selected ? selected.label : placeholder}
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
            role="listbox"
            aria-label={label}
            onKeyDown={onListKeyDown}
            style={{
              position: "fixed",
              left: position.left,
              width: position.width,
              top: position.top,
              bottom: position.bottom,
              maxHeight: position.maxHeight,
            }}
            // Dark: the same surface as the other dropdowns. Light: white.
            className={`z-[60] overflow-y-auto rounded-2xl border border-white/10 bg-[#17131f] p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.5)] light:border-stone-300 light:bg-white light:shadow-[0_16px_48px_rgba(0,0,0,0.18)] ${SCROLLBAR}`}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  onClick={() => pick(option.value)}
                  className={`flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition focus:outline-none ${
                    isSelected
                      ? "bg-violet-600/25 text-white light:bg-violet-100 light:text-violet-900"
                      : "text-white/80 hover:bg-white/10 focus:bg-white/10 light:text-stone-700 light:hover:bg-violet-50 light:focus:bg-violet-50"
                  }`}
                >
                  {option.label}
                  {isSelected && <Check className="h-4 w-4 shrink-0" strokeWidth={3} />}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}