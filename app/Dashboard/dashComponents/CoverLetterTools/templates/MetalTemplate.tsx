import type { ReactNode } from "react";
import LetterBody from "../LetterBody";
import { PLACEHOLDER_CONTACT } from "../placeholderContact";
import { DETAILS_FONT_OPTIONS, fontCss, type LetterFormat } from "../letterFormat";

interface MetalTemplateProps {
  letter: string;
  format: LetterFormat;
}

// TWEAK ZONE: the metal look is three stacked gradients.
// 1) the base: light edges with a dark band in the middle and a bright band
//    just below it, which is what reads as a reflection
const METAL_BASE =
  "linear-gradient(180deg, #f7f9fb 0%, #cfd5db 14%, #8f98a3 46%, #dfe4e9 54%, #b3bbc4 82%, #eef1f4 100%)";
// 2) a diagonal sheen. Move the percentages to move the highlight.
const METAL_SHEEN =
  "linear-gradient(105deg, transparent 28%, rgba(255,255,255,0.55) 44%, transparent 60%)";
// 3) fine vertical lines for a brushed-metal grain
const METAL_BRUSH =
  "repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, rgba(0,0,0,0.04) 1px, rgba(0,0,0,0.04) 2px)";

function MetalPlate({ className = "", children }: { className?: string; children?: ReactNode }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        backgroundImage: `${METAL_SHEEN}, ${METAL_BRUSH}, ${METAL_BASE}`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.3)",
      }}
    >
      {children}
    </div>
  );
}

// angle rotates the slot so the screws don't all look identical.
function Screw({ className = "", angle = 0 }: { className?: string; angle?: number }) {
  return (
    <span
      aria-hidden
      className={`absolute block h-4 w-4 rounded-full ${className}`}
      style={{
        background:
          "radial-gradient(circle at 32% 30%, #ffffff 0%, #d4d9de 30%, #8b949e 68%, #5f6770 100%)",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.35), 0 1px 1px rgba(0,0,0,0.3)",
      }}
    >
      <span
        className="absolute left-1/2 top-1/2 block h-[2px] w-[68%] bg-black/50"
        style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
      />
    </span>
  );
}

export default function MetalTemplate({ letter, format }: MetalTemplateProps) {
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);
  const engraved = { textShadow: "0 1px 0 rgba(255,255,255,0.65)" };

  return (
    <article className="flex min-h-full flex-col bg-white text-[#1c1917]">
      <MetalPlate className="h-[120px] shrink-0">
        {/* Top two screws */}
        <Screw className="left-3 top-3" angle={35} />
        <Screw className="right-3 top-3" angle={-20} />

        <div className="flex h-full items-center justify-between px-14">
          <p
            className="font-semibold tracking-wide"
            style={{
              ...engraved,
              color: "#343b43",
              fontFamily: detailsFont,
              fontSize: `${format.detailsFontSize * 2.2}pt`,
            }}
          >
            {PLACEHOLDER_CONTACT.name}
          </p>

          <div
            className="flex flex-col items-end gap-0.5 text-right"
            style={{
              ...engraved,
              color: "#454d56",
              fontFamily: detailsFont,
              fontSize: `${format.detailsFontSize}pt`,
            }}
          >
            <span>{PLACEHOLDER_CONTACT.email}</span>
            <span>{PLACEHOLDER_CONTACT.phone}</span>
            <span>{PLACEHOLDER_CONTACT.address}</span>
          </div>
        </div>
      </MetalPlate>

      <div className="flex-1 px-12 py-8">
        <LetterBody letter={letter} format={format} />
      </div>

      {/* Thinner plate at the bottom, with the other two screws */}
      <MetalPlate className="h-7 shrink-0">
        <Screw className="left-3 top-1.5" angle={70} />
        <Screw className="right-3 top-1.5" angle={-50} />
      </MetalPlate>
    </article>
  );
}