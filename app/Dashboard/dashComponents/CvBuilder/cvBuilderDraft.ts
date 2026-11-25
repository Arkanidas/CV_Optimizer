"use client";

import { useEffect, useRef, useState } from "react";
import type { CvSetup } from "@/app/dashboard/dashComponents/CvHome/cvSetup";

// ============================================================
// SHARED HELPERS
// ============================================================

export const DESCRIPTION_MAX = 500;

// "YYYY-MM", with a month from 01 to 12
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

function newId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  );
}

// Reads a text from storage without trusting its type, and cuts it to length
const cleanText = (value: unknown, max: number) =>
  typeof value === "string" ? value.slice(0, max) : "";

// Reads a month from storage: "YYYY-MM", or "" when it isn't one
const cleanMonth = (value: unknown) =>
  typeof value === "string" && MONTH_PATTERN.test(value) ? value : "";

// "2026-11", the month it is now
function thisMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// ============================================================
// STEP 1: PERSONAL INFORMATION
// ============================================================

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

// ============================================================
// STEP 2: WORK EXPERIENCE
// ============================================================

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

// True when every required field is filled in and the dates make sense. The
// number badge on an entry lights up when this is true and the entry is closed.
export function isExperienceComplete(e: WorkExperience): boolean {
  return Object.keys(validateExperience(e)).length === 0;
}

// Reads one entry from storage without trusting its shape
function normalizeExperience(raw: unknown): WorkExperience | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  return {
    id: typeof r.id === "string" && r.id ? r.id.slice(0, 100) : newId(),
    jobTitle: cleanText(r.jobTitle, 80),
    company: cleanText(r.company, 80),
    fromMonth: cleanMonth(r.fromMonth),
    toMonth: cleanMonth(r.toMonth),
    current: r.current === true,
    location: cleanText(r.location, 80),
    description: cleanText(r.description, DESCRIPTION_MAX),
  };
}

// ============================================================
// STEP 3: EDUCATION
// ============================================================

// graduated:  finished, with a graduation date
// ongoing:    still studying, the end date is the expected graduation date
// incomplete: stopped before finishing, the end date is when they left
export type EducationStatus = "graduated" | "ongoing" | "incomplete";

