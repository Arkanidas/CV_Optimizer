import { splitCoverLetterParagraphs } from "../splitLetter";
import { PLACEHOLDER_CONTACT } from "../placeholderContact";
import { BODY_FONT_OPTIONS, DETAILS_FONT_OPTIONS, fontCss, type LetterFormat } from "../letterFormat";

interface DiagonalRibbonTemplateProps {
  letter: string;
  format: LetterFormat;
}

export default function DiagonalRibbonTemplate({ letter, format }: DiagonalRibbonTemplateProps) {
  const paragraphs = splitCoverLetterParagraphs(letter);
  const bodyFont = fontCss(BODY_FONT_OPTIONS, format.bodyFontId);
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);

  return (
    <article className="relative flex min-h-full flex-col overflow-hidden bg-white text-[#1c1917]">
      {/* TWEAK ZONE — ribbon. rotate-45 sets the diagonal angle (try
          -rotate-45 to flip direction), w-56 sets its length, and the
          right-/top- offsets position it. Swap "Cover Letter" for any
          short label. */}
      <div
        className="absolute right-[-64px] top-8 flex w-56 rotate-45 items-center justify-center py-1.5 shadow-sm"
        style={{ backgroundColor: format.accentColor }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-widest text-white"
          style={{ fontFamily: detailsFont }}
        >
          Cover Letter
        </span>
      </div>

      <header className="px-10 pb-4 pt-10 sm:px-12">
        <p className="text-2xl font-semibold" style={{ fontFamily: detailsFont }}>
          {PLACEHOLDER_CONTACT.name}
        </p>
        <div
          className="mt-2 flex flex-col gap-0.5 text-xs text-stone-500"
          style={{ fontFamily: detailsFont }}
        >
          <span>{PLACEHOLDER_CONTACT.email}</span>
          <span>{PLACEHOLDER_CONTACT.phone}</span>
          <span>{PLACEHOLDER_CONTACT.address}</span>
        </div>
      </header>

      <div className="flex-1 px-10 py-6 sm:px-12">
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