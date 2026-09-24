"use client";

/** Rating mascots: happy cat (4–5), skeptical rabbit (3), crying pig (1–2). */

function Cat({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="36" r="18" fill="#E8B84A" />
      <path d="M16 28 L20 8 L30 26" fill="#E8B84A" />
      <path d="M48 28 L44 8 L34 26" fill="#E8B84A" />
      <circle cx="26" cy="34" r="2.2" fill="#1A1A18" />
      <circle cx="38" cy="34" r="2.2" fill="#1A1A18" />
      <path d="M32 38 l-3 4 h6 z" fill="#C45C26" />
      <path d="M24 46c5 6 11 6 16 0" fill="none" stroke="#1A1A18" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Rabbit({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <ellipse cx="24" cy="16" rx="6" ry="14" fill="#C4B49A" />
      <ellipse cx="40" cy="16" rx="6" ry="14" fill="#C4B49A" />
      <circle cx="32" cy="38" r="16" fill="#D9CBB3" />
      <circle cx="26" cy="36" r="2" fill="#1A1A18" />
      <circle cx="38" cy="36" r="2" fill="#1A1A18" />
      <circle cx="32" cy="42" r="3" fill="#C45C26" opacity="0.7" />
      <path d="M28 48h8" stroke="#1A1A18" strokeWidth="2" strokeLinecap="round" />
      <circle cx="46" cy="22" r="5" fill="none" stroke="#8A7A65" strokeWidth="2" />
      <path d="M49 25 l4 4" stroke="#8A7A65" strokeWidth="2" />
    </svg>
  );
}

function CryingPig({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="34" r="18" fill="#F2C4B4" />
      <ellipse cx="14" cy="18" rx="8" ry="10" fill="#E8A898" />
      <ellipse cx="50" cy="18" rx="8" ry="10" fill="#E8A898" />
      <circle cx="26" cy="32" r="2.2" fill="#1A1A18" />
      <circle cx="38" cy="32" r="2.2" fill="#1A1A18" />
      <ellipse cx="22" cy="38" rx="1.8" ry="3" fill="#6B8F9C" />
      <ellipse cx="42" cy="38" rx="1.8" ry="3" fill="#6B8F9C" />
      <ellipse cx="32" cy="44" rx="10" ry="7" fill="#E0A090" stroke="#1A1A18" strokeWidth="1.5" />
      <circle cx="27" cy="44" r="2.2" fill="#5a4038" />
      <circle cx="37" cy="44" r="2.2" fill="#5a4038" />
      <path d="M26 52c3-4 9-4 12 0" fill="none" stroke="#1A1A18" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ratingMascot(rating: number) {
  const r = Math.min(5, Math.max(1, Math.round(rating)));
  if (r >= 4) return Cat;
  if (r === 3) return Rabbit;
  return CryingPig;
}

export function RatingMascotFace({ rating, size = 40 }: { rating: number; size?: number }) {
  const Icon = ratingMascot(rating);
  return <Icon size={size} />;
}
