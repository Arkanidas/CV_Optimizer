import { splitCoverLetterParagraphs } from "./splitLetter";
import { BODY_FONT_OPTIONS, fontCss, type LetterFormat } from "./letterFormat";

interface LetterBodyProps {
  letter: string;
  format: LetterFormat;
  className?: string;
}

// The letter text block, shared by the three newest templates. Your older
// templates keep their own copies and don't need to change.
export default function LetterBody({ letter, format, className = "" }: LetterBodyProps) {
  const paragraphs = splitCoverLetterParagraphs(letter);
  const bodyFont = fontCss(BODY_FONT_OPTIONS, format.bodyFontId);

  if (paragraphs.length === 0) {
    return (
      <p
        className={`leading-relaxed text-stone-400 ${className}`}
        style={{ fontFamily: bodyFont, fontSize: `${format.fontSize}pt` }}
      >
        Your formatted letter will appear here as you type.
      </p>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="whitespace-pre-wrap leading-[1.75] text-stone-800"
          style={{ fontFamily: bodyFont, fontSize: `${format.fontSize}pt` }}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}