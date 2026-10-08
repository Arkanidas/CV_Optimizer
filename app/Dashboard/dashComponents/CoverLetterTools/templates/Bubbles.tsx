import { splitCoverLetterParagraphs } from "../splitLetter";
import { PLACEHOLDER_CONTACT } from "../placeholderContact";
import { BODY_FONT_OPTIONS, DETAILS_FONT_OPTIONS, fontCss, type LetterFormat } from "../letterFormat";

interface BubbleHeaderTemplateProps {
  letter: string;
  format: LetterFormat;
}

export default function BubbleHeaderTemplate({ letter, format }: BubbleHeaderTemplateProps) {
  const paragraphs = splitCoverLetterParagraphs(letter);
  const bodyFont = fontCss(BODY_FONT_OPTIONS, format.bodyFontId);
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);

  return (
    <article className="flex min-h-full flex-col bg-white text-[#1c1917]">
      <header className="relative overflow-hidden px-10 pb-10 pt-10 sm:px-12">
        {/* TWEAK ZONE — each span is one bubble: position via top/right/
            left/bottom offsets, size via h-/w-, softness via opacity.
            Add a new <span> with the same pattern to add more bubbles;
            delete one to simplify. Color always follows format.accentColor. */}
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
            className="text-2xl font-semibold tracking-wide"
            style={{ fontFamily: detailsFont, color: format.accentColor }}
          >
            {PLACEHOLDER_CONTACT.name}
          </p>
          <div
            className="mt-2 flex flex-col gap-0.5 text-xs text-stone-500 sm:flex-row sm:gap-3"
            style={{ fontFamily: detailsFont }}
          >
            <span>{PLACEHOLDER_CONTACT.email}</span>
            <span className="hidden sm:inline">•</span>
            <span>{PLACEHOLDER_CONTACT.phone}</span>
            <span className="hidden sm:inline">•</span>
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