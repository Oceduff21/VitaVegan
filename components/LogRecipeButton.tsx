"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function LogRecipeButton({
  slug,
  label,
  nutrients,
  veganScore,
  veganWhy,
}: {
  slug: string;
  label: string;
  nutrients: string;
  veganScore: number;
  veganWhy: string;
}) {
  const { t } = useI18n();
  const [ok, setOk] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="btn btn-accent w-full"
        onClick={async () => {
          await fetch("/api/food-log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind: "recipe",
              label,
              barcode: slug,
              nutrients: JSON.parse(nutrients || "{}"),
              veganScore,
              veganWhy,
            }),
          });
          setOk(true);
        }}
      >
        {t("recipes.cook")}
      </button>
      {ok ? <p className="mt-2 text-leaf">{t("recipes.cookOk")}</p> : null}
    </div>
  );
}
