"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";
import { LETTER_TEMPLATES } from "./templates/templateRegistry";
import PageStage from "./PageStage";
import { toDisplayContact } from "./contactDetails";
import type { FormatSettings, LetterFormat } from "./letterFormat";
import type { ContactDetails } from "@/lib/AI/schemas";

interface CoverLetterPreviewProps {
  letter: string;
  format: FormatSettings;
  contact: ContactDetails;
  templateId: string;
}

// ============================================================
// SIZES (TWEAK ZONE)
// ============================================================
// The widest the paper gets, in px. On a big screen it stays at this size,
// exactly as before. On smaller screens it shrinks to fit its column.
const PREVIEW_WIDTH = 720;
// It never gets narrower than this, even in a very small window.
const PREVIEW_MIN_WIDTH = 280;
// Empty space between the paper and the edges of its column, on each side.
// This keeps the paper off the divider line and off the edge of the screen.
const PREVIEW_GUTTER = 18;
// The widest the expanded paper gets, in px. On narrower screens it shrinks
// to fit with 24px of space on each side.
const EXPANDED_MAX_WIDTH = 960;

function ExpandedOverlay({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  // This component only mounts after a click, so window always exists here.
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const paperWidth = Math.min(EXPANDED_MAX_WIDTH, viewportWidth - 48);

  // Rendered in a portal so it covers the whole screen, sidebar included,
  // and no parent's overflow or z-index can clip it.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cover letter preview"
      // overscroll-contain stops wheel scrolling from carrying on into the
      // dashboard behind. The scrollbar classes are needed because the
      // global scrollbar style hides thumbs on inner scroll areas.
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-[#0d0b14] [scrollbar-color:rgba(255,255,255,0.25)_transparent] [scrollbar-width:thin]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        autoFocus
        className="fixed right-6 top-6 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex justify-center px-6 py-10">
        <PageStage
          width={paperWidth}
          fitContent
          className="rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        >
          {children}
        </PageStage>
      </div>
    </div>,
    document.body
  );
}

export default function CoverLetterPreview({ letter, format, contact, templateId }: CoverLetterPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const close = useCallback(() => setExpanded(false), []);
  const boxRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const update = () => setAvailable(el.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const previewWidth =
    available === null
      ? PREVIEW_WIDTH
      : Math.max(
          PREVIEW_MIN_WIDTH,
          Math.min(PREVIEW_WIDTH, Math.floor(available - PREVIEW_GUTTER * 2))
        );

  const template = LETTER_TEMPLATES.find((t) => t.id === templateId) ?? LETTER_TEMPLATES[0];
  const TemplateComponent = template.Component;
  const templateFormat: LetterFormat = { ...format, contact: toDisplayContact(contact) };

  // Built once and shown twice: in the normal preview and in the overlay.
  const paper = <TemplateComponent letter={letter} format={templateFormat} />;

  return (
    <>
      <div ref={boxRef} className="flex w-full min-w-0 justify-center">
        {/* "group" makes the whole paper the hover area for the button */}
        <div className="group relative">
          <PageStage
            width={previewWidth}
            fitContent
            className="rounded-sm border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
          >
            {paper}
          </PageStage>

          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label="Expand preview"
            className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/25 bg-black/40 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/60 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && <ExpandedOverlay onClose={close}>{paper}</ExpandedOverlay>}
    </>
  );
}