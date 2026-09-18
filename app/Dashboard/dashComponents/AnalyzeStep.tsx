"use client";

import { ArrowLeft} from "lucide-react";


interface AnalyzeProps {
  onBack?: () => void;
}

export default function AnalyzeStep({ onBack }: AnalyzeProps) {

  return (
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
    </div>
  );
}