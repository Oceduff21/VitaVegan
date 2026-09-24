"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import { VEGAN_GUIDE } from "@/data/vegan-guide";
import { localizeGuide } from "@/lib/i18n/guide";

export function VeganGuide() {
  const { t, locale } = useI18n();
  const sections = localizeGuide(VEGAN_GUIDE, locale);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-ink/50">{t("guide.disclaimer")}</p>
      {sections.map((s) => (
        <article key={s.id} className="rounded-2xl bg-white p-5">
          <h3 className="text-lg font-semibold text-forest sm:text-xl">{s.title}</h3>
          <p className="mt-1 text-sm text-ink/70">{s.lead}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {s.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-sm text-ink/85">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {s.tip ? (
            <p className="mt-3 rounded-xl bg-leaf/12 px-3 py-2 text-sm text-forest">{s.tip}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
