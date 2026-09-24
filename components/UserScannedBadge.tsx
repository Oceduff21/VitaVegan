"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";

/** Badge for products contributed / rescanned by users. */
export function UserScannedBadge({
  scanCount,
  className = "",
}: {
  scanCount?: number;
  className?: string;
}) {
  const { t } = useI18n();
  const label =
    typeof scanCount === "number" && scanCount > 1
      ? t("scan.userScannedN").replace("{n}", String(scanCount))
      : t("scan.userScanned");

  return (
    <span
      className={`inline-flex items-center rounded-full bg-leaf/18 px-2.5 py-0.5 text-[0.7rem] font-semibold text-forest ring-1 ring-leaf/35 ${className}`}
    >
      {label}
    </span>
  );
}

/** Badge for recipes published by users (community). */
export function UserRecipeBadge({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  return (
    <span
      className={`inline-flex items-center rounded-full bg-leaf/18 px-2.5 py-0.5 text-[0.7rem] font-semibold text-forest ring-1 ring-leaf/35 ${className}`}
    >
      {t("recipes.userCreated")}
    </span>
  );
}