export const EDUCATION_TYPES = [
  { value: "high-school", label: "High School" },
  { value: "vocational", label: "Vocational Education" },
  { value: "certification", label: "Certification / Course" },
  { value: "university", label: "University Studies" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate (PhD)" },
  { value: "other", label: "Other" },
];

export const educationTypeLabel = (value: string): string =>
  EDUCATION_TYPES.find((t) => t.value === value)?.label ?? "";

export interface EducationEntry {
  id: string;
  // One of EDUCATION_TYPES, or "" when not chosen
  type: string;
  institution: string;
  // Field of study or qualification, for example "Computer Science"
  field: string;
  location: string;
  // "YYYY-MM", or "" when not chosen
  fromMonth: string;
  toMonth: string;
  status: EducationStatus;
  description: string;
}

// How many educations can be added
export const MAX_EDUCATIONS = 8;

export function createEducation(): EducationEntry {
  return {
    id: newId(),
    type: "",
    institution: "",
    field: "",
    location: "",
    fromMonth: "",
    toMonth: "",
    status: "graduated",
    description: "",
  };
}

// An entry nobody has touched. It's ignored when moving on.
export function isEducationEmpty(e: EducationEntry): boolean {
  return (
    !e.type &&
    !e.institution.trim() &&
    !e.field.trim() &&
    !e.location.trim() &&
    !e.fromMonth &&
    !e.toMonth &&
    e.status === "graduated" &&
    !e.description.trim()
  );
}

// The entries that count, most recent first. Use this when the CV is generated.
export function filledEducation(list: EducationEntry[]): EducationEntry[] {
  return sortEducationNewestFirst(list.filter((e) => !isEducationEmpty(e)));
}

export type EducationField = "type" | "institution" | "from" | "to";
export type EducationErrors = Partial<Record<EducationField, string>>;
// The required fields, in the order they appear. The first one with an error
// gets the keyboard focus.
export const EDUCATION_FIELD_ORDER: EducationField[] = ["type", "institution", "from", "to"];

// The id of an input, so the page can focus it
export const educationFieldId = (
  entryId: string,
  field: EducationField | "field" | "location" | "description"
) => `edu-${entryId}-${field}`;

export function validateEducation(e: EducationEntry): EducationErrors {
  const errors: EducationErrors = {};
  if (!e.type) errors.type = "Choose a type of education.";
  if (e.institution.trim().length < 2) errors.institution = "Enter a school or institution.";
  if (!e.fromMonth) errors.from = "Choose a start date.";

  if (!e.toMonth) {
    errors.to =
      e.status === "ongoing" ? "Choose your expected graduation date." : "Choose an end date.";
  } else if (e.fromMonth && e.toMonth < e.fromMonth) {
    errors.to = "The end date can't be before the start date.";
  } else if (e.status !== "ongoing" && e.toMonth > thisMonth()) {
    errors.to = 'The end date can\'t be in the future. Choose "Still studying" for an expected date.';
  }
  return errors;
}

export function isEducationComplete(e: EducationEntry): boolean {
  return Object.keys(validateEducation(e)).length === 0;
}

// The most recent education first. Someone still studying counts as the most
// recent. Entries without dates end up last, in the order they were added.
export function sortEducationNewestFirst(list: EducationEntry[]): EducationEntry[] {
  const endOf = (e: EducationEntry) => (e.status === "ongoing" ? "9999-12" : e.toMonth);
  const descending = (a: string, b: string) => (a < b ? 1 : a > b ? -1 : 0);
  return [...list].sort(
    (a, b) => descending(endOf(a), endOf(b)) || descending(a.fromMonth, b.fromMonth)
  );
}

// Reads one entry from storage without trusting its shape
function normalizeEducation(raw: unknown): EducationEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  // Local constants, so TypeScript can narrow them inside the callback below
  const rawType = r.type;
  const type =
    typeof rawType === "string" && EDUCATION_TYPES.some((t) => t.value === rawType) ? rawType : "";
  const status: EducationStatus =
    r.status === "ongoing" ? "ongoing" : r.status === "incomplete" ? "incomplete" : "graduated";

  return {
    id: typeof r.id === "string" && r.id ? r.id.slice(0, 100) : newId(),
    type,
    institution: cleanText(r.institution, 80),
    field: cleanText(r.field, 80),
    location: cleanText(r.location, 80),
    fromMonth: cleanMonth(r.fromMonth),
    toMonth: cleanMonth(r.toMonth),
    status,
    description: cleanText(r.description, DESCRIPTION_MAX),
  };
}

// ============================================================
// STEP 4: SKILLS AND EXPERTISE
// ============================================================

// How many of each can be added. These are only here to keep the draft a
// sensible size. The limits that depend on the subscription tier come later,
// with the AI recommendations.
export const MAX_TECHNICAL_SKILLS = 30;
export const MAX_COMPETENCES = 15;
export const MAX_SOFT_SKILLS = 15;
export const SKILL_NAME_MAX = 40;

export interface SkillsData {
  technical: string[];
  competences: string[];
  soft: string[];
}

export const EMPTY_SKILLS: SkillsData = { technical: [], competences: [], soft: [] };

export const sameSkill = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
export const hasSkill = (list: string[], name: string) => list.some((s) => sameSkill(s, name));

// Adds names to a list. Empty names and duplicates (ignoring capital letters)
// are skipped, and it stops when the list is full.
export function addSkills(list: string[], names: string[], max: number): string[] {
  const next = [...list];
  for (const raw of names) {
    const name = raw.trim().slice(0, SKILL_NAME_MAX);
    if (!name || hasSkill(next, name)) continue;
    if (next.length >= max) break;
    next.push(name);
  }
  return next;
}

export function countSkills(skills: SkillsData): number {
  return skills.technical.length + skills.competences.length + skills.soft.length;
}

