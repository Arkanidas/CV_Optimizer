import BannerTemplate from "./BannerTemplate";
import type { LetterFormat } from "./letterFormat";

interface CoverLetterPreviewProps {
  letter: string;
  format: LetterFormat;
}

export default function CoverLetterPreview({ letter, format }: CoverLetterPreviewProps) {
  return (
    <div className="min-h-[700px] w-full max-w-[700px] overflow-hidden rounded-sm border border-white/10 bg-[#f6f1e8] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
      <div className="max-h-[700px] overflow-y-auto">
        <BannerTemplate letter={letter} format={format} />
      </div>
    </div>
  );
}
