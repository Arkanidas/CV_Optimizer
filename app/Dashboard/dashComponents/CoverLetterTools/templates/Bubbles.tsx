import { splitCoverLetterParagraphs } from "../splitLetter";
import { BODY_FONT_OPTIONS, DETAILS_FONT_OPTIONS, fontCss, type LetterFormat } from "../letterFormat";

interface BubbleHeaderTemplateProps {
  letter: string;
  format: LetterFormat;
}

// ============================================================
// TWEAK ZONE
// ============================================================

// Height of the bubble area at the top of the page, in px. The bubble
// positions below are measured on this canvas: 794 px wide (the page width)
// and this tall. If you change it, the bubbles keep their distance from the
// top.
const HEADER_HEIGHT = 200;

// false: every bubble uses the color swatch (accent color), as before.
// true:  the pink / tan / blue colors from your reference image. The bubbles
//        then ignore the color swatch.
const USE_MULTICOLOR = false;
const MULTICOLOR_PALETTE = ["#ef9a9a", "#c4b49a", "#9bbccc", "#f5b5b5"];

// One line per bubble.
//   x, y     the CENTER of the bubble, in px from the top left of the canvas
//   size     the diameter, in px
//   opacity  0 to 1
// Depth is what makes them look like balloons in the air. A bubble that is
// close is big and strong. A bubble far away is small and faint. Bubbles
// that stick out past the edge are cut off by the page, which also looks
// natural.
// The order matters: later bubbles are painted on top of earlier ones, so the
// big ones come first and the small ones last.
interface Bubble {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const BUBBLES: Bubble[] = [
  // CLOSE: big and strong
  { x: 760, y: 100, size: 260, opacity: 0.3 }, // huge, cut off at the right edge
  { x: 700, y: 6, size: 150, opacity: 0.22 }, // top right, cut off at the top
  { x: 10, y: 170, size: 100, opacity: 0.38 }, // left edge, below the text
  { x: 650, y: 70, size: 130, opacity: 0.5 }, // the strongest, in front of the huge one

  // MIDDLE
  { x: 160, y: 4, size: 60, opacity: 0.3 }, // top, cut off
  { x: 648, y: 190, size: 38, opacity: 0.42 },

  // FAR AWAY: small and faint
  { x: 540, y: 52, size: 30, opacity: 0.34 },
  { x: 330, y: 30, size: 16, opacity: 0.22 },
  { x: 440, y: 165, size: 22, opacity: 0.26 },
  { x: 250, y: 180, size: 26, opacity: 0.2 },
  { x: 612, y: 150, size: 14, opacity: 0.4 },
  { x: 520, y: 186, size: 12, opacity: 0.3 },
];

export default function BubbleHeaderTemplate({ letter, format }: BubbleHeaderTemplateProps) {
  const paragraphs = splitCoverLetterParagraphs(letter);
  const bodyFont = fontCss(BODY_FONT_OPTIONS, format.bodyFontId);
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);
  const detailLines = [format.contact.email, format.contact.phone, format.contact.address].filter(Boolean);

  return (
    <article className="flex min-h-full flex-col bg-white text-[#1c1917]">
      {/* minHeight (not height), so the text is never clipped if it gets taller
          than the area, for example with the largest details font size */}
      <header
        className="relative shrink-0 overflow-hidden px-10 pt-10 sm:px-12"
        style={{ minHeight: HEADER_HEIGHT }}
      >
        {/* The bubbles sit behind the text: they come first in the DOM, and
            the text block after them is positioned on top */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {BUBBLES.map((bubble, index) => (
            <span
              key={index}
              className="absolute rounded-full"
              style={{
                left: bubble.x - bubble.size / 2,
                top: bubble.y - bubble.size / 2,
                width: bubble.size,
                height: bubble.size,
                backgroundColor: USE_MULTICOLOR
                  ? MULTICOLOR_PALETTE[index % MULTICOLOR_PALETTE.length]
                  : format.accentColor,
                // the reference colors are pastel, so they need to be stronger
                opacity: USE_MULTICOLOR ? Math.min(1, bubble.opacity * 2) : bubble.opacity,
              }}
            />
          ))}
        </div>

        <div className="relative">
          <p
            className="font-semibold tracking-wide"
            style={{
              fontFamily: detailsFont,
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