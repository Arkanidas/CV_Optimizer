import { splitCoverLetterParagraphs } from "../splitLetter";
import { getInitials } from "../initials";
import { BODY_FONT_OPTIONS, DETAILS_FONT_OPTIONS, fontCss, type LetterFormat } from "../letterFormat";

interface MonogramTemplateProps {
  letter: string;
  format: LetterFormat;
}

export default function MonogramTemplate({ letter, format }: MonogramTemplateProps) {
  const paragraphs = splitCoverLetterParagraphs(letter);
  const bodyFont = fontCss(BODY_FONT_OPTIONS, format.bodyFontId);
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);

  return (
    <article className="flex min-h-full flex-col text-[#1c1917]"
      // TWEAK ZONE — page tint. color-mix() blends a percentage of the
      // user's accent color into white for a "colored paper" feel with
      // no second color field needed. Raise/lower "10%" for a
      // stronger/fainter tint.
      style={{ backgroundColor: `color-mix(in srgb, ${format.accentColor} 10%, white)` }}
    >
      <header className="flex items-center gap-5 px-10 pb-6 pt-10 sm:px-12">
      
        <div
          className="flex h-18 w-20 shrink-0 items-center justify-center text-lg font-semibold text-white"
          style={{backgroundColor: format.accentColor, clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)", fontFamily: detailsFont,}}
        >
          {getInitials(format.contact.name)}
        </div>

        <div>
          <p className="text-xl font-semibold" style={{ fontFamily: detailsFont, fontSize: `${format.detailsFontSize * 2.2}pt` }}>
            {format.contact.name}
          </p>
          <div
            className="mt-1 flex flex-col gap-0.5 text-xs text-stone-600"
            style={{ fontFamily: detailsFont, fontSize: `${format.detailsFontSize}pt`}}
          >
            <span>{format.contact.email}</span>
            <span>{format.contact.phone}</span>
            <span>{format.contact.address}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 bg-white px-10 py-8 sm:px-12">
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