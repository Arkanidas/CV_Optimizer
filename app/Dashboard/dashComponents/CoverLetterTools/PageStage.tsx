"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Real A4 at 96 dpi: 210mm x 297mm = 794 x 1123 px. With the true pixel
// size, "12 pt" inside the stage is a real 12 pt relative to the page, so
// line counts and page breaks behave like a printed A4 letter.
export const PAGE_STAGE_WIDTH = 850;
export const PAGE_STAGE_HEIGHT = 1123;

interface PageStageProps {
  width: number;
  children: ReactNode;
  className?: string;
  fitContent?: boolean;
}

export default function PageStage({
  width,
  children,
  className = "",
  fitContent = false,
}: PageStageProps) {
  const scale = width / PAGE_STAGE_WIDTH;
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageHeight, setStageHeight] = useState(PAGE_STAGE_HEIGHT);

  useEffect(() => {
    if (!fitContent) return;
    const el = stageRef.current;
    if (!el) return;

    // offsetHeight ignores CSS transforms, so this is the unscaled height.
    const update = () => setStageHeight(Math.max(PAGE_STAGE_HEIGHT, el.offsetHeight));
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fitContent]);

  const pageBreakCount = fitContent
    ? Math.max(0, Math.ceil(stageHeight / PAGE_STAGE_HEIGHT) - 1)
    : 0;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width, height: (fitContent ? stageHeight : PAGE_STAGE_HEIGHT) * scale }}
    >
      <div
        ref={stageRef}
        className="relative origin-top-left"
        style={{
          width: PAGE_STAGE_WIDTH,
          display: "grid",
          gridTemplateRows: "1fr",
          minHeight: PAGE_STAGE_HEIGHT,
          ...(fitContent ? {} : { height: PAGE_STAGE_HEIGHT }),
          transform: `scale(${scale})`,
        }}
      >
        {children}

        {/* Faint dashed guide where the next A4 page would start */}
        {Array.from({ length: pageBreakCount }, (_, i) => (
          <div
            key={i}
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-black/20"
            style={{ top: (i + 1) * PAGE_STAGE_HEIGHT }}
          />
        ))}
      </div>
    </div>
  );
}