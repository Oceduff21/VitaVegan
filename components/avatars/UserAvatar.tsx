import type { ReactNode } from "react";
import type { MascotId } from "@/data/mascots";
import { isMascotId } from "@/data/mascots";

const INK = "#2a241c";

function Eyes({ lx = 22, rx = 42, y = 28, r = 7 }: { lx?: number; rx?: number; y?: number; r?: number }) {
  return (
    <g>
      <ellipse cx={lx} cy={y} rx={r} ry={r * 1.12} fill="#1a140c" />
      <ellipse cx={rx} cy={y} rx={r} ry={r * 1.12} fill="#1a140c" />
      <circle cx={lx - 1.8} cy={y - 2} r={r * 0.34} fill="#fff" />
      <circle cx={rx - 1.8} cy={y - 2} r={r * 0.34} fill="#fff" />
      <circle cx={lx + 2.2} cy={y + 1.8} r={r * 0.13} fill="#fff" />
      <circle cx={rx + 2.2} cy={y + 1.8} r={r * 0.13} fill="#fff" />
    </g>
  );
}

function Smile({ cx = 32, cy = 56 }: { cx?: number; cy?: number }) {
  return <path d={`M${cx - 7} ${cy}c3 5 11 5 14 0`} fill="#5a3a28" />;
}

function Pip() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#e8b84a" />
      <path d="M6 26 L10 2 L26 18" fill="#c4922e" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M58 26 L54 2 L38 18" fill="#c4922e" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 22 L13 8 L22 18" fill="#d4a040" />
      <path d="M54 22 L51 8 L42 18" fill="#d4a040" />
      <Eyes y={30} r={6.5} />
      <path d="M32 40 l-4 5 h8z" fill="#8a4a28" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      <Smile cy={50} />
    </svg>
  );
}

function Lulu() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#efe4d4" />
      <ellipse cx="16" cy="6" rx="7" ry="16" fill="#d8c4ae" stroke={INK} strokeWidth="1.8" transform="rotate(-10 16 6)" />
      <ellipse cx="48" cy="6" rx="7" ry="16" fill="#d8c4ae" stroke={INK} strokeWidth="1.8" transform="rotate(10 48 6)" />
      <ellipse cx="16" cy="6" rx="3.4" ry="11" fill="#e8c4b4" transform="rotate(-10 16 6)" />
      <ellipse cx="48" cy="6" rx="3.4" ry="11" fill="#e8c4b4" transform="rotate(10 48 6)" />
      <Eyes y={32} r={6.2} />
      <ellipse cx="32" cy="44" rx="3.4" ry="2.6" fill="#c47860" stroke={INK} strokeWidth="1.3" />
      <path d="M32 46.5 v5" stroke={INK} strokeWidth="1.5" />
      <Smile cy={54} />
    </svg>
  );
}

function Chien() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#d4a05c" />
      <ellipse cx="6" cy="28" rx="11" ry="16" fill="#a07838" stroke={INK} strokeWidth="1.8" />
      <ellipse cx="58" cy="28" rx="11" ry="16" fill="#a07838" stroke={INK} strokeWidth="1.8" />
      <Eyes y={28} r={6.4} />
      <ellipse cx="32" cy="46" rx="10" ry="8" fill="#2a1a12" stroke={INK} strokeWidth="1.6" />
      <ellipse cx="32" cy="44.5" rx="6" ry="4" fill="#3a2818" />
      <Smile cy={56} />
    </svg>
  );
}

function Pesto() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#3aaa58" />
      <ellipse cx="16" cy="16" rx="13" ry="12" fill="#2e8a44" stroke={INK} strokeWidth="1.8" />
      <ellipse cx="48" cy="16" rx="13" ry="12" fill="#2e8a44" stroke={INK} strokeWidth="1.8" />
      <Eyes lx={16} rx={48} y={16} r={7.2} />
      <ellipse cx="32" cy="36" rx="5" ry="3.2" fill="#2e7a40" stroke={INK} strokeWidth="1.3" />
      <circle cx="29.5" cy="35.5" r="1.3" fill="#1a2810" />
      <circle cx="34.5" cy="35.5" r="1.3" fill="#1a2810" />
      <path d="M10 44c8 16 36 16 44 0" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <Smile cy={52} />
    </svg>
  );
}

function Meuh() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#f4f0ea" />
      <path d="M12 14 L8 0 L22 10" fill="#5a4030" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M52 14 L56 0 L42 10" fill="#5a4030" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <ellipse cx="4" cy="24" rx="12" ry="10" fill="#6a6a6a" stroke={INK} strokeWidth="1.8" />
      <ellipse cx="60" cy="24" rx="12" ry="10" fill="#6a6a6a" stroke={INK} strokeWidth="1.8" />
      <path d="M10 22c4-10 10-8 14-2-6 2-12 6-14 10z" fill="#7a7a7a" />
      <path d="M18 16c2-2 10 0 14 8 2 6-2 12-8 10-8-2-12-10-6-18z" fill="#6a6a6a" />
      <Eyes y={28} r={7} />
      <ellipse cx="32" cy="50" rx="20" ry="14" fill="#c47848" stroke={INK} strokeWidth="2" />
      <circle cx="24" cy="48" r="4.4" fill="#4a4a4a" />
      <circle cx="40" cy="48" r="4.4" fill="#4a4a4a" />
      <Smile cy={60} />
    </svg>
  );
}

