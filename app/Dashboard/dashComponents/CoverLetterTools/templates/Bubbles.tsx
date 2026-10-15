import { splitCoverLetterParagraphs } from "../splitLetter";
import { BODY_FONT_OPTIONS, DETAILS_FONT_OPTIONS, fontCss, type LetterFormat } from "../letterFormat";

interface BubbleHeaderTemplateProps {
  letter: string;
  format: LetterFormat;
}

export default function BubbleHeaderTemplate({ letter, format }: BubbleHeaderTemplateProps) {
  const paragraphs = splitCoverLetterParagraphs(letter);
  const bodyFont = fontCss(BODY_FONT_OPTIONS, format.bodyFontId);
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);
  const detailLines = [format.contact.email, format.contact.phone, format.contact.address].filter(Boolean);
  return (
    <article className="flex min-h-full flex-col bg-white text-[#1c1917]">
      <header className="relative overflow-hidden px-10 pb-10 pt-10 sm:px-12">
       <div
  className="mt-2 flex flex-col gap-0.5 text-xs text-stone-500 sm:flex-row sm:gap-3"
  style={{ fontFamily: detailsFont }}
>
  {detailLines.map((line, index) => (
    <span key={line} className="flex gap-3">
      {index > 0 && <span className="hidden sm:inline">•</span>}
      {line}
    </span>
  ))}
</div>
      </header>

      <div className="flex-1 px-10 py-8 sm:px-12">
        {paragraphs.length === 0 ? (
          <p
            className="leading-relaxed text-stone-400"
            style={{ fontFamily: bodyFont, fontSize: `${format.fontSize}pt` }}
          >
            Your formatted letter will appear here as you type.
          </p>
        ) : (
          <div className="space-y-4">
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
        )}
      </div>
    </article>
  );
}