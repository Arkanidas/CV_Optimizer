"use client";

import type { ReactNode } from "react";
import { Briefcase, GraduationCap, Layers, Link2, Mail, MapPin, Phone, PlusCircle, User } from "lucide-react";
import ReviewSection from "./ReviewSection";
import { EXTRA_SECTIONS } from "./ExtraSectionCard";
import { formatMonth } from "./MonthField";
import {
  LANGUAGE_LEVELS,
  educationTypeLabel,
  filledEducation,
  filledExperiences,
  filledExtras,
  licenseLabel,
  validateEducation,
  validateExperience,
  validateExtra,
  validatePersonal,
  type AdditionalData,
  type EducationEntry,
  type PersonalInfo,
  type SkillsData,
  type WorkExperience,
} from "./cvBuilderDraft";

// The sections that have an Edit button. The page turns each into a step.
export type ReviewSectionId = "personal" | "work" | "education" | "skills" | "additional";

const MISSING = "Some required information is missing here. Press Edit to complete it.";

// "Mar 2022 – Present", or "Mar 2022 – Nov 2024"
function formatRange(from: string, to: string, current: boolean): string {
  const start = formatMonth(from);
  const end = current ? "Present" : formatMonth(to);
  return [start, end].filter(Boolean).join(" – ");
}

// The dates of an education, with its status: "(expected)" while still
// studying, "Not completed" when it was left unfinished
function educationDates(e: EducationEntry): string {
  const from = formatMonth(e.fromMonth);
  const to = formatMonth(e.toMonth);
  const range = [from, to].filter(Boolean).join(" – ");

  if (e.status === "ongoing") {
    if (from && to) return `${from} – ${to} (expected)`;
    if (to) return `Expected ${to}`;
    return from ? `${from} – Present` : "";
  }
  if (e.status === "incomplete") return range ? `${range} · Not completed` : "";
  return range;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const hasErrors = (errors: object) => Object.keys(errors).length > 0;

// ---- small building blocks ----

// A read-only chip. Light: violet-100 with violet-800 text.
function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-violet-400/30 bg-violet-500/15 px-3.5 py-1.5 text-sm font-medium text-violet-100 light:border-violet-300 light:bg-violet-100 light:text-violet-800">
      {children}
    </span>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-sm font-semibold text-white light:text-stone-900">{children}</p>;
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="text-sm text-white/55 light:text-stone-500">{children}</p>;
}

// A list of entries with a line between them
function EntryList({ children }: { children: ReactNode }) {
  return <ul className="divide-y divide-white/10 light:divide-stone-300">{children}</ul>;
}

const ENTRY_ROW = "py-5 first:pt-0 last:pb-0";
const TITLE = "text-lg font-semibold text-white light:text-stone-900";
const SUBTITLE = "mt-0.5 text-sm text-white/65 light:text-stone-600";
const DATES = "mt-0.5 text-sm text-white/45 light:text-stone-500";
const BODY = "mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/70 light:text-stone-700";

// ---- the step ----

interface ReviewStepProps {
  personal: PersonalInfo;
  experiences: WorkExperience[];
  education: EducationEntry[];
  skills: SkillsData;
  additional: AdditionalData;
  onEdit: (section: ReviewSectionId) => void;
}