function Pompon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#f2c4b4" />
      <ellipse cx="8" cy="12" rx="12" ry="14" fill="#e8a898" stroke={INK} strokeWidth="1.8" transform="rotate(-16 8 12)" />
      <ellipse cx="56" cy="12" rx="12" ry="14" fill="#e8a898" stroke={INK} strokeWidth="1.8" transform="rotate(16 56 12)" />
      <ellipse cx="10" cy="14" rx="5.5" ry="8" fill="#d49080" transform="rotate(-16 10 14)" />
      <ellipse cx="54" cy="14" rx="5.5" ry="8" fill="#d49080" transform="rotate(16 54 14)" />
      <Eyes y={26} r={6} />
      <ellipse cx="32" cy="48" rx="20" ry="16" fill="#e0a090" stroke={INK} strokeWidth="2" />
      <circle cx="24" cy="46" r="4.6" fill="#5a4038" />
      <circle cx="40" cy="46" r="4.6" fill="#5a4038" />
      <Smile cy={60} />
    </svg>
  );
}

function Cocotte() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#e08a40" />
      <path d="M18 4c3 16 8 22 14 22s11-6 14-22c-4 6-9 9-14 9S22 10 18 4z" fill="#e09040" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <Eyes y={32} r={6.4} />
      <path d="M24 46 L32 60 L40 46z" fill="#e8b030" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <ellipse cx="32" cy="46" rx="6" ry="3.5" fill="#d49028" />
      <ellipse cx="32" cy="58" rx="7" ry="5" fill="#e09040" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

function Mouton() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#f2eee6" />
      <circle cx="10" cy="8" r="10" fill="#e8e2d6" />
      <circle cx="32" cy="4" r="9" fill="#ebe6dc" />
      <circle cx="54" cy="8" r="10" fill="#e8e2d6" />
      <ellipse cx="4" cy="26" rx="11" ry="13" fill="#c8bca8" stroke={INK} strokeWidth="1.8" />
      <ellipse cx="60" cy="26" rx="11" ry="13" fill="#c8bca8" stroke={INK} strokeWidth="1.8" />
      <ellipse cx="6" cy="26" rx="5" ry="7" fill="#e8c4b8" />
      <ellipse cx="58" cy="26" rx="5" ry="7" fill="#e8c4b8" />
      <Eyes y={30} r={6.4} />
      <ellipse cx="32" cy="46" rx="7" ry="5.5" fill="#2a1a12" stroke={INK} strokeWidth="1.5" />
      <Smile cy={56} />
    </svg>
  );
}

function Blush({ y = 36 }: { y?: number }) {
  return (
    <g opacity="0.75">
      <ellipse cx="13" cy={y} rx="5.5" ry="3.2" fill="#f0b4a0" />
      <ellipse cx="51" cy={y} rx="5.5" ry="3.2" fill="#f0b4a0" />
    </g>
  );
}

function CuteSmile({ y = 40 }: { y?: number }) {
  return <path d={`M24 ${y}c3 7 13 7 16 0`} fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />;
}

function Tofu() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#f6f0e4" />
      <path d="M12 22 L32 12 L52 22 L52 46 L32 56 L12 46z" fill="none" stroke="#e0d4c0" strokeWidth="1.4" />
      <path d="M12 22 L32 32 L52 22" fill="none" stroke="#e0d4c0" strokeWidth="1.3" />
      <Eyes y={28} r={6} />
      <Blush y={38} />
      <CuteSmile y={42} />
    </svg>
  );
}

function Carotte() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#f0a040" />
      <path d="M20 2c4 12 8 16 12 16S40 14 44 2c-4 4-8 6-12 6S24 6 20 2z" fill="#3aaa58" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M18 8c2 8 6 12 8 12" fill="none" stroke="#2e8a44" strokeWidth="2" strokeLinecap="round" />
      <path d="M46 8c-2 8-6 12-8 12" fill="none" stroke="#2e8a44" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 36h28M16 46h32" stroke="#e08828" strokeWidth="1.4" opacity="0.55" />
      <Eyes y={30} r={6.2} />
      <Blush y={40} />
      <CuteSmile y={44} />
    </svg>
  );
}

