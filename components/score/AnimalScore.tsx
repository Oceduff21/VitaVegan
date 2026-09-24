"use client";

import type { CSSProperties } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";

type Props = {
  score: number;
  size?: number;
  showLabel?: boolean;
};

function Cat({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="36" r="18" fill="#E8B84A" />
      <path d="M16 28 L20 8 L30 26" fill="#E8B84A" />
      <path d="M48 28 L44 8 L34 26" fill="#E8B84A" />
      <g className="score-blink">
        <circle cx="26" cy="34" r="2.2" fill="#1A1A18" />
        <circle cx="38" cy="34" r="2.2" fill="#1A1A18" />
      </g>
      <path d="M32 38 l-3 4 h6 z" fill="#C45C26" />
      <path d="M24 46c5 6 11 6 16 0" fill="none" stroke="#1A1A18" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Cow({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <ellipse cx="32" cy="36" rx="20" ry="16" fill="#F4F0E6" stroke="#6B8F9C" strokeWidth="2" />
      <path d="M14 24 L10 12 L22 22" fill="#F4F0E6" stroke="#6B8F9C" strokeWidth="2" />
      <path d="M50 24 L54 12 L42 22" fill="#F4F0E6" stroke="#6B8F9C" strokeWidth="2" />
      <circle cx="24" cy="34" r="2" fill="#1A1A18" />
      <circle cx="40" cy="34" r="2" fill="#1A1A18" />
      <ellipse className="score-tear" cx="20" cy="40" rx="1.6" ry="2.4" fill="#6B8F9C" />
      <path d="M24 48c4-6 12-6 16 0" fill="none" stroke="#6B8F9C" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 40c0 4 4 6 10 6s10-2 10-6" fill="#E8D4C4" />
      <path d="M20 28 l6 4 M44 28 l-6 4" stroke="#6B8F9C" strokeWidth="1.5" />
    </svg>
  );
}

function Rabbit({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <g className="score-ear-l">
        <ellipse cx="24" cy="16" rx="6" ry="14" fill="#C4B49A" />
      </g>
      <g className="score-ear-r">
        <ellipse cx="40" cy="16" rx="6" ry="14" fill="#C4B49A" />
      </g>
      <circle cx="32" cy="38" r="16" fill="#D9CBB3" />
      <g className="score-blink">
        <circle cx="26" cy="36" r="2" fill="#1A1A18" />
        <circle cx="38" cy="36" r="2" fill="#1A1A18" />
      </g>
      <circle cx="32" cy="42" r="3" fill="#C45C26" opacity="0.7" />
      <path d="M28 48h8" stroke="#1A1A18" strokeWidth="2" strokeLinecap="round" />
      <circle cx="46" cy="22" r="5" fill="none" stroke="#8A7A65" strokeWidth="2" />
      <path d="M49 25 l4 4" stroke="#8A7A65" strokeWidth="2" />
    </svg>
  );
}

export function AnimalScore({ score, size = 36, showLabel = true }: Props) {
  const { t } = useI18n();
  const clamped = Math.min(5, Math.max(1, Math.round(score)));
  const Icon = clamped >= 4 ? Cat : clamped === 3 ? Rabbit : Cow;
  const label = t(`score.${clamped}`);

  return (
    <div className="flex flex-col gap-1" title={label}>
      <div className="flex items-center gap-1" aria-label={label}>
        {Array.from({ length: clamped }).map((_, i) => (
          <span key={`${clamped}-${i}`} className="score-pop" style={{ "--i": i } as CSSProperties}>
            <Icon size={size} />
          </span>
        ))}
      </div>
      {showLabel ? <p className="anim-slide text-sm text-ink/70">{label}</p> : null}
    </div>
  );
}