// Reads one list from storage without trusting its shape
function normalizeSkillList(raw: unknown, max: number): string[] {
  if (!Array.isArray(raw)) return [];
  return addSkills([], raw.filter((item): item is string => typeof item === "string"), max);
}

// ============================================================
// STEP 5: ADDITIONAL INFORMATION
// (languages, driving licenses, and the optional sections)
// ============================================================

// ---- languages ----

export const LANGUAGE_LEVELS = [
  { value: "native", label: "Native" },
  { value: "fluent", label: "Fluent" },
  { value: "intermediate", label: "Intermediate" },
  { value: "basic", label: "Basic" },
];

export interface LanguageEntry {
  id: string;
  name: string;
  // One of LANGUAGE_LEVELS
  level: string;
}

export const MAX_LANGUAGES = 10;
export const LANGUAGE_NAME_MAX = 40;

// A new entry: the name is trimmed and gets a capital first letter
export function createLanguage(name: string, level: string): LanguageEntry {
  const trimmed = name.trim().slice(0, LANGUAGE_NAME_MAX);
  return { id: newId(), name: trimmed.charAt(0).toUpperCase() + trimmed.slice(1), level };
}

export const hasLanguage = (list: LanguageEntry[], name: string) =>
  list.some((l) => l.name.trim().toLowerCase() === name.trim().toLowerCase());

// ---- driving licenses ----

// The categories that can be added. To add or rename one, edit this list; the
// rows on the page stay in this order.
export const LICENSE_CATEGORIES = [
  { code: "AM", name: "Moped" },
  { code: "A1", name: "Light Motorcycle" },
  { code: "A2", name: "Medium Motorcycle" },
  { code: "A", name: "Motorcycle" },
  { code: "B", name: "Passenger Cars" },
  { code: "BE", name: "Cars with Trailer" },
  { code: "C1", name: "Medium Trucks" },
  { code: "C1E", name: "Medium Trucks with Trailer" },
  { code: "C", name: "Heavy Trucks" },
  { code: "CE", name: "Heavy Trucks with Trailer" },
  { code: "D1", name: "Minibus" },
  { code: "D1E", name: "Minibus with Trailer" },
  { code: "D", name: "Bus" },
  { code: "DE", name: "Bus with Trailer" },
  { code: "T", name: "Tractor" },
];

// "B" becomes "B – Passenger Cars"
export function licenseLabel(code: string): string {
  const category = LICENSE_CATEGORIES.find((c) => c.code === code);
  return category ? `${category.code} – ${category.name}` : code;
}

export interface LicenseEntry {
  id: string;
  // One of the codes in LICENSE_CATEGORIES. Each code appears once.
  category: string;
  // Additional qualifications or endorsements, for example "Code 95, ADR"
  extras: string;
}

export const LICENSE_EXTRAS_MAX = 80;

export function createLicense(category: string): LicenseEntry {
  return { id: newId(), category, extras: "" };
}

// Keeps the licenses in the order of LICENSE_CATEGORIES
export function sortLicenses(list: LicenseEntry[]): LicenseEntry[] {
  const position = (code: string) => LICENSE_CATEGORIES.findIndex((c) => c.code === code);
  return [...list].sort((a, b) => position(a.category) - position(b.category));
}

// The id of the endorsements input, so the page can focus it
export const licenseExtrasId = (id: string) => `license-${id}-extras`;

// ---- optional sections: volunteer experience, memberships, achievements ----

export type ExtraKind = "volunteer" | "membership" | "achievement";
export const EXTRA_KINDS: ExtraKind[] = ["volunteer", "membership", "achievement"];

// One entry in any of the three sections
export interface ExtraEntry {
  id: string;
  // The main text: the role or activity (volunteer), the association
  // (membership) or the award or title (achievement)
  title: string;
  // The second text, optional: the organization (volunteer), the type of
  // membership or role (membership), or who awarded it (achievement)
  detail: string;
  // "YYYY-MM". For an achievement this is the one date it was received.
  fromMonth: string;
  // The end date. Not used by an achievement.
  toMonth: string;
  // Ongoing. Never true for an achievement.
  current: boolean;
  description: string;
}

