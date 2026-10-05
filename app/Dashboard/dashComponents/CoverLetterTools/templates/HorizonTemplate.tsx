import { splitCoverLetterParagraphs } from "../splitLetter";
import { PLACEHOLDER_CONTACT } from "../placeholderContact";
import { BODY_FONT_OPTIONS, DETAILS_FONT_OPTIONS, fontCss, type LetterFormat } from "../letterFormat";

interface HorizonTemplateProps {
  letter: string;
  format: LetterFormat;
}

export default function HorizonTemplate({ letter, format }: HorizonTemplateProps) {
  const bodyParagraphs = splitCoverLetterParagraphs(letter);
  const bodyFont = fontCss(BODY_FONT_OPTIONS, format.bodyFontId);
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);

  return (
    <article className="flex min-h-full flex-col bg-white text-[#1c1917]">
      <header className="px-10 py-8 sm:px-12" style={{ backgroundColor: format.accentColor }}>
        <p
          className="text-2xl font-semibold tracking-wide text-white"
          style={{ fontFamily: detailsFont }}
        >
          {PLACEHOLDER_CONTACT.name}
        </p>
      </header>

      <div
        className="flex flex-col gap-1 px-10 pt-6 text-xs text-stone-500 sm:px-12"
        style={{ fontFamily: detailsFont }}
      >
        <span>{PLACEHOLDER_CONTACT.email}</span>
        <span>{PLACEHOLDER_CONTACT.phone}</span>
        <span>{PLACEHOLDER_CONTACT.address}</span>
      </div>

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