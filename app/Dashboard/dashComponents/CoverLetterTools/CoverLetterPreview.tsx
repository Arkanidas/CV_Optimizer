import { LETTER_TEMPLATES } from "./templates/templateRegistry";
import type { LetterFormat } from "./letterFormat";

interface CoverLetterPreviewProps {
  letter: string;
  format: LetterFormat;
  templateId: string;
}

export default function CoverLetterPreview({ letter, format, templateId }: CoverLetterPreviewProps) {
  const template = LETTER_TEMPLATES.find((t) => t.id === templateId) ?? LETTER_TEMPLATES[0];
  const TemplateComponent = template.Component;

  return (
    <div className="min-h-[700px] w-full max-w-[750px] overflow-hidden rounded-sm border border-white/10 bg-[#f6f1e8] shadow-[0_20px_50px_rgba(0,0,0,0.35)] relative top-16">
      <div className="max-h-[900px] overflow-y-auto">
        <TemplateComponent letter={letter} format={format} />
      </div>
    </div>
  );
}