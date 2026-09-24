"use client";

import { useState } from "react";
import type { PlanetContext } from "@/lib/planet";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function PlanetExtras({ planet }: { planet: PlanetContext }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const palm =
    planet.palmOil === "present" ? t("planet.palmYes") : planet.palmOil === "none" ? t("planet.palmNo") : t("planet.palmUnk");
  return (
    <div className="rounded-2xl border border-dashed border-forest/25 p-3 text-sm">
      <button type="button" className="font-medium underline" onClick={() => setOpen((v) => !v)}>
        {open ? t("planet.hide") : t("planet.show")}
      </button>
      {open ? (
        <ul className="mt-2 space-y-1 text-ink/75">
          <li>
            {t("planet.eco")} : {planet.ecoGrade ? planet.ecoGrade.toUpperCase() : "—"}
          </li>
          <li>
            {t("planet.palm")} : {palm}
          </li>
          <li>
            {t("planet.origin")} : {planet.origin || "—"}
          </li>
          <li className="text-xs text-ink/50">{t("planet.note")}</li>
        </ul>
      ) : null}
    </div>
  );
}
