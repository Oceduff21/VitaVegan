"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { emptyNutrients, type NutrientKey, type NutrientMap } from "@/data/daily-needs";

type Preset = {
  id: string;
  labelKey: string;
  nutrients: Partial<NutrientMap>;
};

const PRESETS: Preset[] = [
  { id: "b12-daily", labelKey: "supp.b12daily", nutrients: { b12: 25 } },
  { id: "b12-weekly", labelKey: "supp.b12weekly", nutrients: { b12: 250 } },
  { id: "d", labelKey: "supp.vitaminD", nutrients: { vitaminD: 25 } },
  { id: "iodine", labelKey: "supp.iodine", nutrients: { iodine: 150 } },
  { id: "algae", labelKey: "supp.algae", nutrients: { omega3: 0.25 } },
];

export function SupplementLogger() {
  const { t } = useI18n();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function log(preset: Preset) {
    setBusy(preset.id);
    setError(null);
    setOk(null);
    const nutrients = { ...emptyNutrients(), ...preset.nutrients };
    const res = await fetch("/api/food-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "supplement",
        label: t(preset.labelKey),
        nutrients,
        veganScore: 5,
        veganWhy: t("supp.why"),
        consumeScan: false,
      }),
    });
    setBusy(null);
    if (!res.ok) {
      setError(t("supp.fail"));
      return;
    }
    setOk(preset.id);
    router.refresh();
  }

  return (
    <section className="rounded-3xl bg-white p-4 ring-1 ring-ink/8">
      <h2 className="text-lg font-semibold">{t("supp.title")}</h2>
      <p className="mt-1 text-sm text-ink/65">{t("supp.lead")}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={busy === p.id}
            onClick={() => void log(p)}
            className="chip min-h-11 border-forest/25"
          >
            {busy === p.id ? "…" : t(p.labelKey)}
            {ok === p.id ? " ✓" : ""}
          </button>
        ))}
      </div>
      {error ? <p className="mt-2 text-sm text-terracotta">{error}</p> : null}
      <p className="mt-2 text-[0.7rem] text-ink/45">{t("supp.disclaimer")}</p>
    </section>
  );
}

export type { NutrientKey };
