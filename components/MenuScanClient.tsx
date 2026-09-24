"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { analyzeMenuText, type MenuLine } from "@/lib/menu";
import { ocrLabel } from "@/lib/ocr";
import { PhotoPicker } from "@/components/PhotoPicker";
import { AnimalScore } from "@/components/score/AnimalScore";
import { compassionScore } from "@/lib/score/compassion";
import { analyzeIngredients } from "@/lib/vegan/analyze";

export function MenuScanClient() {
  const { t } = useI18n();
  const [photo, setPhoto] = useState("");
  const [busy, setBusy] = useState(false);
  const [raw, setRaw] = useState("");
  const [lines, setLines] = useState<MenuLine[]>([]);

  async function fromPhoto(dataUrl: string) {
    setPhoto(dataUrl);
    if (!dataUrl) return;
    setBusy(true);
    try {
      const blob = await fetch(dataUrl).then((r) => r.blob());
      const file = new File([blob], "menu.jpg", { type: blob.type || "image/jpeg" });
      const text = await ocrLabel(file);
      setRaw(text);
      setLines(analyzeMenuText(text));
    } finally {
      setBusy(false);
    }
  }

  function runText() {
    setLines(analyzeMenuText(raw));
  }

  const vegan = lines.filter((l) => l.hit.verdict === "vegetal_certain" && l.traps.length === 0);
  const traps = lines.filter((l) => l.traps.length > 0 || l.hit.verdict === "animal_certain");
  const overall = analyzeIngredients(lines.map((l) => l.text));
  const score = compassionScore(overall);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl sm:text-3xl">{t("menu.title")}</h1>
        <p className="mt-2 text-sm text-ink/70">{t("menu.lead")}</p>
      </div>
      <PhotoPicker label={t("menu.photo")} value={photo} onChange={(v) => void fromPhoto(v)} />
      {busy ? <p className="anim-soft-pulse">{t("scan.ocrRun")}</p> : null}
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={6}
        placeholder={t("menu.ph")}
        className="field"
      />
      <button type="button" onClick={runText} className="btn btn-primary w-full sm:w-auto">
        {t("menu.analyze")}
      </button>
      {lines.length ? (
        <>
          <AnimalScore score={score.score} />
          <section>
            <h2 className="mb-2 text-xl">{t("menu.vegan")}</h2>
            <ul className="flex flex-col gap-2">
              {vegan.length === 0 ? <li className="text-sm text-ink/60">{t("menu.noneVegan")}</li> : null}
              {vegan.map((l) => (
                <li key={l.text} className="rounded-2xl bg-leaf/10 px-4 py-3 text-sm">
                  {l.text}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="mb-2 text-xl">{t("menu.traps")}</h2>
            <ul className="flex flex-col gap-2">
              {traps.length === 0 ? <li className="text-sm text-ink/60">{t("menu.noneTrap")}</li> : null}
              {traps.map((l) => (
                <li key={l.text} className="rounded-2xl bg-terracotta/10 px-4 py-3 text-sm">
                  <p>{l.text}</p>
                  <p className="text-terracotta">
                    {l.traps.map((id) => t(`menu.trap.${id}`)).join(" · ") || l.hit.why}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </div>
  );
}
