import type { CSSProperties } from "react";
import polygonBanner from "@/app/assets/polygon.png";
import LetterBody from "../LetterBody";
import { PLACEHOLDER_CONTACT } from "../placeholderContact";
import { DETAILS_FONT_OPTIONS, fontCss, type LetterFormat } from "../letterFormat";

interface PolygonTemplateProps {
  letter: string;
  format: LetterFormat;
}

// TWEAK ZONE: how the banner image is toned down or recolored.
const BANNER_SATURATION = 0.55; // 1 = original colors, 0 = grayscale
const BANNER_BRIGHTNESS = 1.08;
// "accent" lays format.accentColor over the image using the blend mode
// below. "none" keeps the (muted) original colors.
const BANNER_TINT = "none" as "none" | "accent";
// "color" recolors, "multiply" darkens, "overlay" and "soft-light" are subtler.
const BANNER_BLEND_MODE: CSSProperties["mixBlendMode"] = "color";
const BANNER_TINT_OPACITY = 0.7;

// The image plus its optional tint. Used for both the top banner and the
// thin bottom strip so the two always match.
function PolygonLayer({ accentColor, position }: { accentColor: string; position: string }) {
  return (
    <>
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url(${polygonBanner.src})`,
          backgroundPosition: position,
          filter: `saturate(${BANNER_SATURATION}) brightness(${BANNER_BRIGHTNESS})`,
        }}
      />
      {BANNER_TINT === "accent" && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: accentColor,
            mixBlendMode: BANNER_BLEND_MODE,
            opacity: BANNER_TINT_OPACITY,
          }}
        />
      )}
    </>
  );
}

export default function PolygonTemplate({ letter, format }: PolygonTemplateProps) {
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);

  return (
    <article className="flex min-h-full flex-col bg-white text-[#1c1917]">
      {/* "isolate" keeps the blend mode inside the banner so it can't
          blend with anything else on the page. */}
      <header className="relative isolate h-[250px] shrink-0 overflow-hidden">
        <PolygonLayer accentColor={format.accentColor} position="center" />

        <div className="relative flex h-full items-center justify-center px-12">
          {/* TWEAK ZONE: frosted glass banner. backdrop-blur-md is the blur
              strength (try -sm or -lg), bg-white/25 is how milky it is,
              border-white/50 is the edge highlight. */}
          <div className="rounded-2xl border border-white/50 bg-white/25 px-12 py-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md">
            <p
              className="font-semibold tracking-wide text-stone-900"
              style={{ fontFamily: detailsFont, fontSize: `${format.detailsFontSize * 2.2}pt` }}
            >
              {PLACEHOLDER_CONTACT.name}
            </p>
          </div>
        </div>
      </header>

      <div
        className="flex flex-col gap-0.5 px-12 pt-6 text-stone-500"
        style={{ fontFamily: detailsFont, fontSize: `${format.detailsFontSize}pt` }}
      >
        <span>{PLACEHOLDER_CONTACT.email}</span>
        <span>{PLACEHOLDER_CONTACT.phone}</span>
        <span>{PLACEHOLDER_CONTACT.address}</span>
      </div>

      <div className="flex-1 px-12 py-8">
        <LetterBody letter={letter} format={format} />
      </div>

      {/* Thin pattern strip at the bottom, same image and same toning */}
      <footer className="relative isolate h-3 shrink-0 overflow-hidden">
        <PolygonLayer accentColor={format.accentColor} position="bottom" />
      </footer>
    </article>
  );
}