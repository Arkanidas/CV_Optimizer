import { splitCoverLetterParagraphs } from "../splitLetter";
import { PLACEHOLDER_CONTACT } from "../placeholderContact";
import { BODY_FONT_OPTIONS, DETAILS_FONT_OPTIONS, fontCss, type LetterFormat } from "../letterFormat";

interface CompassTemplateProps {
  letter: string;
  format: LetterFormat;
}

export default function CompassTemplate({ letter, format }: CompassTemplateProps) {
  const bodyParagraphs = splitCoverLetterParagraphs(letter);
  const bodyFont = fontCss(BODY_FONT_OPTIONS, format.bodyFontId);
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);

  return (
    <article className="flex min-h-full flex-col bg-white text-[#1c1917]">
      <header className="flex items-start justify-between gap-6 px-10 pt-10 sm:px-12">
        <p
          className="text-2xl font-semibold tracking-wide"
          style={{ fontFamily: detailsFont, color: format.accentColor }}
        >
          {PLACEHOLDER_CONTACT.name}
        </p>
        <div
          className="flex flex-col items-end gap-1 text-right text-xs text-stone-500"
          style={{ fontFamily: detailsFont }}
        >
          <span>{PLACEHOLDER_CONTACT.email}</span>
          <span>{PLACEHOLDER_CONTACT.phone}</span>
          <span>{PLACEHOLDER_CONTACT.address}</span>
        </div>
      </header>

      <div className="mx-10 mt-4 h-[3px] sm:mx-12" style={{ backgroundColor: format.accentColor }} />

      <div className="flex-1 px-10 py-8 sm:px-12">
        {bodyParagraphs.length === 0 ? (
          <p
            className="leading-relaxed text-stone-400"
            style={{ fontFamily: bodyFont, fontSize: `${format.fontSize}pt` }}
          >
            Your formatted letter will appear here as you type.
          </p>
        ) : (
          <div className="space-y-4">
            {bodyParagraphs.map((paragraph, index) => (
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