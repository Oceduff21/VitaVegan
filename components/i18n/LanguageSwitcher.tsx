"use client";

import { LOCALES } from "@/lib/i18n/dictionaries";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();
  return (
    <label className="flex items-center gap-1 text-xs text-ink/70">
      <span className="sr-only">{t("nav.language")}</span>
      <select
        value={locale}
        onChange={(e) => {
          setLocale(e.target.value as typeof locale);
          router.refresh();
        }}
        className="h-10 max-w-[5.5rem] rounded-full border border-ink/10 bg-ink/5 px-3 text-sm font-semibold text-ink sm:max-w-none"
        aria-label={t("nav.language")}
      >
        {LOCALES.map((l) => (
          <option key={l.id} value={l.id}>
            {l.native}
          </option>
        ))}
      </select>
    </label>
  );
}
