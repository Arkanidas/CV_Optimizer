"use client";

import { useState } from "react";
import { Upload, FileText } from "lucide-react";

interface SavedCv {
  id: string;
  title: string;
  updatedAt: string;
}

interface Step1UploadContextProps {
  savedCvs: SavedCv[];
  onContinue: (data: {
    cvId?: string;
    uploadedFile?: File;
    jobDescription: string;
  }) => void;
}

export default function Step1UploadContext({ savedCvs, onContinue, }: Step1UploadContextProps) {
  const [mode, setMode] = useState<"select" | "upload">(
    savedCvs.length > 0 ? "select" : "upload"
  );
  const [selectedCvId, setSelectedCvId] = useState<string | null>(
    savedCvs[0]?.id ?? null
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const isFormValid =
    jobDescription.trim().length > 40 &&
    ((mode === "select" && selectedCvId) || (mode === "upload" && uploadedFile));

  function handleContinue() {
    if (!isFormValid) return;
    onContinue({
      cvId: mode === "select" ? selectedCvId ?? undefined : undefined,
      uploadedFile: mode === "upload" ? uploadedFile ?? undefined : undefined,
      jobDescription: jobDescription.trim(),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Your CV</h3>
        <p className="mt-1 text-sm text-white/50">
          Pick a CV you&apos;ve already saved, or upload a new one for this
          application.
        </p>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("select")}
            disabled={savedCvs.length === 0}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              mode === "select"
                ? "border border-violet-400/50 bg-violet-500/20 text-violet-200"
                : "border border-white/10 text-white/50 hover:text-white/80"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            Use a saved CV
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              mode === "upload"
                ? "border border-violet-400/50 bg-violet-500/20 text-violet-200"
                : "border border-white/10 text-white/50 hover:text-white/80"
            }`}
          >
            Upload new
          </button>
        </div>

        {mode === "select" ? (
          <div className="mt-4 flex flex-col gap-2">
            {savedCvs.map((cv) => (
              <button
                key={cv.id}
                type="button"
                onClick={() => setSelectedCvId(cv.id)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  selectedCvId === cv.id
                    ? "border-violet-400/60 bg-violet-500/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                <FileText className="h-4 w-4 text-violet-300" />
                <div>
                  <p className="text-sm font-medium text-white">{cv.title}</p>
                  <p className="text-xs text-white/40">
                    Updated {cv.updatedAt}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center transition-colors hover:border-violet-400/50 hover:bg-violet-500/[0.03]">
            <Upload className="h-6 w-6 text-violet-300" />
            <span className="text-sm text-white/70">
              {uploadedFile
                ? uploadedFile.name
                : "Drop your CV here, or click to browse"}
            </span>
            <span className="text-xs text-white/35">PDF or DOCX, up to 5MB</span>
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white">Job description</h3>
        <p className="mt-1 text-sm text-white/50">
          Paste the full posting — the more detail, the better the match.
        </p>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
          placeholder="Paste the job description here..."
          className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:border-violet-400/50 focus:outline-none focus:ring-1 focus:ring-violet-400/30"
        />
        <p className="mt-1 text-right text-xs text-white/30">
          {jobDescription.trim().length} characters
        </p>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!isFormValid}
        className="ml-auto rounded-xl bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
      >
        Continue
      </button>
    </div>
  );
}
