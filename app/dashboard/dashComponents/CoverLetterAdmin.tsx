"use client";

import { useState, useEffect } from "react";
import { Upload, Sparkles, Loader2, FileCheck, SquareKanban } from "lucide-react";
import StepperBubbles, { type StepDefinition } from "./StepBubbles";
import Step1UploadContext from "./step1coverletter";
import StepPersonalizeMatch from "./StepOverview";
import type { AnalysisConclusion, ContactDetails } from "@/lib/AI/schemas";
import StepPersonalize from "./StepPersonalise";
import type { ToneOption } from "@/lib/AI/tiers";
import StepGenerating from "./StepGenerating";
import StepReview from "./StepReview";
import ToastBanner from "./ToastBanner";
import { WIZARD_STORAGE_KEY as STORAGE_KEY } from "./CoverLetterTools/wizardSession";
import type { FormatSettings } from "./CoverLetterTools/letterFormat";
import type { SaveStatus } from "./CoverLetterTools/useAutosave";

interface SavedCv {
  id: string;
  title: string;
  updatedAt: string;
}

interface WizardData {
  cvId?: string;
  uploadedFile?: File;
  cvText?: string;
  jobDescription?: string;
  matchPercentage?: number;
  matches?: any;
  whyCompany?: string;
  whyRole?: string;
  additionalInfo?: string;
  tone?: ToneOption | null;
  generatedLetter?: string;
  conclusion?: AnalysisConclusion | null;
  highlightedQualifications?: string[];
  contactDetails?: ContactDetails;
  analysisRunId?: string;
  letterFormat?: FormatSettings;
  templateId?: string;
}

const steps: StepDefinition[] = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "Overview", label: "Overview", icon: SquareKanban },
  { id: "Personalise", label: "Personalize", icon: Sparkles },
  { id: "Analyze", label: "Analyze", icon: Loader2 },
  { id: "Review", label: "Review", icon: FileCheck },
];

function getPersistableData(data: WizardData) {
  const { uploadedFile, ...rest } = data;
  return rest;
}

function newRunId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
  );
}

