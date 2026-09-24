"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { nutrientCoverage, portionFromRecipeNutrients } from "@/lib/nutrition/gauges";

export function LogRecipeButton({
  slug,
  title,
  nutrients,
  servings,
  veganScore,
  veganWhy,
}: {
  slug: string;
  title: string;
  nutrients: string;
  servings: number;
  veganScore: number;
  veganWhy: string;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastEarn, setLastEarn] = useState<{ earned: number; challenge: boolean } | null>(null);
  const portion = portionFromRecipeNutrients(nutrients, servings || 1);
  const empty = nutrientCoverage(portion).isEmpty;
  const kcal = Math.round(portion.calories || 0);

  return (
    <div className="rounded-2xl bg-sand/40 p-4">
      <p className="text-sm font-semibold text-ink">{t("recipes.addPortion")}</p>
      <p className="mt-1 text-sm text-ink/65">{t("recipes.addPortionLead")}</p>
      <p className="mt-1 text-xs text-leaf">{t("leaf.earnHint")}</p>
      {empty ? <p className="mt-2 text-sm text-terracotta">{t("gauge.noNutrients")}</p> : null}
      {!empty && kcal > 0 ? (
        <p className="mt-2 text-xs text-ink/50">
          {t("recipes.portionEstimate").replace("{kcal}", String(kcal)).replace("{protein}", String(portion.protein || 0))}
        </p>
      ) : null}
      <button
        type="button"
        className="btn btn-accent mt-3 w-full"
        disabled={empty || busy}
        onClick={async () => {
          setError(null);
          setBusy(true);
          const res = await fetch("/api/food-log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind: "recipe",
              label: t("recipes.portionLabel").replace("{title}", title),
              barcode: slug,
              nutrients: portion,
              veganScore,
              veganWhy,
            }),
          });
          setBusy(false);
          if (!res.ok) {
            setError(t("scan.fail"));
            return;
          }
          const json = (await res.json()) as {
            leafEarned?: number;
            challengeBonus?: boolean;
          };
          if (typeof json.leafEarned === "number" && json.leafEarned > 0) {
            setLastEarn({ earned: json.leafEarned, challenge: Boolean(json.challengeBonus) });
          }
          setCount((c) => c + 1);
          router.refresh();
        }}
      >
        {busy ? "…" : t("recipes.addPortionBtn")}
      </button>
      {error ? <p className="mt-2 text-sm text-terracotta">{error}</p> : null}
      {count > 0 ? (
        <p className="mt-2 text-sm text-leaf">
          {t("recipes.portionsAdded").replace("{n}", String(count))}
        </p>
      ) : null}
      {lastEarn ? (
        <p className="mt-1 text-sm font-medium text-forest">
          {lastEarn.challenge
            ? t("leaf.earnedChallenge").replace("{n}", String(lastEarn.earned))
            : t("leaf.earned").replace("{n}", String(lastEarn.earned))}
        </p>
      ) : null}
      <p className="mt-2 text-[0.7rem] text-ink/45">{t("recipes.portionDisclaimer")}</p>
    </div>
  );
}
