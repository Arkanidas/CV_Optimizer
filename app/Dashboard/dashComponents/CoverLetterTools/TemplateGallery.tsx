"use client";

import { LETTER_TEMPLATES } from "./templates/templateRegistry";

interface TemplateGalleryProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function TemplateGallery({ selectedId, onSelect }: TemplateGalleryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {LETTER_TEMPLATES.map((template:any) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onSelect(template.id)}
          className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${
            selectedId === template.id
              ? "border-violet-400/60 bg-violet-500/10"
              : "border-white/10 bg-white/[0.03] hover:border-white/20"
          }`}
        >
          <span
            className="h-10 w-10 rounded-full"
            style={{ backgroundColor: template.swatch }}
          />
          <span className="text-sm text-white/80">{template.name}</span>
        </button>
      ))}
    </div>
  );
}