function Edamame() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#6ecf5a" />
      <ellipse cx="20" cy="48" rx="8" ry="7" fill="#c8ec78" stroke={INK} strokeWidth="1.4" />
      <ellipse cx="32" cy="50" rx="8" ry="7" fill="#c8ec78" stroke={INK} strokeWidth="1.4" />
      <ellipse cx="44" cy="48" rx="8" ry="7" fill="#c8ec78" stroke={INK} strokeWidth="1.4" />
      <Eyes y={26} r={6.4} />
      <Blush y={36} />
      <CuteSmile y={40} />
    </svg>
  );
}

function Avocat() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#5aa63a" />
      <ellipse cx="32" cy="34" rx="24" ry="26" fill="#b8dc3c" />
      <ellipse cx="18" cy="10" rx="11" ry="7" fill="#3d8a2e" stroke={INK} strokeWidth="1.6" transform="rotate(-28 18 10)" />
      <ellipse cx="44" cy="8" rx="12" ry="7" fill="#3d8a2e" stroke={INK} strokeWidth="1.6" transform="rotate(22 44 8)" />
      <rect x="29" y="0" width="6" height="10" rx="2" fill="#8a5a28" />
      <Eyes y={24} r={6} />
      <Blush y={34} />
      <CuteSmile y={36} />
      <circle cx="32" cy="50" r="11" fill="#6a3a18" stroke={INK} strokeWidth="1.8" />
      <circle cx="36" cy="46" r="3.2" fill="#c49050" opacity="0.7" />
    </svg>
  );
}

function Champi() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#f3ead8" />
      <path d="M2 30c2-22 16-30 30-30s28 8 30 30c-10-8-50-8-60 0z" fill="#e8d4b0" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <ellipse cx="18" cy="16" rx="5" ry="3.5" fill="#f6efe4" />
      <ellipse cx="40" cy="12" rx="6" ry="4" fill="#f6efe4" />
      <Eyes y={38} r={6} />
      <Blush y={46} />
      <CuteSmile y={50} />
    </svg>
  );
}

function Banane() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#f5d24a" />
      <path d="M26 0c2 6 4 10 6 10s4-4 6-10c-2 2-4 3-6 3S28 2 26 0z" fill="#6a4a20" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      <ellipse cx="32" cy="62" rx="7" ry="4" fill="#8a6a28" />
      <path d="M14 22c8 4 28 4 36 0" fill="none" stroke="#e8b830" strokeWidth="1.6" />
      <path d="M12 40c10 5 30 5 40 0" fill="none" stroke="#e8b830" strokeWidth="1.6" />
      <Eyes y={28} r={6.2} />
      <Blush y={38} />
      <CuteSmile y={42} />
    </svg>
  );
}

function Brocoli() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#3d8a44" />
      <circle cx="12" cy="12" r="12" fill="#4aa054" />
      <circle cx="32" cy="6" r="13" fill="#52b05c" />
      <circle cx="52" cy="12" r="12" fill="#4aa054" />
      <circle cx="8" cy="26" r="9" fill="#3d8a44" />
      <circle cx="56" cy="26" r="9" fill="#3d8a44" />
      <path d="M18 38c0-8 6-12 14-12s14 4 14 12v26H18z" fill="#c8e878" />
      <Eyes y={40} r={6} />
      <Blush y={48} />
      <CuteSmile y={52} />
    </svg>
  );
}

function Aubergine() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="h-full w-full">
      <circle cx="32" cy="32" r="32" fill="#7a3a8a" />
      <ellipse cx="20" cy="18" rx="8" ry="14" fill="#9a58aa" opacity="0.45" />
      <path d="M16 2c4 12 10 16 16 16s12-4 16-16c-4 5-10 8-16 8S20 7 16 2z" fill="#3aaa58" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="29" y="0" width="6" height="9" rx="2" fill="#4a8a30" />
      <Eyes y={32} r={6.2} />
      <Blush y={42} />
      <CuteSmile y={46} />
    </svg>
  );
}

const MAP: Record<MascotId, () => ReactNode> = {
  pip: Pip,
  lulu: Lulu,
  chien: Chien,
  pesto: Pesto,
  meuh: Meuh,
  pompon: Pompon,
  cocotte: Cocotte,
  mouton: Mouton,
  tofu: Tofu,
  carotte: Carotte,
  edamame: Edamame,
  avocat: Avocat,
  champi: Champi,
  banane: Banane,
  brocoli: Brocoli,
  aubergine: Aubergine,
};

export function MascotSvg({ id }: { id: MascotId }) {
  const Draw = MAP[id] ?? Pip;
  return <Draw />;
}

export function UserAvatar({
  avatarId,
  photo,
  size = 48,
  className = "",
}: {
  avatarId?: string | null;
  photo?: string | null;
  size?: number;
  className?: string;
}) {
  const id = isMascotId(avatarId) ? avatarId : "pip";
  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-ink/15 ${className}`}
      style={{ width: size, height: size }}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="h-full w-full object-cover" />
      ) : (
        <MascotSvg id={id} />
      )}
    </span>
  );
}
