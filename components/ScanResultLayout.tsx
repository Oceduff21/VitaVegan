"use client";

import type { ReactNode } from "react";
import { AnimalScore } from "@/components/score/AnimalScore";

/** Sticky verdict strip + collapsible details for scan results. */
export function ScanResultLayout({
  sticky,
  children,
  detailsLabel,
  details,
  defaultOpen = false,
}: {
  sticky: ReactNode;
  children: ReactNode;
  detailsLabel: string;
  details?: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <article id="scan-result" className="anim-card-in flex scroll-mt-20 flex-col gap-2.5 rounded-2xl bg-white sm:gap-3 sm:rounded-3xl">
      <div className="scan-result-sticky">{sticky}</div>
      <div className="flex flex-col gap-2.5 px-3.5 pb-4 sm:gap-3 sm:px-5 sm:pb-5">{children}</div>
      {details ? (
        <details className="scan-result-details mx-3.5 mb-4 sm:mx-5 sm:mb-5" open={defaultOpen}>
          <summary className="cursor-pointer select-none text-sm font-semibold text-forest">{detailsLabel}</summary>
          <div className="mt-2.5 flex flex-col gap-2 text-sm text-ink/80 sm:mt-3">{details}</div>
        </details>
      ) : null}
    </article>
  );
}

export function ScanStickyHead({
  mode,
  name,
  brand,
  image,
  score,
  badges,
  remaining,
  community,
}: {
  mode: string;
  name: string;
  brand?: string;
  image?: string | null;
  score: number;
  badges: ReactNode;
  remaining?: ReactNode;
  community?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 p-3 sm:gap-3 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-forest sm:text-xs">{mode}</p>
        {remaining}
      </div>
      <div className="flex gap-2.5 sm:gap-3">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="h-14 w-14 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="text-base leading-snug sm:text-xl">{name}</h2>
          {brand ? <p className="truncate text-xs text-ink/60 sm:text-sm">{brand}</p> : null}
          {community}
          <div className="mt-1.5 sm:mt-2">{badges}</div>
        </div>
        <div className="shrink-0 self-start">
          <AnimalScore score={score} size={38} showLabel={false} />
        </div>
      </div>
    </div>
  );
}
