"use client";

import type { ReactNode } from "react";
import { IconAlert, IconBunny, IconHelp, IconLeaf } from "@/components/nav-icons";
import type { BeautyVeganStatus } from "@/data/beauty-brands";
import type { CrueltyStatus } from "@/lib/cruelty";

export type BadgeTone = "ok" | "warn" | "muted" | "vegan";

export function StatusBadge({
  tone,
  icon,
  children,
}: {
  tone: BadgeTone;
  icon: ReactNode;
  children: ReactNode;
}) {
  const tones: Record<BadgeTone, string> = {
    ok: "bg-leaf/18 text-forest ring-1 ring-leaf/35",
    vegan: "bg-forest/12 text-forest ring-1 ring-forest/30",
    warn: "bg-terracotta/15 text-terracotta ring-1 ring-terracotta/30",
    muted: "bg-sand/80 text-ink/55 ring-1 ring-ink/10",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${tones[tone]}`}>
      {icon}
      {children}
    </span>
  );
}

/** Unified vegan + cruelty-free badges for scan / history / compare / brands. */
export function VerdictBadges({
  cruelty,
  vegan,
  offVegan,
  t,
  className = "",
}: {
  cruelty?: CrueltyStatus | string | null;
  vegan?: BeautyVeganStatus | null;
  /** Open Food Facts en:vegan label */
  offVegan?: boolean | null;
  t: (k: string) => string;
  className?: string;
}) {
  const c = cruelty === "free" || cruelty === "tested" || cruelty === "unknown" ? cruelty : null;
  const showVeganYes = vegan === "yes" || offVegan === true;
  const showVeganMixed = vegan === "mixed";
  const showVeganNo = vegan === "no" || offVegan === false;

  if (!c && !showVeganYes && !showVeganMixed && !showVeganNo) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {c === "free" ? (
        <StatusBadge tone="ok" icon={<IconBunny className="h-3.5 w-3.5" />}>
          {t("brands.badge.cf")}
        </StatusBadge>
      ) : null}
      {c === "tested" ? (
        <StatusBadge tone="warn" icon={<IconAlert className="h-3.5 w-3.5" />}>
          {t("brands.badge.tested")}
        </StatusBadge>
      ) : null}
      {c === "unknown" ? (
        <StatusBadge tone="muted" icon={<IconHelp className="h-3.5 w-3.5" />}>
          {t("brands.badge.unknown")}
        </StatusBadge>
      ) : null}
      {showVeganYes ? (
        <StatusBadge tone="vegan" icon={<IconLeaf className="h-3.5 w-3.5" />}>
          {t("brands.badge.vegan")}
        </StatusBadge>
      ) : null}
      {showVeganMixed ? (
        <StatusBadge tone="vegan" icon={<IconLeaf className="h-3.5 w-3.5" />}>
          {t("brands.badge.veganMixed")}
        </StatusBadge>
      ) : null}
      {showVeganNo && !showVeganYes ? (
        <StatusBadge tone="muted" icon={<IconLeaf className="h-3.5 w-3.5 opacity-50" />}>
          {t("brands.badge.notVegan")}
        </StatusBadge>
      ) : null}
    </div>
  );
}

export function BadgeLegend({ t }: { t: (k: string) => string }) {
  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/70 px-3 py-2.5 text-[0.7rem] text-ink/65"
      aria-label={t("brands.legend")}
    >
      <span className="font-medium text-ink/80">{t("brands.legend")}</span>
      <span className="inline-flex items-center gap-1">
        <IconBunny className="h-3.5 w-3.5 text-forest" />
        {t("brands.badge.cf")}
      </span>
      <span className="text-ink/25">·</span>
      <span className="inline-flex items-center gap-1">
        <IconLeaf className="h-3.5 w-3.5 text-forest" />
        {t("brands.badge.vegan")}
      </span>
      <span className="text-ink/25">·</span>
      <span className="inline-flex items-center gap-1">
        <IconAlert className="h-3.5 w-3.5 text-terracotta" />
        {t("brands.badge.tested")}
      </span>
    </div>
  );
}
