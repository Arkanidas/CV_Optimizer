import type { CreateType } from "./CvCreateTypeStep";

// The user's choices from the three steps, saved for the create page and the
// AI. It lives in the browser session, like the cover letter wizard's state,
// so it's cleared when the tab is closed.
export const CV_SETUP_KEY = "cvCreateSetup";

export interface CvSetup {
  // "general" or "targeted", from the second step
  cvType: CreateType | null;
  industryId: string;
  industry: string;
  occupation: string;
  experienceId: string;
  experienceLevel: string;
  experienceYears: string;
}

export function saveCvSetup(setup: CvSetup) {
  try {
    sessionStorage.setItem(CV_SETUP_KEY, JSON.stringify(setup));
  } catch {
    // Storage can be blocked, for example in private browsing. The create
    // page then simply has nothing to read.
  }
}

// Browser only: call from effects and click handlers, never during render.
export function readCvSetup(): CvSetup | null {
  try {
    const raw = sessionStorage.getItem(CV_SETUP_KEY);
    return raw ? (JSON.parse(raw) as CvSetup) : null;
  } catch {
    return null;
  }
}