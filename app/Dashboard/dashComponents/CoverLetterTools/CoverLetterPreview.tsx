"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
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

const PREVIEW_WIDTH = 720;

const EXPANDED_MAX_WIDTH = 960;

function ExpandedOverlay({ onClose, children }: { onClose: () => void; children: ReactNode }) {

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


  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cover letter preview"
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

  const template = LETTER_TEMPLATES.find((t) => t.id === templateId) ?? LETTER_TEMPLATES[0];
  const TemplateComponent = template.Component;
  const templateFormat: LetterFormat = { ...format, contact: toDisplayContact(contact) };


  const paper = <TemplateComponent letter={letter} format={templateFormat} />;

  return (
    <>
  
      <div className="group relative">
        <PageStage
          width={PREVIEW_WIDTH}
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

      {expanded && <ExpandedOverlay onClose={close}>{paper}</ExpandedOverlay>}
    </>
  );
}