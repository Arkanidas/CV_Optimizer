"use client";

import { useEffect, useState } from "react";
import { LETTER_TEMPLATES } from "@/app/dashboard/dashComponents/CoverLetterTools/templates/templateRegistry";
import { toDisplayContact } from "@/app/dashboard/dashComponents/CoverLetterTools/contactDetails";
import {PAGE_STAGE_HEIGHT,PAGE_STAGE_WIDTH,} from "@/app/dashboard/dashComponents/CoverLetterTools/PageStage";
import type {FormatSettings,LetterFormat,} from "@/app/dashboard/dashComponents/CoverLetterTools/letterFormat";
import type { ContactDetails } from "@/lib/AI/schemas";

interface PrintPayload {
  letter: string;
  format: FormatSettings;
  contact: ContactDetails;
  templateId: string;
}

declare global {
  interface Window {
    __PRINT_PAYLOAD__?: PrintPayload;
  }
}

export default function PrintCoverLetterPage() {
  const [payload, setPayload] = useState<PrintPayload | null>(null);
  const [ready, setReady] = useState(false);


  useEffect(() => {
    setPayload(window.__PRINT_PAYLOAD__ ?? null);
  }, []);


  useEffect(() => {
    if (!payload) return;
    document.fonts.ready.then(() => requestAnimationFrame(() => setReady(true)));
  }, [payload]);

  if (!payload) return null;

  const template = LETTER_TEMPLATES.find((t) => t.id === payload.templateId) ?? LETTER_TEMPLATES[0];
  const TemplateComponent = template.Component;
  const templateFormat: LetterFormat = { ...payload.format, contact: toDisplayContact(payload.contact) };

  return (
    <>
      <style>{`
        @page { margin: 0; }
        html, body { margin: 0; padding: 0; height: auto !important; background: #fff !important; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        p { break-inside: avoid; }
        /* The Next.js dev badge would otherwise end up in the PDF while developing */
        nextjs-portal { display: none !important; }
      `}</style>

      <div
        data-print-ready={ready ? "true" : "false"}
        style={{
          width: PAGE_STAGE_WIDTH,
          minHeight: PAGE_STAGE_HEIGHT,
          display: "grid",
          gridTemplateRows: "1fr",
        }}
      >
        <TemplateComponent letter={payload.letter} format={templateFormat} />
      </div>
    </>
  );
}