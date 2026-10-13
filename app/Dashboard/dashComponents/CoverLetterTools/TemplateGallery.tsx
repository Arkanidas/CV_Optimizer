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
  
    <div className="h-[calc(100vh-9rem)] min-h-[320px] overflow-y-auto scroll-smooth p-1.5 [scrollbar-color:rgba(255,255,255,0.2)_transparent] [scrollbar-width:thin]">
      <div className="grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-3">
        {LETTER_TEMPLATES.map((template) => {
          const isSelected = selectedId === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              aria-pressed={isSelected}
              className={`relative block cursor-pointer overflow-hidden rounded-md transition ${
                isSelected ? "ring-2 ring-violet-400" : "hover:ring-2 hover:ring-white/30"
              }`}
            >
              <TemplateThumbnail Component={template.Component} format={format} />

              {/* Name banner, inside the thumbnail so it takes no extra space */}
              <span
                className={`absolute inset-x-0 bottom-0 py-1.5 text-center text-xs font-medium text-white backdrop-blur-sm ${
                  isSelected ? "bg-violet-600/90" : "bg-black/65"
                }`}
              >
                {template.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}