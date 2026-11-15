"use client";

import { useId } from "react";

interface CvIllustrationProps {
  // The round badge in the corner: a star, or a target with an arrow
  kind: "star" | "target";
  className?: string;
}

// TWEAK: the colors are in the <defs> block. The stop-color classes have a
// light: version each, so the document stays visible on a white card.
export default function CvIllustration({ kind, className = "" }: CvIllustrationProps) {
  // Unique ids, because two of these SVGs are on the page at once. The colons
  // are removed, since some browsers don't accept them inside url(#...).
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `${uid}-${name}`;
  const ref = (name: string) => `url(#${id(name)})`;

  // The text lines on the document: y position, width, opacity
  const lines = [
    { y: 90, w: 74, o: 0.75 },
    { y: 101, w: 66, o: 0.6 },
    { y: 112, w: 74, o: 0.6 },
    { y: 123, w: 70, o: 0.5 },
    { y: 134, w: 74, o: 0.5 },
    { y: 145, w: 50, o: 0.45 },
  ];

  return (
    <svg viewBox="0 0 240 210" fill="none" aria-hidden className={className}>
      <defs>
        <radialGradient id={id("glow")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={id("doc")} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0" className="[stop-color:#e9e3ff] light:[stop-color:#ddd6fe]" />
          <stop offset="0.55" className="[stop-color:#b9a6f7] light:[stop-color:#a78bfa]" />
          <stop
            offset="1"
            className="[stop-color:#7c5cd6] [stop-opacity:0.55] light:[stop-color:#7c3aed] light:[stop-opacity:0.85]"
          />
        </linearGradient>

        <linearGradient id={id("ring")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className="[stop-color:#a78bfa] light:[stop-color:#8b5cf6]" />
          <stop offset="1" className="[stop-color:#7c3aed] light:[stop-color:#5b21b6]" />
        </linearGradient>

        <linearGradient id={id("badge")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#5b21b6" />
        </linearGradient>

        <filter id={id("shadow")} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#4c1d95" floodOpacity="0.45" />
        </filter>

        {/* The lower half of the ring, which passes in front of the document */}
        <clipPath id={id("front")}>
          <rect x="0" y="122" width="240" height="88" />
        </clipPath>
      </defs>

      <circle cx="120" cy="105" r="95" fill={ref("glow")} />

      {/* The ring, behind the document */}
      <ellipse
        cx="118"
        cy="122"
        rx="104"
        ry="34"
        transform="rotate(-18 118 122)"
        stroke={ref("ring")}
        strokeWidth="2"
        opacity="0.5"
      />

      {/* The document, tilted 9 degrees */}
      <g transform="rotate(-9 110 105)">
        <rect
          x="60"
          y="36"
          width="100"
          height="134"
          rx="12"
          fill={ref("doc")}
          filter={`url(#${id("shadow")})`}
        />
        <circle cx="80" cy="62" r="11" fill="#4c1d95" opacity="0.85" />
        <circle cx="80" cy="59" r="4.2" fill="#ddd6fe" />
        <path d="M72 71 C73 65.5 87 65.5 88 71 Z" fill="#ddd6fe" />
        <rect x="98" y="55" width="44" height="5" rx="2.5" fill="#fff" opacity="0.8" />
        <rect x="98" y="65" width="30" height="5" rx="2.5" fill="#fff" opacity="0.6" />
        {lines.map((line) => (
          <rect
            key={line.y}
            x="74"
            y={line.y}
            width={line.w}
            height="4.5"
            rx="2.25"
            fill="#fff"
            opacity={line.o}
          />
        ))}
      </g>

      {/* The same ring again, but only its lower half, in front of the document */}
      <g clipPath={ref("front")}>
        <ellipse
          cx="118"
          cy="122"
          rx="104"
          ry="34"
          transform="rotate(-18 118 122)"
          stroke={ref("ring")}
          strokeWidth="2.4"
          opacity="0.9"
        />
      </g>

      {/* The round badge */}
      <g filter={`url(#${id("shadow")})`}>
        <circle
          cx="150"
          cy="128"
          r="27"
          fill={ref("badge")}
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2.5"
        />
      </g>

      {kind === "star" ? (
        <polygon
          points="150,115 153.17,123.63 162.36,123.98 155.14,129.67 157.64,138.52 150,133.4 142.36,138.52 144.86,129.67 137.64,123.98 146.83,123.63"
          fill="#fff"
          stroke="#fff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ) : (
        <g stroke="#fff" strokeLinecap="round">
          <circle cx="150" cy="128" r="15" strokeWidth="2.6" />
          <circle cx="150" cy="128" r="9" strokeWidth="2.6" />
          <circle cx="150" cy="128" r="3.5" fill="#fff" strokeWidth="1" />
          <path d="M150 128 L168 110 M168 110 L167 103.5 M168 110 L174.5 111" strokeWidth="2.4" />
        </g>
      )}
    </svg>
  );
}