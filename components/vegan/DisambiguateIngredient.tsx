"use client";

import type { IngredientHit } from "@/lib/vegan/analyze";
import type { DisambiguationOption } from "@/data/vegan-terms";
import { useI18n } from "@/components/i18n/LanguageProvider";

type Props = {
  hits: IngredientHit[];
  onChoose: (originalLine: string, option: DisambiguationOption) => void;
};

export function DisambiguateIngredient({ hits, onChoose }: Props) {
  const { t } = useI18n();
  const ambiguous = hits.filter((h) => h.verdict === "ambigu" && h.options?.length);

  if (ambiguous.length === 0) return null;

  return (
    <div className="anim-wiggle flex flex-col gap-4 rounded-2xl border border-rabbit/40 bg-white p-4">
      <p className="display text-xl">{t("disamb.title")}</p>
      <p className="text-sm text-ink/70">{t("disamb.lead")}</p>
      {ambiguous.map((hit) => (
        <div key={hit.original} className="border-t border-sand pt-3">
          <p className="mb-2 text-sm">
            <span className="font-medium">{hit.original}</span>
            <span className="text-ink/60"> — {hit.question}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {hit.options!.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChoose(hit.original, opt)}
                className={`min-h-11 rounded-full border px-3 py-2 text-sm ${
                  opt.verdict === "animal_certain"
                    ? "border-cow/40 hover:bg-cow/10"
                    : opt.verdict === "ambigu"
                      ? "border-rabbit/40 hover:bg-sand"
                      : "border-leaf/40 hover:bg-leaf/10"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
