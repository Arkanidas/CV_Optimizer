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
        {/* TWEAK ZONE: each span is one bubble. Position with the top/right
            offsets, size with h-/w-, softness with opacity. Duplicate a
            span to add more bubbles. Color follows format.accentColor. */}
        <span
          className="absolute -right-6 -top-10 h-28 w-28 rounded-full"
          style={{ backgroundColor: format.accentColor, opacity: 0.12 }}
        />
        <span
          className="absolute right-16 top-6 h-12 w-12 rounded-full"
          style={{ backgroundColor: format.accentColor, opacity: 0.2 }}
        />
        <span
          className="absolute -right-2 top-20 h-6 w-6 rounded-full"
          style={{ backgroundColor: format.accentColor, opacity: 0.3 }}
        />

        <div className="relative">
          <p
            className="font-semibold tracking-wide"
            style={{
              fontFamily: detailsFont,
              color: format.accentColor,
              fontSize: `${format.detailsFontSize * 2.2}pt`,
            }}
          >
            {format.contact.name}
          </p>

          <div
            className="mt-2 flex flex-col gap-0.5 text-stone-500 sm:flex-row sm:gap-3"
            style={{ fontFamily: detailsFont, fontSize: `${format.detailsFontSize}pt` }}
          >
            {detailLines.map((line, index) => (
              <span key={line} className="flex gap-3">
                {index > 0 && <span className="hidden sm:inline">•</span>}
                {line}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 px-10 py-2 sm:px-12">
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