"use client";

import { LOCALES } from "@/lib/i18n/dictionaries";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <label className="flex items-center gap-1 text-xs text-ink/70">
      <span className="sr-only">{t("nav.language")}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
        className="rounded-full border border-forest/20 bg-white px-2 py-1 text-sm text-ink"
        aria-label={t("nav.language")}
      >
        {LOCALES.map((l) => (
          <option key={l.id} value={l.id}>
            {l.native} · {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
