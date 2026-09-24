export function IconScan({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3" strokeLinecap="round" />
      <path d="M7 12h10" strokeLinecap="round" />
    </svg>
  );
}

export function IconRecipes({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 18h16M6 18V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9" strokeLinecap="round" />
      <path d="M9 7V5M12 7V4M15 7V5" strokeLinecap="round" />
    </svg>
  );
}

export function IconHealth({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBeauty({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 20h8M12 20V10" strokeLinecap="round" />
      <path d="M8 10c0-3 1.8-6 4-6s4 3 4 6z" />
    </svg>
  );
}

export function IconAccount({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c1.4-3 4-4.5 7-4.5S17.6 16 19 19" strokeLinecap="round" />
    </svg>
  );
}

export function IconSearch({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.2 16.2 21 21" strokeLinecap="round" />
    </svg>
  );
}

/** Leaf — vegan */
export function IconLeaf({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 19c8-1 12-6 14-14-7 1-12 5-14 14z" strokeLinejoin="round" />
      <path d="M5 19c2-4 5-7 9-9" strokeLinecap="round" />
    </svg>
  );
}

/** Bunny — cruelty-free */
export function IconBunny({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 10c0-3.2-1.2-6-2.4-6S4.5 7.2 5.2 10" strokeLinecap="round" />
      <path d="M15 10c0-3.2 1.2-6 2.4-6s2.1 3.2 1.4 6" strokeLinecap="round" />
      <ellipse cx="12" cy="14.5" rx="5.2" ry="4.8" />
      <circle cx="10.2" cy="14" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="13.8" cy="14" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Alert — animal tested */
export function IconAlert({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 4 3.5 19h17L12 4z" strokeLinejoin="round" />
      <path d="M12 10v4.5M12 17.5v.5" strokeLinecap="round" />
    </svg>
  );
}

/** Help / unknown */
export function IconHelp({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.4a2.4 2.4 0 0 1 4.6 1.1c0 1.4-2.2 1.8-2.2 3.2" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}
