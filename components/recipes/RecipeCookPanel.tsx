"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { AddToShoppingButton } from "@/components/AddToShoppingButton";
import { LogRecipeButton } from "@/components/LogRecipeButton";
import { scaleIngredients, scaleNutrients } from "@/lib/recipe-scale";
import type { RecipeTasting } from "@/data/recipe-serve";

export function RecipeCookPanel({
  slug,
  title,
  baseServings,
  ingredients,
  steps,
  gear,
  tasting,
  nutrients,
  veganScore,
  veganWhy,
  signedIn,
}: {
  slug: string;
  title: string;
  baseServings: number;
  ingredients: { text: string; amount?: string }[];
  steps: string[];
  gear: string[];
  tasting: RecipeTasting;
  nutrients: string;
  veganScore: number;
  veganWhy: string;
  signedIn: boolean;
}) {
  const { t } = useI18n();
  const min = 1;
  const max = 12;
  const start = Math.min(max, Math.max(min, baseServings || 2));
  const [people, setPeople] = useState(start);
  const [checkedIng, setCheckedIng] = useState<Record<number, boolean>>({});
  const [checkedStep, setCheckedStep] = useState<Record<number, boolean>>({});

  const scaled = useMemo(
    () => scaleIngredients(ingredients, baseServings || 1, people),
    [ingredients, baseServings, people],
  );
  const scaledNutrients = useMemo(
    () => JSON.stringify(scaleNutrients(nutrients, baseServings || 1, people)),
    [nutrients, baseServings, people],
  );

  function bump(delta: number) {
    setPeople((n) => Math.min(max, Math.max(min, n + delta)));
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="recipe-people">
        <p className="text-sm font-medium">{t("recipes.forPeople")}</p>
        <div className="recipe-people-row">
          <button type="button" className="recipe-people-btn" onClick={() => bump(-1)} aria-label={t("recipes.peopleLess")}>
            −
          </button>
          <p className="recipe-people-n" aria-live="polite">
            {people} {t("recipes.people")}
          </p>
          <button type="button" className="recipe-people-btn" onClick={() => bump(1)} aria-label={t("recipes.peopleMore")}>
            +
          </button>
        </div>
        <p className="text-xs text-ink/55">
          {t("recipes.adapted").replace("{n}", String(baseServings))}
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-2xl">{t("recipes.ingredients")}</h2>
        <ul className="recipe-ings">
          {scaled.map((ing, i) => {
            const on = Boolean(checkedIng[i]);
            return (
              <li key={`${ing.text}-${i}`}>
                <button
                  type="button"
                  className={`recipe-check ${on ? "is-on" : ""}`}
                  aria-pressed={on}
                  aria-label={on ? t("recipes.uncheck") : t("recipes.check")}
                  onClick={() => setCheckedIng((prev) => ({ ...prev, [i]: !prev[i] }))}
                >
                  {on ? "✓" : ""}
                </button>
                {ing.amount ? <span className={`recipe-qty ${on ? "line-through opacity-50" : ""}`}>{ing.amount}</span> : null}
                <span className={on ? "line-through opacity-50" : ""}>{ing.text}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {gear.length > 0 ? (
        <section>
          <h2 className="mb-3 text-2xl">{t("recipes.gear")}</h2>
          <ul className="recipe-gear">
            {gear.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="mb-3 text-2xl">{t("recipes.steps")}</h2>
        <ol className="recipe-steps">
          {steps.map((s, i) => {
            const on = Boolean(checkedStep[i]);
            return (
              <li key={i} className={on ? "opacity-55" : ""}>
                <button
                  type="button"
                  className={`recipe-step-n ${on ? "is-done" : ""}`}
                  aria-pressed={on}
                  onClick={() => setCheckedStep((prev) => ({ ...prev, [i]: !prev[i] }))}
                >
                  {on ? "✓" : i + 1}
                </button>
                <p className={on ? "line-through" : ""}>{s}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="recipe-taste">
        <h2 className="mb-3 text-2xl">{t("recipes.tasting")}</h2>
        {tasting.tip ? (
          <p className="rounded-2xl bg-sand/70 p-4 text-sm">{tasting.tip}</p>
        ) : null}
        {tasting.sides.length > 0 ? (
          <div className="mt-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-leaf">{t("recipes.sides")}</h3>
            <ul className="mt-1 list-disc pl-5 text-sm">
              {tasting.sides.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {tasting.drinks.length > 0 ? (
          <div className="mt-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-leaf">{t("recipes.drinks")}</h3>
            <ul className="mt-1 list-disc pl-5 text-sm">
              {tasting.drinks.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {signedIn ? (
        <>
          <AddToShoppingButton slug={slug} items={scaled} />
          <LogRecipeButton
            slug={slug}
            label={`${title} (${people} ${t("recipes.people")})`}
            nutrients={scaledNutrients}
            veganScore={veganScore}
            veganWhy={veganWhy}
          />
        </>
      ) : null}
    </div>
  );
}
