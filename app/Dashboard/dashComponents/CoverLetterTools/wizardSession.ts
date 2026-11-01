import type { ContactDetails } from "@/lib/AI/schemas";
import type { FormatSettings } from "./letterFormat";

export const WIZARD_STORAGE_KEY = "coverLetterWizardState";
export const LAST_STEP_INDEX = 4; 

export interface SavedLetter {
  id: string;
  runId: string | null;
  content: string;
  templateId: string;
  settings: Partial<FormatSettings> | null;
  contact: ContactDetails | null;
  createdAt: string;
  updatedAt: string;
}


export interface ActiveWizard {
  runId: string | null;
  stepIndex: number;
  letter?: string;
  contact?: ContactDetails;
  settings?: Partial<FormatSettings>;
  templateId?: string;
}

// Browser only: call from effects and click handlers, never during render.
export function readActiveWizard(): ActiveWizard | null {
  try {
    const raw = sessionStorage.getItem(WIZARD_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const data = parsed?.wizardData ?? {};

    return {
      runId: typeof data.analysisRunId === "string" ? data.analysisRunId : null,
      stepIndex: typeof parsed?.currentStepIndex === "number" ? parsed.currentStepIndex : 0,
      letter: typeof data.generatedLetter === "string" ? data.generatedLetter : undefined,
      contact: data.contactDetails ?? undefined,
      settings: data.letterFormat ?? undefined,
      templateId: typeof data.templateId === "string" ? data.templateId : undefined,
    };
  } catch {
    return null;
  }
}

// A letter that is still being set up (steps 2 to 4) and has not been saved
// yet. Replacing the session now would throw that work away.
export function isUnfinishedRun(active: ActiveWizard | null, letters: SavedLetter[]): boolean {
  if (!active?.runId) return false;
  if (active.stepIndex < 1 || active.stepIndex >= LAST_STEP_INDEX) return false;
  return !letters.some((letter) => letter.runId === active.runId);
}

// Puts a saved letter into the wizard's session, on the Review step.
export function writeLetterToWizard(letter: SavedLetter) {
  const state = {
    currentStepIndex: LAST_STEP_INDEX,
    wizardData: {
      analysisRunId: letter.runId ?? undefined,
      generatedLetter: letter.content,
      contactDetails: letter.contact ?? undefined,
      letterFormat: letter.settings ?? undefined,
      templateId: letter.templateId,
    },
  };
  sessionStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(state));
}

export function clearWizardSession() {
  sessionStorage.removeItem(WIZARD_STORAGE_KEY);
}