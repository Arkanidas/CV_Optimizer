import { splitCoverLetterParagraphs } from "./splitLetter";

interface BannerTemplateProps {
  letter: string;
}

export default function BannerTemplate({ letter }: BannerTemplateProps) {
  const paragraphs = splitCoverLetterParagraphs(letter);

  return (
    <article className="flex min-h-full flex-col bg-[#f6f1e8] text-[#1c1917]">
      <header className="relative bg-[#12100e] px-8 pb-8 pt-7">
        <div className="h-px w-full bg-[#c4a574]/40" />
        <div className="mt-6 flex justify-center">
          <div className="bg-[#c4a574] px-8 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
            <p className="font-serif text-xl tracking-wide text-[#12100e] sm:text-2xl">
              Cover Letter
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-10 py-10 sm:px-12">
        {paragraphs.length === 0 ? (
          <p className="font-serif text-[15px] leading-relaxed text-stone-400">
            Your formatted letter will appear here as you type.
          </p>
        ) : (
          <div className="space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="whitespace-pre-wrap font-serif text-[15px] leading-[1.75] text-stone-800"
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
