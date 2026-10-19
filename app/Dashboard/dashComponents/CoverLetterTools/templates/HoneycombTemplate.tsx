import LetterBody from "../LetterBody";
import { DETAILS_FONT_OPTIONS, fontCss, type LetterFormat } from "../letterFormat";

interface HoneycombTemplateProps {
  letter: string;
  format: LetterFormat;
}

// TWEAK ZONE
const PAPER_COLOR = "#e9f6ea"; // the light green paper
const INK_COLOR = "#14532d"; // name and rule
const HEX_COLOR = "#166534"; // hexagon outlines
const HEX_OPACITY = 0.1; // "barely visible": raise for stronger, lower for fainter
const HEX_SIZE = 14; // side length in px: smaller = denser grid

// One repeating tile of a pointy-top honeycomb: a full hexagon plus the
// vertical edge that connects it to the row below.
const TILE_WIDTH = Math.sqrt(3) * HEX_SIZE;
const TILE_HEIGHT = HEX_SIZE * 3;

function hexPatternUrl() {
  const r = (n: number) => Number(n.toFixed(3));
  const w = r(TILE_WIDTH);
  const h = r(TILE_WIDTH / 2);
  const s = HEX_SIZE;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${TILE_HEIGHT}" viewBox="0 0 ${w} ${TILE_HEIGHT}">` +
    `<path d="M${h} 0L${w} ${s / 2}V${s * 1.5}L${h} ${s * 2}L0 ${s * 1.5}V${s / 2}ZM${h} ${s * 2}V${TILE_HEIGHT}" fill="none" stroke="${HEX_COLOR}" stroke-opacity="${HEX_OPACITY}" stroke-width="1"/>` +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export default function HoneycombTemplate({ letter, format }: HoneycombTemplateProps) {
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);

  return (
    <article
      className="flex min-h-full flex-col text-[#1c1917]"
      style={{
        backgroundColor: PAPER_COLOR,
        backgroundImage: hexPatternUrl(),
        backgroundSize: `${TILE_WIDTH}px ${TILE_HEIGHT}px`,
      }}
    >
      <header className="flex items-start justify-between gap-6 px-12 pt-12">
        <p
          className="font-semibold tracking-wide"
          style={{
            fontFamily: detailsFont,
            fontSize: `${format.detailsFontSize * 2.2}pt`,
            color: format.accentColor,
          }}
        >
          {format.contact.name}
        </p>

        <div
          className="flex flex-col items-end gap-0.5 text-right text-stone-600"
          style={{ fontFamily: detailsFont, fontSize: `${format.detailsFontSize}pt` }}
        >
          <span>{format.contact.email}</span>
          <span>{format.contact.phone}</span>
          <span>{format.contact.address}</span>
        </div>
      </header>

      <div className="mx-12 mt-5 h-px" style={{ backgroundColor: INK_COLOR, opacity: 0.25 }} />

      <div className="flex-1 px-12 py-8">
        <LetterBody letter={letter} format={format} />
      </div>
    </article>
  );
}