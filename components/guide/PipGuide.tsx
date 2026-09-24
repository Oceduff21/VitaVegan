"use client";

/** Pip — Verdegan guide cat (same family as score “happy cat” / default avatar). */

export type PipPose = "wave" | "speak" | "cheer" | "idle";

export function PipGuide({
  pose = "idle",
  size = 88,
  className = "",
}: {
  pose?: PipPose;
  size?: number;
  className?: string;
}) {
  const tip =
    pose === "wave" ? (
      <g className="origin-[52px_28px]" style={{ transform: "rotate(-18deg)" }}>
        <ellipse cx="52" cy="22" rx="7" ry="11" fill="#E8B84A" stroke="#1A1A18" strokeWidth="1.6" />
        <ellipse cx="52" cy="14" rx="4" ry="5" fill="#E8B84A" stroke="#1A1A18" strokeWidth="1.4" />
      </g>
    ) : null;

  const cheeks =
    pose === "cheer" || pose === "wave" ? (
      <>
        <ellipse cx="20" cy="42" rx="4" ry="2.5" fill="#E89A7A" opacity="0.55" />
        <ellipse cx="44" cy="42" rx="4" ry="2.5" fill="#E89A7A" opacity="0.55" />
      </>
    ) : null;

  const mouth =
    pose === "cheer" ? (
      <path d="M24 48c5 8 11 8 16 0" fill="none" stroke="#1A1A18" strokeWidth="2.2" strokeLinecap="round" />
    ) : pose === "speak" ? (
      <ellipse cx="32" cy="50" rx="5" ry="4" fill="#1A1A18" />
    ) : (
      <path d="M24 48c5 6 11 6 16 0" fill="none" stroke="#1A1A18" strokeWidth="2" strokeLinecap="round" />
    );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
      role="img"
    >
      <circle cx="32" cy="36" r="20" fill="#E8B84A" />
      <path d="M14 28 L18 6 L30 26" fill="#E8B84A" stroke="#1A1A18" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M50 28 L46 6 L34 26" fill="#E8B84A" stroke="#1A1A18" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 26 L19 10 L26 24" fill="#d4a040" />
      <path d="M48 26 L45 10 L38 24" fill="#d4a040" />
      {tip}
      <g>
        <ellipse cx="24" cy="34" rx="3.2" ry="3.6" fill="#1A1A18" />
        <ellipse cx="40" cy="34" rx="3.2" ry="3.6" fill="#1A1A18" />
        <circle cx="22.8" cy="32.8" r="1.1" fill="#fff" />
        <circle cx="38.8" cy="32.8" r="1.1" fill="#fff" />
      </g>
      <path d="M32 38 l-3.2 4.2 h6.4z" fill="#C45C26" stroke="#1A1A18" strokeWidth="1" strokeLinejoin="round" />
      {cheeks}
      {mouth}
      {pose === "cheer" ? (
        <>
          <circle cx="10" cy="14" r="2" fill="#128a48" opacity="0.7" />
          <circle cx="54" cy="12" r="1.6" fill="#c47820" opacity="0.75" />
          <circle cx="8" cy="40" r="1.4" fill="#1F4D3A" opacity="0.5" />
        </>
      ) : null}
    </svg>
  );
}

export function PipSpeech({
  name,
  children,
  pose = "speak",
  size = 72,
}: {
  name: string;
  children: React.ReactNode;
  pose?: PipPose;
  size?: number;
}) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0">
        <PipGuide pose={pose} size={size} />
        <p className="mt-0.5 text-center text-[0.65rem] font-semibold uppercase tracking-wide text-leaf">{name}</p>
      </div>
      <div className="relative min-w-0 flex-1 rounded-2xl bg-white px-3.5 py-3 text-sm leading-relaxed text-ink/80 ring-1 ring-ink/8">
        <span
          className="absolute left-0 top-6 h-3 w-3 -translate-x-1.5 rotate-45 bg-white ring-1 ring-ink/8"
          aria-hidden
          style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)", boxShadow: "none", border: "none" }}
        />
        {children}
      </div>
    </div>
  );
}
