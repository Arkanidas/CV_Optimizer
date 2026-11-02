import LetterBody from "../LetterBody";
import { DETAILS_FONT_OPTIONS, fontCss, type LetterFormat } from "../letterFormat";

interface FadeTemplateProps {
  letter: string;
  format: LetterFormat;
}

// TWEAK ZONE
const FADE_HEIGHT = 230; // height of the colored fade at the top, in px
const FADE_STRENGTH = 42; // 0-100: how strong the color is at the very top
const NAME_DARKNESS = 70; // 0-100: how much of the accent color the name keeps
                          // (lower = darker, so it stays readable on light accents)

export default function FadeTemplate({ letter, format }: FadeTemplateProps) {
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);
  const detailLines = [format.contact.email, format.contact.phone, format.contact.address].filter(Boolean);

  // The accent color blended with white at the top, fading to plain white.
  const fade = `linear-gradient(to bottom, color-mix(in srgb, ${format.accentColor} ${FADE_STRENGTH}%, white), #ffffff)`;
  // A darker shade of the accent for the name, so it reads clearly on the fade.
  const nameColor = `color-mix(in srgb, ${format.accentColor} ${NAME_DARKNESS}%, black)`;

  return (
    <article className="flex min-h-full flex-col bg-white text-[#1c1917]">
      <header
        className="flex shrink-0 items-center justify-center px-12"
        style={{ height: FADE_HEIGHT, backgroundImage: fade }}
      >
        <p
          className="text-center font-bold tracking-wide"
          style={{
            fontFamily: detailsFont,
            fontSize: `${format.detailsFontSize * 2.4}pt`,
            color: nameColor,
          }}
        >
          {format.contact.name}
        </p>
      </header>

      <div className="flex justify-end px-12 pt-2">
        <div
          className="flex flex-col items-end gap-0.5 text-right text-stone-600"
          style={{ fontFamily: detailsFont, fontSize: `${format.detailsFontSize}pt` }}
        >
          {detailLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </div>

      <div className="flex-1 px-12 pb-10 pt-8">
        <LetterBody letter={letter} format={format} />
      </div>
    </article>
  );
}