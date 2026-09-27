"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";

/** Toggle product favorite from scan / history (premium). */
export function ProductFavoriteButton({
  barcode,
  kind,
  name,
  image,
  veganScore,
  initial = false,
  compact = false,
}: {
  barcode: string;
  kind: string;
  name?: string;
  image?: string | null;
  veganScore?: number;
  initial?: boolean;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const [on, setOn] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needPremium, setNeedPremium] = useState(false);

  if (!barcode) return null;

  return (
    <span className={`inline-flex ${compact ? "flex-row items-center gap-1.5" : "flex-col items-start gap-1"}`}>
      <button
        type="button"
        disabled={busy}
        className={`${compact ? "chip text-xs" : "btn btn-secondary"} ${on ? "border-leaf bg-leaf/15 text-forest" : ""} ${busy ? "opacity-60" : ""}`}
        onClick={async () => {
          if (busy) return;
          setBusy(true);
          setError(null);
          setNeedPremium(false);
          try {
            const res = await fetch("/api/history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: on ? "unfav" : undefined,
                barcode,
                kind,
                name,
                image: image ?? "",
                veganScore: veganScore ?? 0,
              }),
            });
            if (res.status === 401) {
              window.location.href = "/connexion";
              return;
            }
            if (res.status === 402) {
              setNeedPremium(true);
              return;
            }
            const data = (await res.json()) as { fav?: boolean; ok?: boolean };
            if (!res.ok) {
              setError(t("fav.fail"));
              return;
            }
            setOn(Boolean(data.fav ?? !on));
          } catch {
            setError(t("fav.fail"));
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "…" : on ? t("fav.remove") : t("scan.addFav")}
      </button>
      {needPremium ? (
        <Link href="/compte?locked=1" className="text-xs font-semibold text-forest underline">
          {t("account.upgrade")}
        </Link>
      ) : null}
      {error ? <span className="text-xs text-terracotta">{error}</span> : null}
    </span>
  );
}
