"use client";

import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ToneSelector from "@/components/ToneSelector";
import HighlightedQualifications from "@/components/HighlightedQualifications";
import { selectDisplayMatches } from "@/lib/matchCardSelection";
import type { ToneOption } from "@/lib/AI/tiers";
import type { MatchingResults } from "@/lib/AI/schemas";

interface StepPersonalizeQuestionsProps {
  whyCompany?: string;
  onWhyCompanyChange?: (value: string) => void;
  whyRole?: string;
  onWhyRoleChange?: (value: string) => void;
  additionalInfo?: string;
  onAdditionalInfoChange?: (value: string) => void;
  tone?: ToneOption | null;
  onToneChange?: (value: ToneOption | null) => void;
  matches?: MatchingResults;
  highlightedQualifications?: string[];
  onHighlightedQualificationsChange?: (ids: string[]) => void;
  onBack?: () => void;
  onContinue?: () => void;
}

const MIN_REQUIRED_LENGTH = 100;
const MAX_LENGTH = 550;
const MAX_HIGHLIGHTED = 4;

export default function StepPersonalize({
  whyCompany = "",
  onWhyCompanyChange,
  whyRole = "",
  onWhyRoleChange,
  additionalInfo = "",
  onAdditionalInfoChange,
  tone = null,
  onToneChange,
  matches,
  highlightedQualifications = [],
  onHighlightedQualificationsChange,
  onBack,
  onContinue,
}: StepPersonalizeQuestionsProps) {
  const { data: session } = useSession();
  const userTier = session?.user?.tier ?? "free";

  const [localWhyCompany, setLocalWhyCompany] = useState(whyCompany);
  const [localWhyRole, setLocalWhyRole] = useState(whyRole);
  const [localAdditionalInfo, setLocalAdditionalInfo] = useState(additionalInfo);
  const [localTone, setLocalTone] = useState<ToneOption | null>(tone);
  const [localHighlighted, setLocalHighlighted] = useState<string[]>(highlightedQualifications);
  const [attemptedContinue, setAttemptedContinue] = useState(false);

  useEffect(() => {
    if (!attemptedContinue) return;
    const timer = setTimeout(() => setAttemptedContinue(false), 7000);
    return () => clearTimeout(timer);
  }, [attemptedContinue]);


  useEffect(() => {
    onHighlightedQualificationsChange?.(localHighlighted);
  }, [localHighlighted]);

  function handleWhyCompanyChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setLocalWhyCompany(e.target.value);
    onWhyCompanyChange?.(e.target.value);
  }

  function handleWhyRoleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setLocalWhyRole(e.target.value);
    onWhyRoleChange?.(e.target.value);
  }

  function handleAdditionalInfoChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setLocalAdditionalInfo(e.target.value);
    onAdditionalInfoChange?.(e.target.value);
  }

  function handleToneSelect(value: ToneOption | null) {
    setLocalTone(value);
    onToneChange?.(value);
  }

  function handleToggleQualification(id: string) {
    setLocalHighlighted((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < MAX_HIGHLIGHTED
        ? [...prev, id]
        : prev;
      return next;
    });
  }

  const isWhyCompanyValid = localWhyCompany.trim().length >= MIN_REQUIRED_LENGTH;
  const isWhyRoleValid = localWhyRole.trim().length >= MIN_REQUIRED_LENGTH;
  const isToneValid = localTone !== null;
  const canContinue = isWhyCompanyValid && isWhyRoleValid && isToneValid;

  function handleContinueClick() {
    if (!canContinue) {
      setAttemptedContinue(true);
      return;
    }
    onContinue?.();
  }

  function requiredBorderClass(value: string, isValid: boolean) {
    const showInvalid = attemptedContinue && !isValid;
    const tooLong = value.length >= MAX_LENGTH;
    if (showInvalid || tooLong) {
      return "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30";
    }
    return "border-white/10 focus:border-violet-400/50 focus:ring-violet-400/30";
  }

  const { cards: displayCards } = matches
    ? selectDisplayMatches(matches, userTier)
    : { cards: [] };
  const matchedQualifications = displayCards
    .filter((c) => c.type !== "required-missing")
    .map((c) => c.match);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-semibold text-white">Personalise your cover letter</h3>
        <p className="mt-1 text-sm text-white/50">
          A few honest answers here go a long way — this is what makes your letter sound like you, not a template.
        </p>
        {attemptedContinue && !canContinue && (
          <p className="mt-2 text-sm font-medium text-red-400">
            All marked areas needs to be filled.
          </p>
        )}
      </div>

      <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-1 mt-1 text-sm font-medium uppercase tracking-widest text-violet-300">
          Why this company? <span className="text-red-400">*</span>
        </h3>
        <p className="mb-4 ml-0.5 text-sm text-white/50">
          Explain in detail why you want to work for this company specifically - the more detailed & specific, the better outcome
        </p>
        <textarea
          value={localWhyCompany}
          required
          maxLength={MAX_LENGTH}
          onChange={handleWhyCompanyChange}
          rows={5}
          placeholder="I have followed the company for a while and I really like how you combine technology with sustainability. I also like that the role seems to involve working closely with both developers and designers "
          className={`mt-1 w-full resize-none rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 ${requiredBorderClass(
            localWhyCompany,
            isWhyCompanyValid
          )}`}
        />
        <p className="mt-2 self-end text-xs text-white/30">
          {localWhyCompany.length} / {MAX_LENGTH} · min {MIN_REQUIRED_LENGTH}
        </p>
      </div>

      <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-1 mt-1 text-sm font-medium uppercase tracking-widest text-violet-300">
          Why this specific role? <span className="text-red-400">*</span>
        </h3>
        <p className="mb-4 ml-0.5 text-sm text-white/50">
          I like that this role combines frontend development with UX and that I would get to work on products used by many people.
        </p>
        <textarea
          value={localWhyRole}
          maxLength={MAX_LENGTH}
          required
          onChange={handleWhyRoleChange}
          rows={5}
          placeholder="I like that this role combines frontend development with UX and that I would get to work on products used by many people"
          className={`mt-1 w-full resize-none rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 ${requiredBorderClass(
            localWhyRole,
            isWhyRoleValid
          )}`}
        />
        <p className="mt-2 self-end text-xs text-white/30">
          {localWhyRole.length} / {MAX_LENGTH} · min {MIN_REQUIRED_LENGTH}
        </p>
      </div>

      <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-1 mt-1 flex flex-row text-sm font-medium uppercase tracking-widest text-violet-300">
          Anything else?
          <p className="ml-2 mt-0.5 text-xs text-white/30">(optional)</p>
        </h3>
        <p className="mb-4 ml-0.5 text-sm text-white/50">
          Is there anything else you'd like us to know that isn't obvious from your CV?
        </p>
        <textarea
          value={localAdditionalInfo}
          maxLength={MAX_LENGTH}
          onChange={handleAdditionalInfoChange}
          rows={5}
          placeholder="I changed career direction after discovering that I enjoy technical problem-solving much more than my previous field."
          className={`mt-1 w-full resize-none rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 ${
            localAdditionalInfo.length >= MAX_LENGTH
              ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30"
              : "border-white/10 focus:border-violet-400/50 focus:ring-violet-400/30"
          }`}
        />
        <p className="mt-2 self-end text-xs text-white/30">
          {localAdditionalInfo.length} / {MAX_LENGTH}
        </p>
      </div>

      <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-1 mt-1 text-sm font-medium uppercase tracking-widest text-violet-300">
          Tone option: <span className="text-red-400">*</span>
        </h3>
        <p className="mb-4 ml-0.5 text-sm text-white/50">
          Choose the tone your cover letter should be written in.
        </p>
        <ToneSelector tier={userTier} selected={localTone} onSelect={handleToneSelect} />
        {!isToneValid && (
          <p className="mt-3 text-xs text-white/30">Select a tone to continue.</p>
        )}
      </div>

      <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase tracking-widest text-violet-300">
            Highlighted qualifications
          </h3>
          <span className="text-xs font-medium text-white/40">
            {localHighlighted.length} / {MAX_HIGHLIGHTED}
          </span>
        </div>
        <p className="mb-4 ml-0.5 mt-1 text-sm text-white/50">
          Choose up to {MAX_HIGHLIGHTED} qualifications from your match to highlight in your cover letter.
        </p>
        {matchedQualifications.length > 0 ? (
          <HighlightedQualifications
            qualifications={matchedQualifications}
            selected={localHighlighted}
            onToggle={handleToggleQualification}
            maxSelectable={MAX_HIGHLIGHTED}
          />
        ) : (
          <p className="text-sm text-white/30">No matched qualifications available yet.</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex w-fit cursor-pointer items-center gap-1.5 text-sm text-violet-300 transition hover:text-violet-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Overview
          </button>
        ) : (
          <span />
        )}

        {onContinue && (
          <button
            onClick={handleContinueClick}
            className={`flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
              canContinue
                ? "cursor-pointer bg-violet-500 text-white hover:bg-violet-400"
                : "cursor-not-allowed bg-white/10 text-white/30"
            }`}
          >
            Generate
            <Sparkles className="ml-2 mt-0.5 h-4.5 w-4.5" />
          </button>
        )}
      </div>
    </div>
  );
}