// How many entries each section can hold
export const MAX_EXTRAS_PER_SECTION = 5;
export const EXTRA_TEXT_MAX = 80;

export function createExtra(): ExtraEntry {
  return {
    id: newId(),
    title: "",
    detail: "",
    fromMonth: "",
    toMonth: "",
    current: false,
    description: "",
  };
}

// An entry nobody has touched. It's ignored when moving on.
export function isExtraEmpty(e: ExtraEntry): boolean {
  return (
    !e.title.trim() &&
    !e.detail.trim() &&
    !e.fromMonth &&
    !e.toMonth &&
    !e.current &&
    !e.description.trim()
  );
}

export type ExtraField = "title" | "from" | "to";
export type ExtraErrors = Partial<Record<ExtraField, string>>;
// The required fields, in the order they appear. The first one with an error
// gets the keyboard focus.
export const EXTRA_FIELD_ORDER: ExtraField[] = ["title", "from", "to"];

// The id of an input, so the page can focus it
export const extraFieldId = (entryId: string, field: ExtraField | "detail" | "description") =>
  `extra-${entryId}-${field}`;

const EXTRA_TITLE_ERROR: Record<ExtraKind, string> = {
  volunteer: "Enter your role or activity.",
  membership: "Enter the association or organization.",
  achievement: "Enter the achievement, award or title.",
};

export function validateExtra(kind: ExtraKind, e: ExtraEntry): ExtraErrors {
  const errors: ExtraErrors = {};
  if (e.title.trim().length < 2) errors.title = EXTRA_TITLE_ERROR[kind];

  // An achievement has one date: when it was received
  if (kind === "achievement") {
    if (!e.fromMonth) errors.from = "Choose the date you received it.";
    else if (e.fromMonth > thisMonth()) errors.from = "The date can't be in the future.";
    return errors;
  }

  if (!e.fromMonth) errors.from = "Choose a start date.";
  if (!e.current) {
    if (!e.toMonth) errors.to = "Choose an end date, or mark it as ongoing.";
    else if (e.fromMonth && e.toMonth < e.fromMonth) {
      errors.to = "The end date can't be before the start date.";
    }
  }
  return errors;
}

export interface ExtrasData {
  // Which sections are open (their pill is lit)
  active: Record<ExtraKind, boolean>;
  // The entries of every section. A section that's closed keeps its entries,
  // so nothing is lost by closing it, but they don't count for the CV.
  entries: Record<ExtraKind, ExtraEntry[]>;
}

export const EMPTY_EXTRAS: ExtrasData = {
  active: { volunteer: false, membership: false, achievement: false },
  entries: { volunteer: [], membership: [], achievement: [] },
};

// The entries of a section that count for the CV: it has to be open, and
// entries nobody touched are skipped. Use this when the CV is generated.
export function filledExtras(extras: ExtrasData, kind: ExtraKind): ExtraEntry[] {
  return extras.active[kind] ? extras.entries[kind].filter((e) => !isExtraEmpty(e)) : [];
}

// Reads one entry from storage without trusting its shape
function normalizeExtraEntry(raw: unknown, kind: ExtraKind): ExtraEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const isAchievement = kind === "achievement";

  return {
    id: typeof r.id === "string" && r.id ? r.id.slice(0, 100) : newId(),
    title: cleanText(r.title, EXTRA_TEXT_MAX),
    detail: cleanText(r.detail, EXTRA_TEXT_MAX),
    fromMonth: cleanMonth(r.fromMonth),
    toMonth: isAchievement ? "" : cleanMonth(r.toMonth),
    current: !isAchievement && r.current === true,
    description: cleanText(r.description, DESCRIPTION_MAX),
  };
}

