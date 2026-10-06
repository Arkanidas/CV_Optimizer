import { splitCoverLetterParagraphs } from "../splitLetter";
import {BODY_FONT_OPTIONS,DETAILS_FONT_OPTIONS,fontCss,type LetterFormat,} from "../letterFormat";

interface BannerTemplateProps {
  letter: string;
  format: LetterFormat;
}

export default function BannerTemplate({ letter, format }: BannerTemplateProps) {
  const paragraphs = splitCoverLetterParagraphs(letter);
  const bodyFont = fontCss(BODY_FONT_OPTIONS, format.bodyFontId);
  const detailsFont = fontCss(DETAILS_FONT_OPTIONS, format.detailsFontId);

  return (
    <article className="flex min-h-full flex-col bg-white text-[#1c1917] w-full">
      <header className="relative bg-[#12100e] px-8 pb-8 pt-7 w-full ">
        <div className="h-px w-full bg-[#c4a574]/40 " />
         <div className="mt-6 flex justify-center ">
          <div className="bg-[#c4a574] px-8 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
            <p
              className="text-xl tracking-wide text-[#12100e] sm:text-2xl"
              style={{ fontFamily: detailsFont }}
            >
              Cover Letter
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-10 py-10 sm:px-12">
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
                style={{
                  fontFamily: bodyFont,
                  fontSize: `${format.fontSize}pt`,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>

      <footer className="h-2 bg-[#c4a574]" />
    </article>
  );
}
