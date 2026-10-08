"use client";

import FontSelect from "./FontSelect";
import FontSizeSlider from "./FontSizeSlider";
import {
  BODY_FONT_OPTIONS,
  DETAILS_FONT_OPTIONS,
  DETAILS_FONT_SIZE_MAX,
  DETAILS_FONT_SIZE_MIN,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type DownloadFileType,
  type LetterFormat,
} from "./letterFormat";

interface FormatPanelProps {
  format: LetterFormat;
  onChange: (format: LetterFormat) => void;
}

const FILE_TYPES: { id: DownloadFileType; label: string }[] = [
  { id: "pdf", label: "PDF" },
  { id: "docx", label: "DOCX" },
];

export default function FormatPanel({ format, onChange }: FormatPanelProps) {
  function update(patch: Partial<LetterFormat>) {
    onChange({ ...format, ...patch });
  }

  return (
    <div className="flex flex-col gap-6 rounded-sm border border-white/10 bg-white/[0.03] p-5">
      <section className="flex flex-col gap-5">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-widest text-violet-300">Text</h3>
          <hr className="mt-2 border-white/10" />
        </div>

        <FontSizeSlider
          label="Body font size"
          value={format.fontSize}
          min={FONT_SIZE_MIN}
          max={FONT_SIZE_MAX}
          onChange={(value) => update({ fontSize: value })}
        />

        <FontSizeSlider
          label="Personal details font size"
          value={format.detailsFontSize}
          min={DETAILS_FONT_SIZE_MIN}
          max={DETAILS_FONT_SIZE_MAX}
          onChange={(value) => update({ detailsFontSize: value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <FontSelect
            label="Main text font"
            options={BODY_FONT_OPTIONS}
            value={format.bodyFontId}
            onChange={(id) => update({ bodyFontId: id })}
          />
          <FontSelect
            label="Personal details font"
            options={DETAILS_FONT_OPTIONS}
            value={format.detailsFontId}
            onChange={(id) => update({ detailsFontId: id })}
          />
        </div>
      </section>

      <hr className="border-white/10" />

      <section className="flex flex-col gap-2">
        <h4 className="text-sm font-medium text-white">File type</h4>
        <p className="text-xs text-white/40">
          Download will use this format. Nothing is exported yet.
        </p>
        <div className="mt-1 grid grid-cols-2 gap-3">
          {FILE_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => update({ fileType: type.id })}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                format.fileType === type.id
                  ? "border-violet-400/60 bg-violet-500/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white/90"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}