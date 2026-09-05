"use client";

import { useState, useEffect } from "react";
import { Upload, Sparkles, Loader2, FileCheck, RotateCcw, SquareKanban } from "lucide-react";
import StepperBubbles, { type StepDefinition } from "./StepBubbles";
import Step1UploadContext from "./step1coverletter";
import StepPersonalizeMatch from "./StepPersonalizeMatch";
import type { AnalysisConclusion } from "@/lib/AI/schemas";

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
  tone?: "formal" | "casual";
  generatedLetter?: string;
  conclusion?: AnalysisConclusion;
}



const steps: StepDefinition[] = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "Overview", label: "Overview", icon: SquareKanban },
  { id: "Personalise", label: "Personalize", icon: Sparkles },
  { id: "Analyze", label: "Analyze", icon: Loader2 },
  { id: "Review", label: "Review", icon: FileCheck },
];

const STORAGE_KEY = "coverLetterWizardState";

// File objects can't survive JSON.stringify, so it's stripped before saving —
// everything else (cvText, jobDescription, etc.) is plain serializable data.
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

  // Restore from sessionStorage AFTER mount (not during initial render) —
  // this avoids a server/client hydration mismatch, since the server always
  // renders the default (empty) state first.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setCurrentStepIndex(parsed.currentStepIndex ?? 0);
        setWizardData(parsed.wizardData ?? {});
      }
    } catch {
      // corrupted/old storage shape — just start fresh, no need to surface an error
    }
    setHydrated(true);
  }, []);

  // Persist on every change, once we're past the initial restore.
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <StepperBubbles steps={steps} currentStepIndex={currentStepIndex} />
        {currentStepIndex > 0 && (
          <button
            onClick={handleStartOver}
            className="ml-4 flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/50 transition hover:bg-white/[0.08] hover:text-white/80"
          >
            <RotateCcw className="h-3 w-3" />
            Start over
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
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
                onContinue={handleStep1Continue}
              />
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

        {currentStepIndex > 1 && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-white/50">
              Step {currentStepIndex + 1} — {steps[currentStepIndex].label} —
              coming in the next build pass.
            </p>
            <button
              onClick={() => setCurrentStepIndex((i) => i - 1)}
              className="text-sm text-violet-300 hover:text-violet-200"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}