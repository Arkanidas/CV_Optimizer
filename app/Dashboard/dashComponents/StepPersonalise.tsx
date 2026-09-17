"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import ToneSelector from "@/components/ToneSelector";
import type { ToneOption } from "@/lib/AI/tiers";

interface StepPersonalizeQuestionsProps {
  whyCompany?: string;
  onWhyCompanyChange?: (value: string) => void;
  whyRole?: string;
  onWhyRoleChange?: (value: string) => void;
  additionalInfo?: string;
  onAdditionalInfoChange?: (value: string) => void;
  tone?: ToneOption | null;
  onToneChange?: (value: ToneOption | null) => void;
  onBack?: () => void;
  onContinue?: () => void;
}

export default function StepPersonalize({whyCompany = "", onWhyCompanyChange, whyRole = "",onWhyRoleChange,additionalInfo = "",onAdditionalInfoChange,tone = null, onToneChange, onBack, onContinue,}: StepPersonalizeQuestionsProps) {
  const { data: session } = useSession();
  const userTier = session?.user?.tier ?? "free";

  const [localWhyCompany, setLocalWhyCompany] = useState(whyCompany);
  const [localWhyRole, setLocalWhyRole] = useState(whyRole);
  const [localAdditionalInfo, setLocalAdditionalInfo] = useState(additionalInfo);
  const [localTone, setLocalTone] = useState<ToneOption | null>(tone);

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

  const canContinue = localTone !== null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-semibold text-white">Personalise your cover letter</h3>
        <p className="mt-1 text-sm text-white/50">
          A few honest answers here go a long way — this is what makes your letter sound like you, not a template.
        </p>
      </div>

      <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-1 mt-1 text-sm font-medium uppercase tracking-widest text-violet-300">Why this company?</h3>
        <p className="mb-4 ml-0.5 text-sm text-white/50">
          Explain in detail why you want to work for this company specifically - the more detailed & specific, the better outcome
        </p>
        <textarea
          value={localWhyCompany}
          required
          maxLength={550}
          onChange={handleWhyCompanyChange}
          rows={5}
          placeholder="I have followed the company for a while and I really like how you combine technology with sustainability. I also like that the role seems to involve working closely with both developers and designers "
          className={`mt-1 w-full resize-none rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 ${
            localWhyCompany.length >= 550
              ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30"
              : "border-white/10 focus:border-violet-400/50 focus:ring-violet-400/30"
          }`}
        />
        <p className="mt-2 self-end text-xs text-white/30">
          {localWhyCompany.length} / 550
        </p>
      </div>

      <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-1 mt-1 text-sm font-medium uppercase tracking-widest text-violet-300">Why this specific role?</h3>
        <p className="mb-4 ml-0.5 text-sm text-white/50">
          I like that this role combines frontend development with UX and that I would get to work on products used by many people.
        </p>
        <textarea
          value={localWhyRole}
          maxLength={550}
          required
          onChange={handleWhyRoleChange}
          rows={5}
          placeholder="I like that this role combines frontend development with UX and that I would get to work on products used by many people"
          className={`mt-1 w-full resize-none rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 ${
            localWhyRole.length >= 550
              ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30"
              : "border-white/10 focus:border-violet-400/50 focus:ring-violet-400/30"
          }`}
        />
        <p className="mt-2 self-end text-xs text-white/30">
          {localWhyRole.length} / 550
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
          maxLength={550}
          onChange={handleAdditionalInfoChange}
          rows={5}
          placeholder="I changed career direction after discovering that I enjoy technical problem-solving much more than my previous field."
          className={`mt-1 w-full resize-none rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 ${
            localAdditionalInfo.length >= 550
              ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30"
              : "border-white/10 focus:border-violet-400/50 focus:ring-violet-400/30"
          }`}
        />
        <p className="mt-2 self-end text-xs text-white/30">
          {localAdditionalInfo.length} / 550
        </p>
      </div>

      <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-1 mt-1 text-sm font-medium uppercase tracking-widest text-violet-300">
          Tone option:
        </h3>
        <p className="mb-4 ml-0.5 text-sm text-white/50">
          Choose the tone your cover letter should be written in.
        </p>
        <ToneSelector tier={userTier} selected={localTone} onSelect={handleToneSelect} />
        {!canContinue && (
          <p className="mt-3 text-xs text-white/30">Select a tone to continue.</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex w-fit cursor-pointer items-center gap-1.5 text-sm text-violet-300 transition hover:text-violet-200">
          <ArrowLeft className="h-4 w-4" />
            Back to Overview
          </button>
        ) : (
          <span />
        )}

        {onContinue && (
          <button
            onClick={onContinue}
            disabled={!canContinue}
            className="flex items-center rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
          >
            Continue
            <ArrowRight className="ml-2 mt-0.5 h-4.5 w-4.5" />
          </button>
        )}
      </div>
    </div>
  );
}