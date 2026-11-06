import { splitCoverLetterParagraphs } from "../splitLetter";
import { BODY_FONT_OPTIONS, DETAILS_FONT_OPTIONS, fontCss, type LetterFormat } from "../letterFormat";

interface BubbleHeaderTemplateProps {
  letter: string;
  format: LetterFormat;
}

// ============================================================
// TWEAK ZONE
// ============================================================

// Height of the header area, in px. The letter text starts just below it
// (about 8px lower). The bubble positions below are measured on a canvas
// 794 px wide (the page width) from the top of the page.
const HEADER_HEIGHT = 200;

// false: every bubble uses the color swatch (accent color), as before.
// true:  the pink / tan / blue colors from your reference image. The bubbles
//        then ignore the color swatch.
const USE_MULTICOLOR = false;
const MULTICOLOR_PALETTE = ["#ef9a9a", "#c4b49a", "#9bbccc", "#f5b5b5"];

// One line per bubble.
//   x, y     the CENTER of the bubble, in px from the top left of the page
//   size     the diameter, in px
//   opacity  0 to 1
// Depth is what makes them look like balloons in the air: a bubble that is
// close is big and strong, one far away is small and faint. Later bubbles are
// painted on top of earlier ones, so the big ones come first.
//
// KEEP CLEAR OF THE TEXT: a bubble's lowest point is y + size / 2. Keep that
// below about 196, which is just above the letter text. Bubbles are cut off
// only by the left, right and top edges of the page, never by the header, so
// one that goes lower simply continues over the page, behind the text.
interface Bubble {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const BUBBLES: Bubble[] = [
  // CLOSE: big and strong
  { x: 770, y: 60, size: 250, opacity: 0.28 }, // huge, cut by the right and top edge
  { x: 705, y: -5, size: 150, opacity: 0.2 }, // top right, cut by the top edge
  { x: 655, y: 60, size: 120, opacity: 0.5 }, // the strongest, in front of the huge one
  { x: 4, y: 152, size: 84, opacity: 0.38 }, // left edge, cut by the left edge

  // MIDDLE
  { x: 160, y: 4, size: 60, opacity: 0.3 }, // top, above the name
  { x: 625, y: 165, size: 36, opacity: 0.42 },
  { x: 540, y: 40, size: 34, opacity: 0.34 },

  // FAR AWAY: small and faint
  { x: 330, y: 20, size: 18, opacity: 0.22 },
  { x: 452, y: 160, size: 22, opacity: 0.26 },
  { x: 250, y: 178, size: 26, opacity: 0.2 },
  { x: 610, y: 100, size: 14, opacity: 0.4 },
  { x: 520, y: 186, size: 12, opacity: 0.3 },
];

export default function BubbleHeaderTemplate({ letter, format }: BubbleHeaderTemplateProps) {
  const paragraphs = splitCoverLetterParagraphs(letter);
  const bodyFont = fontCss(BODY_FONT_OPTIONS, format.bodyFontId);
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);
  const detailLines = [format.contact.email, format.contact.phone, format.contact.address].filter(Boolean);

  return (
    <article className="relative flex min-h-full flex-col bg-white text-[#1c1917]">
      {/* The bubble layer. It belongs to the page, not to the header, so the
          header no longer cuts the bubbles off. overflow-x-clip trims them at
          the left and right edge of the page only. The layer comes first, and
          the text blocks below are positioned (relative), so they are painted
          on top of the bubbles. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 overflow-x-clip"
        style={{ height: HEADER_HEIGHT }}
      >
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

      {/* minHeight (not height), so the text is never clipped if it gets
          taller than the area, for example with the largest details font size */}
      <header
        className="relative shrink-0 px-10 pt-10 sm:px-12"
        style={{ minHeight: HEADER_HEIGHT }}
      >
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

      <div className="relative flex-1 px-10 py-2 sm:px-12">
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