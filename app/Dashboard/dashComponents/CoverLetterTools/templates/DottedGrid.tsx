import { splitCoverLetterParagraphs } from "../splitLetter";
import { PLACEHOLDER_CONTACT } from "../placeholderContact";
import { BODY_FONT_OPTIONS, DETAILS_FONT_OPTIONS, fontCss, type LetterFormat } from "../letterFormat";

interface DottedGridTemplateProps {
  letter: string;
  format: LetterFormat;
}

export default function DottedGridTemplate({ letter, format }: DottedGridTemplateProps) {
  const paragraphs = splitCoverLetterParagraphs(letter);
  const bodyFont = fontCss(BODY_FONT_OPTIONS, format.bodyFontId);
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);

  return (
    <article className="flex min-h-full flex-col bg-white text-[#1c1917]">
      <header className="relative overflow-hidden px-10 pb-8 pt-10 sm:px-12">
        {/* TWEAK ZONE — dot-grid background. "14px 14px" is the spacing
            between dots; shrink it for a denser grid, grow it for a
            sparser one. The "1px" inside radial-gradient is dot size. */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(${format.accentColor} 1px, transparent 1px)`,
            backgroundSize: "14px 14px",
          }}
        />

        {/* TWEAK ZONE — geometric accents. Each <span> below is one
            shape. Duplicate any to add more:
            - circle: keep "rounded-full"
            - diamond: a square with "rotate-45"
            - triangle: the border trick used on the third span (no
              width/height, just three borders — change the border
              widths to resize it) */}
        <span
          className="absolute right-10 top-6 h-10 w-10 rounded-full opacity-20"
          style={{ backgroundColor: format.accentColor }}
        />
        <span
          className="absolute right-24 top-16 h-5 w-5 rotate-45 opacity-25"
          style={{ backgroundColor: format.accentColor }}
        />
        <span
          className="absolute right-6 top-20 opacity-25"
          style={{
            width: 0,
            height: 0,
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderBottom: `16px solid ${format.accentColor}`,
          }}
        />

        <div className="relative">
          <p
            className="text-2xl font-semibold"
            style={{ fontFamily: detailsFont, color: format.accentColor }}
          >
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