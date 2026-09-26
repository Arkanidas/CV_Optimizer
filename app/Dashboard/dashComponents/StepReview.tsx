"use client";

interface StepReviewProps {
  generatedLetter?: string;
}

export default function StepReview({ generatedLetter }: StepReviewProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div>
        <h3 className="text-base font-semibold text-white">Review your cover letter</h3>
        <p className="mt-1 text-sm text-white/50">
          Here's your generated cover letter — give it a read before downloading.
        </p>
      </div>

      <div className="max-h-[80vh] w-full overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 md:w-[80%]">
        {generatedLetter ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
            {generatedLetter}
          </p>
        ) : (
          <p className="text-sm text-white/30">No cover letter generated yet.</p>
        )}
      </div>
    </div>
  );
}