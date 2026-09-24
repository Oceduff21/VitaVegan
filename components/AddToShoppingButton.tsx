"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function AddToShoppingButton({
  slug,
  items,
}: {
  slug: string;
  items: { text: string; amount?: string }[];
}) {
  const { t } = useI18n();
  const [ok, setOk] = useState(false);

  async function add() {
    const res = await fetch("/api/shopping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          text: `${i.amount ? `${i.amount} ` : ""}${i.text}`,
          recipeSlug: slug,
        })),
      }),
    });
    if (res.ok) setOk(true);
  }

  return (
    <div>
      <button type="button" onClick={() => void add()} className="min-h-12 w-full rounded-full border border-forest px-4 py-3">
        {t("shop.fromRecipe")}
      </button>
      {ok ? (
        <p className="mt-2 text-sm text-leaf">
          {t("shop.added")}{" "}
          <a href="/courses" className="underline">
            {t("shop.open")}
          </a>
        </p>
      ) : null}
    </div>
  );
}
