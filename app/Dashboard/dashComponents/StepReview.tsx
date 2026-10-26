"use client";

import { useEffect, useRef, useState } from "react";
import LetterEditor from "./CoverLetterTools/LetterEditor";
import CoverLetterPreview from "./CoverLetterTools/CoverLetterPreview";
import WorkspaceTabs from "./CoverLetterTools/WorkspaceTabs";
import FormatPanel from "./CoverLetterTools/FormatPanel";
import TempleteGallery from "./CoverLetterTools/TemplateGallery";
import AutosaveIndicator from "./CoverLetterTools/AutosaveIndicator";
import { useAutosave } from "./CoverLetterTools/useAutosave";
import { downloadLetter } from "./CoverLetterTools/exportLetter";
import { EMPTY_CONTACT_DETAILS } from "./CoverLetterTools/contactDetails";
import { LETTER_TEMPLATES } from "./CoverLetterTools/templates/templateRegistry";
import {
  DEFAULT_LETTER_FORMAT,
  type FormatSettings,
  type ReviewPane,
} from "./CoverLetterTools/letterFormat";
import type { ContactDetails } from "@/lib/AI/schemas";

interface StepReviewProps {
  generatedLetter?: string;
  onGeneratedLetterChange?: (value: string) => void;
  cvText?: string;
  contactDetails?: ContactDetails;
  onContactDetailsChange?: (value: ContactDetails) => void;
  analysisRunId?: string;
  initialFormat?: FormatSettings;
  onFormatChange?: (value: FormatSettings) => void;
  initialTemplateId?: string;
  onTemplateChange?: (value: string) => void;
}

export default function StepReview({
  generatedLetter = "",
  onGeneratedLetterChange,
  cvText = "",
  contactDetails,
  onContactDetailsChange,
  analysisRunId,
  initialFormat,
  onFormatChange,
  initialTemplateId,
  onTemplateChange,
}: StepReviewProps) {
  const [localLetter, setLocalLetter] = useState(generatedLetter);
  const [activePane, setActivePane] = useState<ReviewPane>("editor");
  // The spread fills in any setting an older saved session doesn't have yet.
  const [format, setFormat] = useState<FormatSettings>({
    ...DEFAULT_LETTER_FORMAT,
    ...initialFormat,
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() =>
    LETTER_TEMPLATES.some((t) => t.id === initialTemplateId)
      ? (initialTemplateId as string)
      : LETTER_TEMPLATES[0].id
  );
  const [contact, setContact] = useState<ContactDetails>(contactDetails ?? EMPTY_CONTACT_DETAILS);
  // True from the first render when the details still have to be read from
  // the CV, so autosave waits for them instead of saving an empty header.
  const [extractingContact, setExtractingContact] = useState(
    contactDetails === undefined && Boolean(cvText)
  );
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const hasStartedExtraction = useRef(false);

  const autosave = useAutosave(
    analysisRunId && !extractingContact
      ? {
          runId: analysisRunId,
          content: localLetter,
          templateId: selectedTemplateId,
          settings: format,
          contact,
        }
      : null
  );

  // Read the candidate's details from the CV once. contactDetails being
  // undefined means "never extracted"; once it is an object (extracted or
  // typed by the user) this never runs again, even after a page reload.
  useEffect(() => {
    if (contactDetails !== undefined || !cvText) return;
    if (hasStartedExtraction.current) return;
    hasStartedExtraction.current = true;

    async function run() {
      setExtractingContact(true);
      try {
        const res = await fetch("/api/cover-letter/extract-contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvText }),
        });
        const data = await res.json();

        if (res.ok && data.contact) {
          setContact(data.contact);
          onContactDetailsChange?.(data.contact);
        }
      } catch (err) {
        // Fields stay empty and the user can fill them in by hand.
        console.error("Contact extraction failed:", err);
      } finally {
        setExtractingContact(false);
      }
    }

    run();
   
  }, []);

  function handleLetterChange(value: string) {
    setLocalLetter(value);
    onGeneratedLetterChange?.(value);
  }

  function handleContactChange(next: ContactDetails) {
    setContact(next);
    onContactDetailsChange?.(next);
  }

  function handleFormatChange(next: FormatSettings) {
    setFormat(next);
    onFormatChange?.(next);
  }

  function handleTemplateChange(id: string) {
    setSelectedTemplateId(id);
    onTemplateChange?.(id);
  }

  async function handleDownload() {
    setDownloadError("");
    setDownloading(true);
    try {
      await downloadLetter({
        letter: localLetter,
        format,
        contact,
        templateId: selectedTemplateId,
      });
    } catch (err) {
      console.error("Download failed:", err);
      setDownloadError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="relative grid grid-cols-1 items-start gap-y-8 lg:grid-cols-2">
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/10 lg:block" />

      <section
        className="flex min-w-0 justify-center lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto lg:pr-8 lg:[scrollbar-gutter:stable]"
        aria-label="Cover letter workspace"
      >
        <div className="flex w-full max-w-[650px] flex-col gap-4">
          <div className="relative">
            <WorkspaceTabs active={activePane} onChange={setActivePane} />
            <AutosaveIndicator status={autosave.status} />
          </div>

          {activePane === "editor" && (
            <LetterEditor value={localLetter} onChange={handleLetterChange} />
          )}

          {activePane === "format" && (
            <FormatPanel
              format={format}
              onChange={handleFormatChange}
              contact={contact}
              onContactChange={handleContactChange}
              contactLoading={extractingContact}
              onDownload={handleDownload}
              downloading={downloading}
              downloadError={downloadError}
            />
          )}

          {activePane === "templates" && (
            <TempleteGallery
              selectedId={selectedTemplateId}
              onSelect={handleTemplateChange}
              format={format}
              onColorChange={(color) => handleFormatChange({ ...format, accentColor: color })}
            />
          )}
        </div>
      </section>

      <section
        className="flex min-w-0 justify-center lg:-mr-8"
        aria-label="Formatted cover letter preview"
      >
        <CoverLetterPreview
          letter={localLetter}
          format={format}
          contact={contact}
          templateId={selectedTemplateId}
        />
      </section>
    </div>
  );
}