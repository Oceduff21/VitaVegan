"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function FavoriteButton({ recipeId, initial }: { recipeId: string; initial: boolean }) {
  const { t } = useI18n();
  const [on, setOn] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={busy}
        className={`chip ${on ? "border-leaf bg-leaf/15 text-forest" : ""} ${busy ? "opacity-60" : ""}`}
        onClick={async () => {
          if (busy) return;
          setBusy(true);
          setError(null);
          try {
            const res = await fetch("/api/favorites", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ recipeId }),
            });
            if (res.status === 401) {
              window.location.href = "/connexion";
              return;
            }
            const data = (await res.json()) as { on?: boolean };
            if (!res.ok) {
              setError(t("fav.fail"));
              return;
            }
            setOn(Boolean(data.on));
          } catch {
            setError(t("fav.fail"));
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "…" : on ? t("fav.remove") : t("fav.add")}
      </button>
      {error ? <span className="text-xs text-terracotta">{error}</span> : null}
    </span>
  );
}
