"use client";

import { LETTER_TEMPLATES } from "./templates/templateRegistry";
import TemplateThumbnail from "./TemplateThumbnail";
import { ACCENT_COLOR_OPTIONS, type FormatSettings } from "./letterFormat";

interface TemplateGalleryProps {
  selectedId: string;
  onSelect: (id: string) => void;
  format: FormatSettings;
  onColorChange: (color: string) => void;
}

export default function TemplateGallery({
  selectedId,
  onSelect,
  format,
  onColorChange,
}: TemplateGalleryProps) {
  return (
    <div className="flex h-[calc(100vh-9rem)] min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      {/* Palette: fixed at the top of the box, never scrolls */}
      <div className="flex shrink-0 items-center gap-2.5 border-b border-white/10 px-4 py-3">
        {ACCENT_COLOR_OPTIONS.map((color) => {
          const isCurrent = format.accentColor === color;

          return (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(color)}
              aria-label={`Use color ${color}`}
              aria-pressed={isCurrent}
              className={`h-7 w-7 cursor-pointer rounded-lg border border-white/15 transition hover:scale-110 ${
                isCurrent ? "ring-2 ring-white" : ""
              }`}
              style={{ backgroundColor: color }}
            />
          );
        })}
      </div>

      {/* Templates: the only part that scrolls */}
      <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth p-3 [scrollbar-color:rgba(255,255,255,0.2)_transparent] [scrollbar-width:thin]">
        <div className="grid grid-cols-2 justify-items-center gap-y-4 sm:grid-cols-3">
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

                <span
                  className={`absolute inset-x-0 bottom-0 py-1.5 text-center text-xs font-medium text-white backdrop-blur-xs ${
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
    </div>
  );
}