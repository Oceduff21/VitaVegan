"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import type { AllergenHit } from "@/lib/allergens";

export function AllergenBanner({ hits }: { hits: AllergenHit[] }) {
  const { t } = useI18n();
  if (!hits.length) return null;
  const labels = hits.map((h) => (h.labelKey.startsWith("pref.") ? t(h.labelKey) : h.labelKey));
  return (
    <p className="rounded-2xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta">
      <strong>{t("scan.allergy")}</strong> {labels.join(" · ")}
    </p>
  );
}
