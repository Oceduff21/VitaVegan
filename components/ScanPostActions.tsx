"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { MEAL_SLOTS, WEEKDAY_KEYS } from "@/lib/week-slots";

export function ScanPostActions({
  name,
  barcode,
  kind,
}: {
  name: string;
  barcode?: string;
  kind?: string;
  score?: number;
  image?: string;
}) {
  const { t } = useI18n();
  const [dayIndex, setDayIndex] = useState(0);
  const [slot, setSlot] = useState<(typeof MEAL_SLOTS)[number]>("lunch");
  const [shopOk, setShopOk] = useState(false);
  const [mealOk, setMealOk] = useState(false);
  const [busy, setBusy] = useState(false);

  async function addShopping() {
    setBusy(true);
    try {
      const res = await fetch("/api/shopping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ text: name, barcode: barcode ?? "", kind: kind ?? "food", source: "scan" }],
        }),
      });
      setShopOk(res.ok);
    } finally {
      setBusy(false);
    }
  }

  async function planMeal() {
    setBusy(true);
    try {
      const res = await fetch("/api/meal-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayIndex,
          slot,
          label: name,
          barcode: barcode ?? "",
        }),
      });
      setMealOk(res.ok);
    } finally {
      setBusy(false);
    }
  }

  const compareHref = barcode ? `/comparer?a=${encodeURIComponent(barcode)}` : "/comparer";

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-sand/30 p-3">
      <button type="button" className="btn btn-secondary w-full" disabled={busy} onClick={() => void addShopping()}>
        {shopOk ? t("scan.saved") : t("scan.addShop")}
      </button>
      <Link href={compareHref} className="btn btn-secondary w-full text-center">
        {t("cmp.title")}
      </Link>
      <div className="flex flex-col gap-1.5 rounded-xl bg-white/80 p-2">
        <p className="text-xs font-semibold text-ink/70">{t("scan.planMeal")}</p>
        <div className="flex flex-wrap gap-1">
          {WEEKDAY_KEYS.map((key, i) => (
            <button
              key={key}
              type="button"
              className={`chip tap text-xs ${dayIndex === i ? "bg-leaf/20 ring-1 ring-forest" : ""}`}
              onClick={() => setDayIndex(i)}
            >
              {t(key)}
            </button>
          ))}
        </div>
        <select
          value={slot}
          onChange={(e) => setSlot(e.target.value as (typeof MEAL_SLOTS)[number])}
          className="min-h-10 rounded-full border border-forest/20 px-3 text-sm"
        >
          {MEAL_SLOTS.map((s) => (
            <option key={s} value={s}>
              {t(`meal.${s}`)}
            </option>
          ))}
        </select>
        <Link
          href={`/recettes?q=${encodeURIComponent(name.split(/\s+/).slice(0, 3).join(" "))}`}
          className="text-xs text-forest underline"
        >
          {t("scan.recipesFrom")}
        </Link>
        <button type="button" className="btn btn-primary w-full" disabled={busy} onClick={() => void planMeal()}>
          {mealOk ? t("scan.saved") : t("scan.planMeal")}
        </button>
      </div>
    </div>
  );
}
