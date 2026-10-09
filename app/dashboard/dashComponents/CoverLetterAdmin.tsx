"use client";

import { useState, useEffect } from "react";
import { Upload, Sparkles, Loader2, FileCheck, RotateCcw, SquareKanban } from "lucide-react";
import StepperBubbles, { type StepDefinition } from "./StepBubbles";
import Step1UploadContext from "./step1coverletter";
import StepPersonalizeMatch from "./StepOverview";
import type { AnalysisConclusion } from "@/lib/AI/schemas";
import StepPersonalize from "./StepPersonalise";
import type { ToneOption } from "@/lib/AI/tiers";
import StepGenerating from "./StepGenerating";
import StepReview from "./StepReview";
import ToastBanner from "./ToastBanner";

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
  conclusion?: AnalysisConclusion;
  highlightedQualifications?: string[];
}


const steps: StepDefinition[] = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "Overview", label: "Overview", icon: SquareKanban },
  { id: "Personalise", label: "Personalize", icon: Sparkles },
  { id: "Analyze", label: "Analyze", icon: Loader2 },
  { id: "Review", label: "Review", icon: FileCheck },
];

const STORAGE_KEY = "coverLetterWizardState";

function getPersistableData(data: WizardData) {
  const { uploadedFile, ...rest } = data;
  return rest;
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

        setWizardData((prev) => ({ ...prev, ...data, cvText: result.text }));
        setExtracting(false);
        setCurrentStepIndex(1);
      } catch (err) {
        console.error("Extraction error:", err);
        setExtractError("Something went wrong reading your CV. Please try again.");
        setExtracting(false);
      }
      return;
    }

    setWizardData((prev) => ({ ...prev, ...data }));
    setCurrentStepIndex(1);
  }

  function handleStartOver() {
    sessionStorage.removeItem(STORAGE_KEY);
    setWizardData({});
    setCurrentStepIndex(0);
    setExtractError("");
  }

  const isLastStep = currentStepIndex === steps.length - 1;

  useEffect(() => {
  setShowReadyToast(isLastStep);
}, [isLastStep]);

  return (
  <div className="flex flex-col gap-8">
   <ToastBanner open={showReadyToast} title="Your cover letter is ready" message="Review and customize it before downloading or copying." onClose={() => setShowReadyToast(false)}/>
    
{!isLastStep && (
  <div className="relative flex items-center justify-end">
    <div className="absolute left-0 right-20">
      <StepperBubbles
        steps={steps}
        currentStepIndex={currentStepIndex}
      />
    </div>

  </div>
)}

    {currentStepIndex > 0 && (
      <button
        onClick={handleStartOver}
        className="ml-4 flex shrink-0 items-center fixed gap-1.5 rounded-full border-white/10 bg-white/[0.04] px-3 py-1.5 text-lg text-white/50 transition hover:bg-white/[0.08] hover:text-white/80"
      >
        <RotateCcw className="h-3 w-3" />
        
      </button>
    )}

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
          setWizardData((prev) => ({ ...prev, generatedLetter: letter }));
          setCurrentStepIndex((i) => i + 1);
        }}
      />
    )}

    {currentStepIndex === 4 && (
      <StepReview
        generatedLetter={wizardData.generatedLetter}
        onGeneratedLetterChange={(value) =>
          setWizardData((prev) => ({ ...prev, generatedLetter: value }))
        }
      />
    )}

    {currentStepIndex !== 3 && currentStepIndex !== 4 && (
      <div className="rounded-2xl border-2 border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
        {currentStepIndex === 0 &&
          (loadingCvs ? (
            <p className="text-sm text-white/40">Loading your saved CVs...</p>
          ) : (
            <>
              {extractError && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {extractError}
                </div>
              )}
              <Step1UploadContext
                savedCvs={savedCvs}
                onContinue={handleStep1Continue}/>
            </>
          ))}

        {currentStepIndex === 1 && (
          <StepPersonalizeMatch
            jobDescription={wizardData.jobDescription ?? ""}
            cvText={wizardData.cvText ?? ""}
            matchPercentage={wizardData.matchPercentage}
            matches={wizardData.matches}
            conclusion={wizardData.conclusion}
            onAnalysisComplete={(matchPercentage, matches, conclusion) =>
              setWizardData((prev) => ({ ...prev, matchPercentage, matches, conclusion }))
            }
            onContinue={() => setCurrentStepIndex(2)}
          />
        )}

        {currentStepIndex === 2 && (
          <StepPersonalize
            whyCompany={wizardData.whyCompany}
            onWhyCompanyChange={(value) => setWizardData((prev) => ({ ...prev, whyCompany: value }))}
            whyRole={wizardData.whyRole}
            onWhyRoleChange={(value) => setWizardData((prev) => ({ ...prev, whyRole: value }))}
            additionalInfo={wizardData.additionalInfo}
            onAdditionalInfoChange={(value) => setWizardData((prev) => ({ ...prev, additionalInfo: value }))}
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