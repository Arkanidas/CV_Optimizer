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

// ---- step 2: work experience ----

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  // "YYYY-MM", or "" when not chosen
  fromMonth: string;
  toMonth: string;
  current: boolean;
  location: string;
  description: string;
}

// How many experiences can be added
export const MAX_EXPERIENCES = 10;
export const DESCRIPTION_MAX = 500;

function newId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  );
}

export function createExperience(): WorkExperience {
  return {
    id: newId(),
    jobTitle: "",
    company: "",
    fromMonth: "",
    toMonth: "",
    current: false,
    location: "",
    description: "",
  };
}

// An entry nobody has touched. It's ignored when moving on, so a person with
// no work experience can skip the step.
export function isExperienceEmpty(e: WorkExperience): boolean {
  return (
    !e.jobTitle.trim() &&
    !e.company.trim() &&
    !e.fromMonth &&
    !e.toMonth &&
    !e.current &&
    !e.location.trim() &&
    !e.description.trim()
  );
}

// The entries that count, in the order the user arranged them. Use this when
// the CV is generated.
export function filledExperiences(list: WorkExperience[]): WorkExperience[] {
  return list.filter((e) => !isExperienceEmpty(e));
}

export type ExperienceField = "jobTitle" | "company" | "from" | "to";
export type ExperienceErrors = Partial<Record<ExperienceField, string>>;
export const EXPERIENCE_FIELD_ORDER: ExperienceField[] = ["jobTitle", "company", "from", "to"];

// The id of an input, so the page can focus the first one with an error
export const experienceFieldId = (entryId: string, field: ExperienceField) =>
  `exp-${entryId}-${field}`;

// The ids of the move buttons, so focus can stay on them after a move
export const experienceControlId = (entryId: string, control: "up" | "down") =>
  `exp-${entryId}-${control}`;

export function validateExperience(e: WorkExperience): ExperienceErrors {
  const errors: ExperienceErrors = {};
  if (e.jobTitle.trim().length < 2) errors.jobTitle = "Enter a job title.";
  if (e.company.trim().length < 2) errors.company = "Enter a company.";
  if (!e.fromMonth) errors.from = "Choose a start date.";

  if (!e.current) {
    if (!e.toMonth) errors.to = 'Choose an end date, or tick "Currently working here".';
    else if (e.fromMonth && e.toMonth < e.fromMonth) {
      errors.to = "The end date can't be before the start date.";
    }
  }
  return errors;
}

// Reads one entry from storage without trusting its shape
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const text = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : "");

function normalizeExperience(raw: unknown): WorkExperience | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const month = (value: unknown) =>
    typeof value === "string" && MONTH_PATTERN.test(value) ? value : "";

  return {
    id: typeof r.id === "string" && r.id ? r.id.slice(0, 100) : newId(),
    jobTitle: text(r.jobTitle, 80),
    company: text(r.company, 80),
    fromMonth: month(r.fromMonth),
    toMonth: month(r.toMonth),
    current: r.current === true,
    location: text(r.location, 80),
    description: text(r.description, DESCRIPTION_MAX),
  };
}

// ---- the draft, saved in the browser session ----

export const CV_DRAFT_KEY = "cvBuilderDraft";
export const LAST_STEP_INDEX = 5;

export interface CvDraft {
  stepIndex: number;
  personal: PersonalInfo;
  experiences: WorkExperience[];
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

    const experiences = Array.isArray(parsed?.experiences)
      ? parsed.experiences
          .map(normalizeExperience)
          .filter((e: WorkExperience | null): e is WorkExperience => e !== null)
          .slice(0, MAX_EXPERIENCES)
      : [];

    // The spread fills in any field an older draft doesn't have yet
    return {
      stepIndex,
      personal: { ...EMPTY_PERSONAL, ...(parsed?.personal ?? {}) },
      experiences,
    };
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