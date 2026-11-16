"use client";

import { useEffect, useRef, useState } from "react";
import type { CvSetup } from "@/app/dashboard/dashComponents/CvHome/cvSetup";

// ---- step 1: personal information ----

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  // A small JPEG as a data URL, or "" for no photo
  photo: string;
}

export const EMPTY_PERSONAL: PersonalInfo = {
  firstName: "",
  lastName: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  photo: "",
};

// The fields that can show an error, in the order they appear on the page.
// The first one with an error gets the keyboard focus.
export type PersonalField = "firstName" | "lastName" | "headline" | "email" | "phone";
export type PersonalErrors = Partial<Record<PersonalField, string>>;
export const PERSONAL_FIELD_ORDER: PersonalField[] = [
  "firstName",
  "lastName",
  "headline",
  "email",
  "phone",
];
export const PERSONAL_FIELD_IDS: Record<PersonalField, string> = {
  firstName: "cv-first-name",
  lastName: "cv-last-name",
  headline: "cv-headline",
  email: "cv-email",
  phone: "cv-phone",
};

export function validatePersonal(p: PersonalInfo): PersonalErrors {
  const errors: PersonalErrors = {};
  if (!p.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!p.lastName.trim()) errors.lastName = "Enter your last name.";
  if (p.headline.trim().length < 2) errors.headline = "Enter a professional headline.";

  const email = p.email.trim();
  if (!email) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";

  const phone = p.phone.trim();
  if (phone && phone.replace(/\D/g, "").length < 6) errors.phone = "Enter a valid phone number.";

  return errors;
}

// What the Suggest button puts in the headline: the chosen role, with
// "Junior" or "Senior" in front when that level was chosen. This is plain
// code, not AI. The AI version comes later and replaces this function.
export function buildHeadlineSuggestion(setup: CvSetup | null): string {
  if (!setup?.occupation) return "";
  const prefix =
    setup.experienceId === "junior" ? "Junior " : setup.experienceId === "senior" ? "Senior " : "";
  return `${prefix}${setup.occupation}`;
}



export const CV_DRAFT_KEY = "cvBuilderDraft";
export const LAST_STEP_INDEX = 5;

export interface CvDraft {
  stepIndex: number;
  personal: PersonalInfo;
}

// Browser only: call from effects and click handlers, never during render.
export function readCvDraft(): CvDraft | null {
  try {
    const raw = sessionStorage.getItem(CV_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const stepIndex = Number.isInteger(parsed?.stepIndex)
      ? Math.min(Math.max(parsed.stepIndex, 0), LAST_STEP_INDEX)
      : 0;
    // The spread fills in any field an older draft doesn't have yet
    return { stepIndex, personal: { ...EMPTY_PERSONAL, ...(parsed?.personal ?? {}) } };
  } catch {
    return null;
  }
}

export function writeCvDraft(draft: CvDraft): boolean {
  try {
    sessionStorage.setItem(CV_DRAFT_KEY, JSON.stringify(draft));
    return true;
  } catch {
    // Storage can be full or blocked, for example in private browsing
    return false;
  }
}

export type DraftStatus = "idle" | "saved" | "error";

// Saves the draft 0.6 seconds after the last change, and once more when the
// page is left, so a quick edit isn't lost. Pass enabled=false until the
// draft has been read, or the empty form would overwrite it.
export function useCvDraftSaver(draft: CvDraft, enabled: boolean): DraftStatus {
  const [status, setStatus] = useState<DraftStatus>("idle");
  const latest = useRef(draft);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    latest.current = draft;
    enabledRef.current = enabled;
  });

  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => setStatus(writeCvDraft(draft) ? "saved" : "error"), 600);
    return () => clearTimeout(timer);
  }, [draft, enabled]);

  useEffect(
    () => () => {
      if (enabledRef.current) writeCvDraft(latest.current);
    },
    []
  );

  return status;
}