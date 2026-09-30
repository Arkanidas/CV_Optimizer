"use client";

import {
  BODY_FONT_OPTIONS,
  DETAILS_FONT_OPTIONS,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type DownloadFileType,
  type LetterFormat,
} from "./letterFormat";

interface FormatPanelProps {
  format: LetterFormat;
  onChange: (next: LetterFormat) => void;
}

export default function FormatPanel({ format, onChange }: FormatPanelProps) {
  function patch(partial: Partial<LetterFormat>) {
    onChange({ ...format, ...partial });
  }

  return (
    <div className="flex min-h-[700px] w-full max-w-[650px] flex-col gap-8 rounded-sm border border-white/10 bg-white/[0.03] px-8 py-8">
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white/90">Body font size</h3>
          <span className="text-sm tabular-nums text-white/50">{format.fontSize} pt</span>
        </div>
        <input
          type="range"
          min={FONT_SIZE_MIN}
          max={FONT_SIZE_MAX}
          step={1}
          value={format.fontSize}
          onChange={(e) => patch({ fontSize: Number(e.target.value) })}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-violet-400"
        />
        <div className="flex justify-between text-[11px] text-white/30">
          <span>{FONT_SIZE_MIN} pt</span>
          <span>{FONT_SIZE_MAX} pt</span>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-white/90">Body font</h3>
        <p className="text-xs text-white/40">Used for the letter text in the preview.</p>
        <FontFamilySelect
          value={format.bodyFontId}
          options={BODY_FONT_OPTIONS}
          onChange={(bodyFontId) => patch({ bodyFontId })}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-white/90">File type</h3>
        <p className="text-xs text-white/40">
          Download will use this format. Nothing is exported yet.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <FileTypeButton
            label="PDF"
            selected={format.fileType === "pdf"}
            onClick={() => patch({ fileType: "pdf" as DownloadFileType })}
          />
          <FileTypeButton
            label="DOCX"
            selected={format.fileType === "docx"}
            onClick={() => patch({ fileType: "docx" as DownloadFileType })}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-white/90">Personal details font</h3>
        <p className="text-xs text-white/40">
          Applies to the name banner for now. Contact details will use this later.
        </p>
        <FontFamilySelect
          value={format.detailsFontId}
          options={DETAILS_FONT_OPTIONS}
          onChange={(detailsFontId) => patch({ detailsFontId })}
        />
      </section>
    </div>
  );
}

function FontFamilySelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { id: string; label: string; css: string }[];
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((font) => {
        const selected = value === font.id;
        return (
          <button
            key={font.id}
            type="button"
            onClick={() => onChange(font.id)}
            className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
              selected
                ? "border-violet-400/60 bg-violet-500/10 text-white"
                : "border-white/10 bg-white/[0.03] text-white/75 hover:border-white/20 hover:bg-white/[0.06]"
            }`}
          >
            <span className="block text-[15px]" style={{ fontFamily: font.css }}>
              {font.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FileTypeButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
        selected
          ? "border-violet-400/60 bg-violet-500/10 text-white"
          : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20"
      }`}
    >
      {label}
    </button>
  );
}
