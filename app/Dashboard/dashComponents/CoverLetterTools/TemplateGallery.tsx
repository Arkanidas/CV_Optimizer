"use client";

import { LETTER_TEMPLATES } from "./templates/templateRegistry";
import TemplateThumbnail from "./TemplateThumbnail";
import type { LetterFormat } from "./letterFormat";

interface TemplateGalleryProps {
  selectedId: string;
  onSelect: (id: string) => void;
  format: LetterFormat;
}

export default function TemplateGallery({ selectedId, onSelect, format }: TemplateGalleryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 border border-2 border-red-400 ">
      {LETTER_TEMPLATES.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onSelect(template.id)}
          className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition ${
            selectedId === template.id
              ? "border-violet-400/60 bg-violet-500/10"
              : "border-white/10 bg-white/[0.03] hover:border-white/20"
          }`}
        >
          <TemplateThumbnail Component={template.Component} format={format} />
          <span className="text-sm text-white/80">{template.name}</span>
        </button>
      ))}
    </div>
  );
}