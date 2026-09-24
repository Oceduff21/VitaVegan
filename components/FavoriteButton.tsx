"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function FavoriteButton({ recipeId, initial }: { recipeId: string; initial: boolean }) {
  const { t } = useI18n();
  const [on, setOn] = useState(initial);
  return (
    <button
      type="button"
      className={`chip ${on ? "border-leaf bg-leaf/15 text-forest" : ""}`}
      onClick={async () => {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeId }),
        });
        if (res.status === 401) {
          window.location.href = "/connexion";
          return;
        }
        const data = await res.json();
        if (res.ok) setOn(Boolean(data.on));
      }}
    >
      {on ? t("fav.remove") : t("fav.add")}
    </button>
  );
}
