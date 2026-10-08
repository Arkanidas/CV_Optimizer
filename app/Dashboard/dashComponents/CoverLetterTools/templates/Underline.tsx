import { splitCoverLetterParagraphs } from "../splitLetter";
import { PLACEHOLDER_CONTACT } from "../placeholderContact";
import { BODY_FONT_OPTIONS, DETAILS_FONT_OPTIONS, fontCss, type LetterFormat } from "../letterFormat";

interface UnderlineTemplateProps {
  letter: string;
  format: LetterFormat;
}

export default function UnderlineTemplate({ letter, format }: UnderlineTemplateProps) {
  const paragraphs = splitCoverLetterParagraphs(letter);
  const bodyFont = fontCss(BODY_FONT_OPTIONS, format.bodyFontId);
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);

  return (
    <article className="flex min-h-full flex-col bg-white text-[#1c1917]">
      <header className="px-10 pb-6 pt-10 sm:px-12">
        <p className="text-3xl font-semibold" style={{ fontFamily: detailsFont }}>
          {PLACEHOLDER_CONTACT.name}
        </p>
        {/* TWEAK ZONE — accent bar. h-1.5 = thickness, w-20 = length.
            Drop "rounded-full" for a hard-edged bar instead of a pill. */}
        <div
          className="mt-3 h-1.5 w-20 rounded-full"
          style={{ backgroundColor: format.accentColor }}
        />
        <div
          className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500"
          style={{ fontFamily: detailsFont }}
        >
          <span>{PLACEHOLDER_CONTACT.email}</span>
          <span>{PLACEHOLDER_CONTACT.phone}</span>
          <span>{PLACEHOLDER_CONTACT.address}</span>
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