export default function ReviewStep({
  personal,
  experiences,
  education,
  skills,
  additional,
  onEdit,
}: ReviewStepProps) {
  // Only what will be on the CV: untouched entries are skipped, education is
  // most recent first, and a closed optional section isn't included
  const jobs = filledExperiences(experiences);
  const schools = filledEducation(education);
  const extraGroups = EXTRA_SECTIONS.map((config) => ({
    config,
    entries: filledExtras(additional.extras, config.kind),
  })).filter((group) => group.entries.length > 0);

  const skillGroups = [
    { label: "Technical skills", items: skills.technical },
    { label: "Core competences", items: skills.competences },
    { label: "Soft skills", items: skills.soft },
  ].filter((group) => group.items.length > 0);
  const skillCount = skills.technical.length + skills.competences.length + skills.soft.length;

  // Required information that is missing. Each step checks this when Next is
  // pressed, so it normally never shows, but an old draft could still need it.
  const personalMissing = hasErrors(validatePersonal(personal));
  const jobsMissing = jobs.some((e) => hasErrors(validateExperience(e)));
  const schoolsMissing = schools.some((e) => hasErrors(validateEducation(e)));
  const additionalMissing = extraGroups.some((group) =>
    group.entries.some((e) => hasErrors(validateExtra(group.config.kind, e)))
  );

  const fullName = `${personal.firstName} ${personal.lastName}`.trim();
  const contact = [
    { icon: Mail, label: "Email", value: personal.email },
    { icon: Phone, label: "Phone", value: personal.phone },
    { icon: MapPin, label: "Location", value: personal.location },
    { icon: Link2, label: "LinkedIn", value: personal.linkedin },
  ].filter((item) => item.value.trim());

  const hasAdditional =
    additional.languages.length > 0 || additional.licenses.length > 0 || extraGroups.length > 0;
  const additionalSummary = [
    additional.languages.length > 0 && plural(additional.languages.length, "language", "languages"),
    additional.licenses.length > 0 && plural(additional.licenses.length, "license", "licenses"),
    extraGroups.length > 0 &&
      plural(
        extraGroups.reduce((sum, group) => sum + group.entries.length, 0),
        "optional entry",
        "optional entries"
      ),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    // @container makes the layout inside follow the width of THIS section, not
    // the window, so it also works with the sidebar open or closed.
    <section className="@container flex flex-col gap-5">
      {/* 1. PERSONAL INFORMATION */}
      <ReviewSection
        icon={User}
        title="Personal Information"
        description="Your contact details"
        warning={personalMissing ? MISSING : undefined}
        onEdit={() => onEdit("personal")}
      >
        <div className="flex items-center gap-5">
          {personal.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={personal.photo}
              alt="Your profile photo"
              className="h-20 w-20 shrink-0 rounded-full border-2 border-violet-400/60 object-cover light:border-violet-500"
            />
          )}
          <div className="min-w-0">
            <p className="truncate text-2xl font-bold text-white light:text-stone-900">
              {fullName || "Name not filled in"}
            </p>
            {personal.headline.trim() && (
              <p className="mt-1 text-base text-white/70 light:text-stone-600">{personal.headline}</p>
            )}
          </div>
        </div>

        {contact.length > 0 && (
          <dl className="mt-5 grid gap-x-8 gap-y-4 @lg:grid-cols-2">
            {contact.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-300 light:text-violet-600" />
                  <div className="min-w-0">
                    <dt className="text-xs text-white/50 light:text-stone-500">{item.label}</dt>
                    <dd className="break-words text-sm text-white light:text-stone-900">{item.value}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        )}
      </ReviewSection>

      {/* 2. WORK EXPERIENCE */}
      <ReviewSection
        icon={Briefcase}
        title="Work Experience"
        description={jobs.length > 0 ? plural(jobs.length, "position", "positions") : "Nothing added"}
        warning={jobsMissing ? MISSING : undefined}
        onEdit={() => onEdit("work")}
      >
        {jobs.length > 0 ? (
          <EntryList>
            {jobs.map((job) => (
              <li key={job.id} className={ENTRY_ROW}>
                <p className={TITLE}>{job.jobTitle.trim() || "Position without a title"}</p>
                {[job.company.trim(), job.location.trim()].some(Boolean) && (
                  <p className={SUBTITLE}>
                    {[job.company.trim(), job.location.trim()].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className={DATES}>{formatRange(job.fromMonth, job.toMonth, job.current)}</p>
                {job.description.trim() && <p className={BODY}>{job.description}</p>}
              </li>
            ))}
          </EntryList>
        ) : (
          <Empty>No work experience added.</Empty>
        )}
      </ReviewSection>

      {/* 3. EDUCATION */}
      <ReviewSection
        icon={GraduationCap}
        title="Education"
        description={schools.length > 0 ? plural(schools.length, "education", "educations") : "Nothing added"}
        warning={schoolsMissing ? MISSING : undefined}
        onEdit={() => onEdit("education")}
      >
        {schools.length > 0 ? (
          <EntryList>
            {schools.map((school) => {
              const typeLabel = educationTypeLabel(school.type);
              const field = school.field.trim();
              const subtitle = [field ? typeLabel : "", school.institution.trim(), school.location.trim()]
                .filter(Boolean)
                .join(" · ");

              return (
                <li key={school.id} className={ENTRY_ROW}>
                  <p className={TITLE}>{field || typeLabel || "Education"}</p>
                  {subtitle && <p className={SUBTITLE}>{subtitle}</p>}
                  <p className={DATES}>{educationDates(school)}</p>
                  {school.description.trim() && <p className={BODY}>{school.description}</p>}
                </li>
              );
            })}
          </EntryList>
        ) : (
          <Empty>No education added.</Empty>
        )}
      </ReviewSection>

      {/* 4. SKILLS & EXPERTISE */}
      <ReviewSection
        icon={Layers}
        title="Skills & Expertise"
        description={
          skillCount > 0 ? plural(skillCount, "skill or competence", "skills and competences") : "Nothing added"
        }
        onEdit={() => onEdit("skills")}
      >
        {skillGroups.length > 0 ? (
          <div className="flex flex-col gap-6">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <GroupLabel>{group.label}</GroupLabel>
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty>No skills added.</Empty>
        )}
      </ReviewSection>

      {/* 5. ADDITIONAL INFORMATION */}
      <ReviewSection
        icon={PlusCircle}
        title="Additional Information"
        description={hasAdditional ? additionalSummary : "Nothing added"}
        warning={additionalMissing ? MISSING : undefined}
        onEdit={() => onEdit("additional")}
      >
        {hasAdditional ? (
          <div className="flex flex-col gap-6">
            {additional.languages.length > 0 && (
              <div>
                <GroupLabel>Languages</GroupLabel>
                <div className="flex flex-wrap gap-2.5">
                  {additional.languages.map((language) => (
                    <Chip key={language.id}>
                      {language.name}
                      <span className="ml-2 font-normal opacity-70">
                        {LANGUAGE_LEVELS.find((l) => l.value === language.level)?.label ?? language.level}
                      </span>
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {additional.licenses.length > 0 && (
              <div>
                <GroupLabel>Driving licenses</GroupLabel>
                <div className="flex flex-wrap gap-2.5">
                  {additional.licenses.map((license) => (
                    <Chip key={license.id}>
                      {licenseLabel(license.category)}
                      {license.extras.trim() && (
                        <span className="ml-2 font-normal opacity-70">{license.extras.trim()}</span>
                      )}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {extraGroups.map(({ config, entries }) => (
              <div key={config.kind}>
                <GroupLabel>{config.label}</GroupLabel>
                <EntryList>
                  {entries.map((entry) => {
                    // An achievement has one date, the others a range
                    const dates = config.range
                      ? formatRange(entry.fromMonth, entry.toMonth, entry.current)
                      : formatMonth(entry.fromMonth);
                    const line = [entry.detail.trim(), dates].filter(Boolean).join(" · ");

                    return (
                      <li key={entry.id} className={ENTRY_ROW}>
                        <p className="text-base font-semibold text-white light:text-stone-900">
                          {entry.title.trim() || "Entry without a title"}
                        </p>
                        {line && <p className={SUBTITLE}>{line}</p>}
                        {entry.description.trim() && <p className={BODY}>{entry.description}</p>}
                      </li>
                    );
                  })}
                </EntryList>
              </div>
            ))}
          </div>
        ) : (
          <Empty>No additional information added.</Empty>
        )}
      </ReviewSection>
    </section>
  );
}