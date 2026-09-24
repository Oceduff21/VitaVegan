"use client";

import { useId } from "react";

const BARS: { x: number; w: number; h: number }[] = [
  { x: 16, w: 3.1, h: 54 },
  { x: 24, w: 5.2, h: 78 },
  { x: 35, w: 2.2, h: 40 },
  { x: 43, w: 6.0, h: 90 },
  { x: 55, w: 2.4, h: 36 },
  { x: 63, w: 4.4, h: 68 },
  { x: 73, w: 2.6, h: 46 },
  { x: 82, w: 5.8, h: 84 },
  { x: 94, w: 2.0, h: 32 },
  { x: 102, w: 3.6, h: 62 },
  { x: 112, w: 2.3, h: 38 },
  { x: 121, w: 5.4, h: 74 },
  { x: 132, w: 2.0, h: 28 },
  { x: 140, w: 4.8, h: 58 },
  { x: 151, w: 2.5, h: 44 },
  { x: 160, w: 3.3, h: 80 },
  { x: 170, w: 2.2, h: 34 },
  { x: 178, w: 5.7, h: 66 },
  { x: 190, w: 2.4, h: 50 },
  { x: 199, w: 4.1, h: 86 },
  { x: 209, w: 2.1, h: 30 },
  { x: 217, w: 5.5, h: 94 },
  { x: 229, w: 2.6, h: 42 },
  { x: 238, w: 3.5, h: 60 },
  { x: 248, w: 2.2, h: 36 },
  { x: 256, w: 5.0, h: 70 },
  { x: 267, w: 2.3, h: 48 },
  { x: 276, w: 5.6, h: 88 },
  { x: 288, w: 2.1, h: 34 },
  { x: 296, w: 3.4, h: 64 },
  { x: 306, w: 2.4, h: 40 },
  { x: 314, w: 4.8, h: 76 },
  { x: 325, w: 2.2, h: 46 },
  { x: 334, w: 3.2, h: 56 },
];

const GRASS_BOTTOM = 92;
const SHORT_Y = 100;
const SHORT_H = 20;

export function BarcodeScanArt({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const fade = `barFade-${uid}`;
  const lime = `limeFade-${uid}`;

  return (
    <svg viewBox="0 0 360 124" className={className} aria-hidden>
      <defs>
        <linearGradient id={fade} x1="0" y1="0" x2="0" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b7e05c" />
          <stop offset="28%" stopColor="#5fb43a" />
          <stop offset="55%" stopColor="#1f6a32" />
          <stop offset="78%" stopColor="#1a1a18" />
          <stop offset="100%" stopColor="#111" />
        </linearGradient>
        <linearGradient id={lime} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4ee7a" />
          <stop offset="100%" stopColor="#7cb342" />
        </linearGradient>
      </defs>

      {BARS.map((b) => {
        const top = GRASS_BOTTOM - b.h;
        const mid = b.x + b.w / 2;
        return (
          <path
            key={`p-${b.x}`}
            fill={`url(#${fade})`}
            d={`M${b.x} ${GRASS_BOTTOM} L${b.x} ${top + 12} Q${mid} ${top - 3} ${b.x + b.w} ${top + 12} L${b.x + b.w} ${GRASS_BOTTOM} Z`}
          />
        );
      })}

      {BARS.map((b) => (
        <rect key={`s-${b.x}`} x={b.x} y={SHORT_Y} width={b.w} height={SHORT_H} fill="#111" />
      ))}

      <g fill={`url(#${lime})`}>
        <ellipse cx="78" cy="20" rx="14" ry="5.2" transform="rotate(-36 78 20)" />
        <ellipse cx="96" cy="14" rx="13" ry="4.6" transform="rotate(14 96 14)" />
        <ellipse cx="80" cy="32" rx="12" ry="4.4" transform="rotate(-20 80 32)" />
        <ellipse cx="97" cy="28" rx="11" ry="4" transform="rotate(24 97 28)" />
        <ellipse cx="88" cy="24" rx="15" ry="3.6" transform="rotate(-8 88 24)" />
        <circle cx="72" cy="26" r="3.2" />
      </g>
      <g fill="#8bc34a">
        <circle cx="58" cy="34" r="1.4" />
        <circle cx="64" cy="42" r="1.1" />
        <circle cx="54" cy="40" r="0.9" />
        <circle cx="68" cy="48" r="0.8" />
        <circle cx="60" cy="50" r="0.7" />
      </g>

      <g fill="#8bc34a">
        <circle cx="40" cy="36" r="3.1" />
        <circle cx="48" cy="31" r="3.4" />
        <circle cx="56" cy="36" r="3" />
        <circle cx="51" cy="44" r="2.8" />
        <circle cx="43" cy="43" r="2.6" />
        <circle cx="48" cy="38" r="1.6" fill="#6eaf3a" />
      </g>

      <g fill="#7cb342">
        <circle cx="152" cy="38" r="3" />
        <circle cx="160" cy="32" r="3.3" />
        <circle cx="169" cy="37" r="2.9" />
        <circle cx="164" cy="46" r="2.7" />
        <circle cx="154" cy="46" r="2.5" />
        <circle cx="176" cy="50" r="2.2" />
        <circle cx="182" cy="44" r="2" />
        <circle cx="161" cy="40" r="1.5" fill="#5a9e32" />
      </g>
      <g fill="#8bc34a">
        <circle cx="166" cy="22" r="1.2" />
        <circle cx="174" cy="16" r="0.9" />
        <circle cx="158" cy="20" r="0.8" />
        <circle cx="178" cy="24" r="0.7" />
      </g>

      <g fill="#9ccc4a">
        <path d="M292 6c-10 12-9 28-2 42 1-12 8-22 18-26 2 12-1 26-8 36 14-10 20-26 14-40 8 5 10 16 7 24 5-18-10-36-29-36z" />
        <circle cx="306" cy="24" r="3.2" />
        <circle cx="316" cy="18" r="3.5" />
        <circle cx="324" cy="26" r="3" />
        <circle cx="316" cy="34" r="2.8" />
        <circle cx="306" cy="32" r="2.6" />
        <circle cx="316" cy="26" r="1.5" fill="#6eaf3a" />
      </g>
      <g fill="#8bc34a">
        <circle cx="328" cy="10" r="1.3" />
        <circle cx="336" cy="5" r="1" />
        <circle cx="322" cy="4" r="0.8" />
        <circle cx="338" cy="14" r="0.9" />
        <circle cx="332" cy="1" r="0.7" />
      </g>

      <path
        fill="#6eaf3a"
        d="M28 70c-16 4-24-8-16-22 12 2 20 10 22 20 12-12 28-8 32 4-14-4-26-4-38-2z"
        opacity="0.92"
      />
      <path
        fill="#6eaf3a"
        d="M338 48c8 10 2 22-8 26 1-10-8-16-18-18 8 12 0 22-10 26 12-16 22-28 36-34z"
        opacity="0.9"
      />
    </svg>
  );
}