export default function CoverLetterWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [savedCvs, setSavedCvs] = useState<SavedCv[]>([]);
  const [loadingCvs, setLoadingCvs] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [showReadyToast, setShowReadyToast] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [limitToastDismissed, setLimitToastDismissed] = useState(false);



  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setCurrentStepIndex(parsed.currentStepIndex ?? 0);
        setWizardData(parsed.wizardData ?? {});
      }
    } catch {
      console.error("Error parsing storage key");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currentStepIndex, wizardData: getPersistableData(wizardData) })
    );
  }, [currentStepIndex, wizardData, hydrated]);

  useEffect(() => {
    fetch("/api/cv/list")
      .then((res) => res.json())
      .then((data) => setSavedCvs(data.cvs ?? []))
      .catch(() => setSavedCvs([]))
      .finally(() => setLoadingCvs(false));
  }, []);

  // The limit toast takes over from the "ready" toast, so the two never stack.
  useEffect(() => {
    if (saveStatus === "limit") setShowReadyToast(false);
  }, [saveStatus]);

  async function handleStep1Continue(data: {
    cvId?: string;
    uploadedFile?: File;
    jobDescription: string;
  }) {
    setExtractError("");

    if (data.uploadedFile) {
      setExtracting(true);
      try {
        const formData = new FormData();
        formData.append("file", data.uploadedFile);

        const res = await fetch("/api/cv/extract-text", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();

        if (!res.ok) {
          setExtractError(result.message || "Couldn't read that file.");
          setExtracting(false);
          return;
        }

        setWizardData((prev) => ({
          ...prev,
          ...data,
          cvText: result.text,
          analysisRunId: newRunId(),
        }));
        setExtracting(false);
        setCurrentStepIndex(1);
      } catch (err) {
        console.error("Extraction error:", err);
        setExtractError("Something went wrong reading your CV. Please try again.");
        setExtracting(false);
      }
      return;
    }

    setWizardData((prev) => ({ ...prev, ...data, analysisRunId: newRunId() }));
    setCurrentStepIndex(1);
  }

  function handleStartOver() {
    sessionStorage.removeItem(STORAGE_KEY);
    setWizardData({});
    setCurrentStepIndex(0);
    setExtractError("");
    setSaveStatus("idle");
    setLimitToastDismissed(false);
    setShowReadyToast(false);
  }

  const isLastStep = currentStepIndex === steps.length - 1;

  // The floating Start over button (drawn in the top strip) is only for the
  // Review step. Overview has its own button at the bottom of the step, and
  // Personalize has "Back to Overview".
  const showStartOver = isLastStep;

  return (
    <div className="flex flex-col gap-8">
      <ToastBanner
        open={showReadyToast}
        title="Your cover letter is ready"
        message="Review and customize it before downloading or copying."
        onClose={() => setShowReadyToast(false)}
      />

      <ToastBanner
        variant="danger"
        open={isLastStep && saveStatus === "limit" && !limitToastDismissed}
        title="Your cover letter has reached its limit"
        message="Delete or upgrade to save more"
        onClose={() => setLimitToastDismissed(true)}
      />

      {/* h-0 on the Review step keeps the layout there exactly as it was */}
      <div className={isLastStep ? "h-0" : ""}>
        {!isLastStep && <StepperBubbles steps={steps} currentStepIndex={currentStepIndex} />}
      </div>


      {currentStepIndex === 3 && (
        <StepGenerating
          cvText={wizardData.cvText ?? ""}
          jobDescription={wizardData.jobDescription ?? ""}
          whyCompany={wizardData.whyCompany ?? ""}
          whyRole={wizardData.whyRole ?? ""}
          additionalInfo={wizardData.additionalInfo}
          tone={wizardData.tone ?? "professional"}
          highlightedQualifications={wizardData.highlightedQualifications ?? []}
          matches={wizardData.matches}
          generatedLetter={wizardData.generatedLetter}
          onGenerated={(letter) => {

          const isFresh = !wizardData.generatedLetter;

            setWizardData((prev) => ({ ...prev, generatedLetter: letter }));
            setCurrentStepIndex(steps.length - 1);
            if (isFresh) setShowReadyToast(true);
          }}
        />
      )}

      {currentStepIndex === 4 && (
        <StepReview
          generatedLetter={wizardData.generatedLetter}
          onGeneratedLetterChange={(value) =>
            setWizardData((prev) => ({ ...prev, generatedLetter: value }))
          }
          cvText={wizardData.cvText}
          contactDetails={wizardData.contactDetails}
          onContactDetailsChange={(value) =>
            setWizardData((prev) => ({ ...prev, contactDetails: value }))
          }
          analysisRunId={wizardData.analysisRunId}
          initialFormat={wizardData.letterFormat}
          onFormatChange={(value) => setWizardData((prev) => ({ ...prev, letterFormat: value }))}
          initialTemplateId={wizardData.templateId}
          onTemplateChange={(value) => setWizardData((prev) => ({ ...prev, templateId: value }))}
          onSaveStatusChange={setSaveStatus}
        />
      )}

      {currentStepIndex !== 3 && currentStepIndex !== 4 && (
        // FRAME LIGHT COLORS (tweak here)
        // light:border-stone-400  the frame. It's border-2, so 2px thick. Softer: stone-300
        // light:bg-stone-50       the fill, a touch lighter than the #ededed page.
        //                         Alternatives: white, stone-100
        <div className="rounded-2xl border-2 border-white/10 bg-white/[0.02] p-4 backdrop-blur-md light:border-stone-400 light:bg-stone-50">
          {currentStepIndex === 0 &&
            (loadingCvs ? (
              <p className="text-sm text-white/40 light:text-stone-500">Loading your saved CVs...</p>
            ) : (
              <>
                {extractError && (
                  <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 light:border-red-300 light:bg-red-50 light:text-red-700">
                    {extractError}
                  </div>
                )}
                <Step1UploadContext savedCvs={savedCvs} onContinue={handleStep1Continue} />
              </>
            ))}

          {currentStepIndex === 1 && (
            <StepPersonalizeMatch
              jobDescription={wizardData.jobDescription ?? ""}
              cvText={wizardData.cvText ?? ""}
              matchPercentage={wizardData.matchPercentage}
              matches={wizardData.matches}
              conclusion={wizardData.conclusion}
              analysisRunId={wizardData.analysisRunId}
              onAnalysisComplete={(matchPercentage, matches, conclusion) =>
                setWizardData((prev) => ({ ...prev, matchPercentage, matches, conclusion }))
              }
              onContinue={() => setCurrentStepIndex(2)}
              onStartOver={handleStartOver}
            />
          )}

          {currentStepIndex === 2 && (
            <StepPersonalize
              whyCompany={wizardData.whyCompany}
              onWhyCompanyChange={(value) => setWizardData((prev) => ({ ...prev, whyCompany: value }))}
              whyRole={wizardData.whyRole}
              onWhyRoleChange={(value) => setWizardData((prev) => ({ ...prev, whyRole: value }))}
              additionalInfo={wizardData.additionalInfo}
              onAdditionalInfoChange={(value) =>
                setWizardData((prev) => ({ ...prev, additionalInfo: value }))
              }
              tone={wizardData.tone}
              onToneChange={(value) => setWizardData((prev) => ({ ...prev, tone: value }))}
              matches={wizardData.matches}
              highlightedQualifications={wizardData.highlightedQualifications}
              onHighlightedQualificationsChange={(ids) =>
                setWizardData((prev) => ({ ...prev, highlightedQualifications: ids }))
              }
              onBack={() => setCurrentStepIndex((i) => i - 1)}
              onContinue={() => setCurrentStepIndex((i) => i + 1)}
            />
          )}
        </div>
      )}
    </div>
  );
}