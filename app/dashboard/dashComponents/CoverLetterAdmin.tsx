"use client";

import { useState, useEffect } from "react";
import { Upload, Sparkles, Loader2, FileCheck, Download } from "lucide-react";
import StepperBubbles, { type StepDefinition } from "./StepBubbles";
import Step1UploadContext from "./StepUploadProgress";

interface SavedCv {
  id: string;
  title: string;
  updatedAt: string;
}

interface WizardData {
  cvId?: string;
  uploadedFile?: File;
  jobDescription?: string;
  // filled in by steps 2-5 as they're built
  whyCompany?: string;
  tone?: "formal" | "casual";
  generatedLetter?: string;
}

const steps: StepDefinition[] = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "personalize", label: "Personalize", icon: Sparkles },
  { id: "analyzing", label: "Analyzing", icon: Loader2 },
  { id: "review", label: "Review", icon: FileCheck },
  { id: "download", label: "Download", icon: Download },
];

export default function CoverLetterWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [savedCvs, setSavedCvs] = useState<SavedCv[]>([]);
  const [loadingCvs, setLoadingCvs] = useState(true);

  // Fetch the user's saved CVs once, client-side, so Step 1 can offer
  // "use a saved CV" alongside "upload new". Swap this for props from a
  // server component instead if you'd rather avoid the client fetch.
  useEffect(() => {
    fetch("/api/cv/list")
      .then((res) => res.json())
      .then((data) => setSavedCvs(data.cvs ?? []))
      .catch(() => setSavedCvs([]))
      .finally(() => setLoadingCvs(false));
  }, []);

  function handleStep1Continue(data: {
    cvId?: string;
    uploadedFile?: File;
    jobDescription: string;
  }) {
    setWizardData((prev) => ({ ...prev, ...data }));
    setCurrentStepIndex(1);
  }

  return (
    <div className="flex flex-col gap-8">
      <StepperBubbles steps={steps} currentStepIndex={currentStepIndex} />

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
        {currentStepIndex === 0 &&
          (loadingCvs ? (
            <p className="text-sm text-white/40">Loading your saved CVs...</p>
          ) : (
            <Step1UploadContext
              savedCvs={savedCvs}
              onContinue={handleStep1Continue}
            />
          ))}

        {currentStepIndex > 0 && (
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
