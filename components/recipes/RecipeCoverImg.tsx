"use client";

import { useState } from "react";

/** Recipe photo with graceful fallback when URL is missing or fails to load. */
export function RecipeCoverImg({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`recipe-cover-fallback ${className}`} aria-hidden>
        <span className="display text-lg text-forest/70 sm:text-xl">Verdegan</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
  );
}