// Reads the optional sections from storage without trusting their shape. An
// older draft has none, which gives three closed, empty sections.
function normalizeExtras(raw: unknown): ExtrasData {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const activeSource =
    source.active && typeof source.active === "object" ? (source.active as Record<string, unknown>) : {};
  const entriesSource =
    source.entries && typeof source.entries === "object"
      ? (source.entries as Record<string, unknown>)
      : {};

  const result: ExtrasData = {
    active: { ...EMPTY_EXTRAS.active },
    entries: { volunteer: [], membership: [], achievement: [] },
  };

  for (const kind of EXTRA_KINDS) {
    result.active[kind] = activeSource[kind] === true;

    const list = entriesSource[kind];
    result.entries[kind] = Array.isArray(list)
      ? list
          .map((item) => normalizeExtraEntry(item, kind))
          .filter((e): e is ExtraEntry => e !== null)
          .slice(0, MAX_EXTRAS_PER_SECTION)
      : [];
  }
  return result;
}

// ---- the whole step ----

export interface AdditionalData {
  languages: LanguageEntry[];
  licenses: LicenseEntry[];
  extras: ExtrasData;
}

export const EMPTY_ADDITIONAL: AdditionalData = {
  languages: [],
  licenses: [],
  extras: EMPTY_EXTRAS,
};

// Reads the languages from storage without trusting their shape
function normalizeLanguages(raw: unknown): LanguageEntry[] {
  if (!Array.isArray(raw)) return [];
  const result: LanguageEntry[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;

    const name = cleanText(r.name, LANGUAGE_NAME_MAX).trim();
    if (!name || hasLanguage(result, name)) continue;

    // Local constant, so TypeScript can narrow it inside the callback below
    const rawLevel = r.level;
    const level =
      typeof rawLevel === "string" && LANGUAGE_LEVELS.some((l) => l.value === rawLevel)
        ? rawLevel
        : "intermediate";

    result.push({
      id: typeof r.id === "string" && r.id ? r.id.slice(0, 100) : newId(),
      name,
      level,
    });
    if (result.length >= MAX_LANGUAGES) break;
  }
  return result;
}

// Reads the licenses from storage without trusting their shape
function normalizeLicenses(raw: unknown): LicenseEntry[] {
  if (!Array.isArray(raw)) return [];
  const result: LicenseEntry[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;

    const rawCategory = r.category;
    const category =
      typeof rawCategory === "string" && LICENSE_CATEGORIES.some((c) => c.code === rawCategory)
        ? rawCategory
        : "";
    if (!category || result.some((l) => l.category === category)) continue;

    result.push({
      id: typeof r.id === "string" && r.id ? r.id.slice(0, 100) : newId(),
      category,
      extras: cleanText(r.extras, LICENSE_EXTRAS_MAX),
    });
  }
  return sortLicenses(result);
}

// ============================================================
// THE DRAFT, SAVED IN THE BROWSER SESSION
// ============================================================

export const CV_DRAFT_KEY = "cvBuilderDraft";
export const LAST_STEP_INDEX = 5;

export interface CvDraft {
  stepIndex: number;
  personal: PersonalInfo;
  experiences: WorkExperience[];
  education: EducationEntry[];
  skills: SkillsData;
  additional: AdditionalData;
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

    // An older draft has no education yet, which gives an empty list
    const education = Array.isArray(parsed?.education)
      ? parsed.education
          .map(normalizeEducation)
          .filter((e: EducationEntry | null): e is EducationEntry => e !== null)
          .slice(0, MAX_EDUCATIONS)
      : [];

    const skills: SkillsData = {
      technical: normalizeSkillList(parsed?.skills?.technical, MAX_TECHNICAL_SKILLS),
      competences: normalizeSkillList(parsed?.skills?.competences, MAX_COMPETENCES),
      soft: normalizeSkillList(parsed?.skills?.soft, MAX_SOFT_SKILLS),
    };

    // An older draft has no additional information yet: empty lists, and
    // three closed optional sections
    const additional: AdditionalData = {
      languages: normalizeLanguages(parsed?.additional?.languages),
      licenses: normalizeLicenses(parsed?.additional?.licenses),
      extras: normalizeExtras(parsed?.additional?.extras),
    };

    // The spread fills in any field an older draft doesn't have yet
    return {
      stepIndex,
      personal: { ...EMPTY_PERSONAL, ...(parsed?.personal ?? {}) },
      experiences,
      education,
      skills,
      additional,
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