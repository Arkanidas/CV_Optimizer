"use client";

import { Check, Lock } from "lucide-react";
import {hasTierAccess,TONE_LABELS,TONE_ORDER,TONE_TIER_REQUIREMENT,type SubscriptionTier,type ToneOption,} from "@/lib/AI/tiers";

interface ToneSelectorProps {
  tier: SubscriptionTier;
  selected: ToneOption | null;
  onSelect: (tone: ToneOption | null) => void;
}

const TIER_BADGE_LABEL: Record<SubscriptionTier, string> = {
  free: "",
  standard: "Standard+",
  pro: "Pro",
};

export default function ToneSelector({ tier, selected, onSelect }: ToneSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {TONE_ORDER.map((toneKey) => {
        const requiredTier = TONE_TIER_REQUIREMENT[toneKey];
        const available = hasTierAccess(tier, requiredTier);
        const isSelected = selected === toneKey;
        const isLockedByTier = !available;
        const isLockedBySelection = available && selected !== null && !isSelected;
        const isClickable = available && (selected === null || isSelected);

        function handleClick() {
          if (!isClickable) return;
          onSelect(isSelected ? null : toneKey);
        }

        return (
          <button
            key={toneKey}
            type="button"
            onClick={handleClick}
            disabled={!isClickable}
            className={`flex items-center justify-between gap-2 rounded-lg duration-300 border border-2 px-4 py-3 text-left text-sm font-medium transition ${
              isSelected
                ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-200"
                : isLockedByTier || isLockedBySelection
                ? "cursor-not-allowed border-white/5 bg-white/[0.015] text-white/25"
                : "cursor-pointer border-white/10 bg-white/[0.03] text-white/80 hover:border-violet-400/40 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <span className="flex flex-col">
              {TONE_LABELS[toneKey]}
              {isLockedByTier && (
                <span className="text-[10px] font-normal uppercase tracking-wide text-white/25">
                  {TIER_BADGE_LABEL[requiredTier]}
                </span>
              )}
            </span>

            {isSelected ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : isLockedByTier ? (
              <Lock className="h-3.5 w-3.5 shrink-0 text-white/20" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}