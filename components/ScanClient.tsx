"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimalScore } from "@/components/score/AnimalScore";
import { DisambiguateIngredient } from "@/components/vegan/DisambiguateIngredient";
import { CameraScanner } from "@/components/CameraScanner";
import type { IngredientHit } from "@/lib/vegan/analyze";
import type { DisambiguationOption } from "@/data/vegan-terms";
import type { ScoreResult } from "@/lib/score/compassion";
import type { OffProduct } from "@/lib/openfoodfacts/client";
import type { AnalysisResult } from "@/lib/vegan/analyze";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { killAllCameras } from "@/lib/camera";

type ScanPayload = {
  kind: string;
  product: OffProduct;
  analysis: AnalysisResult;
  score: ScoreResult;
};

type CamUi = "idle" | "live" | "denied";

export function ScanClient({ remaining }: { remaining: number | "unlimited" }) {
  const { t, locale } = useI18n();
  const [manual, setManual] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanPayload | null>(null);
  const [hits, setHits] = useState<IngredientHit[]>([]);
  const [saved, setSaved] = useState(false);
  const [cam, setCam] = useState<CamUi>("idle");

  useEffect(() => {
    killAllCameras();
    return () => killAllCameras();
  }, []);

  const stopCamera = useCallback(() => {
    killAllCameras();
    setCam("idle");
  }, []);

  async function runScan(body: { barcode?: string; ingredients?: string }) {
    killAllCameras();
    setCam("idle");
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, lang: locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "not_found" ? t("scan.notFound") : t("scan.fail"));
        setResult(null);
        return;
      }
      setResult(data);
      setHits(data.analysis.hits);
    } finally {
      setLoading(false);
    }
  }

  async function askPermission() {
    setError(null);
    killAllCameras();
    setCam("live");
  }

  function onChoose(original: string, option: DisambiguationOption) {
    setHits((prev) =>
      prev.map((h) =>
        h.original === original
          ? {
              ...h,
              verdict: option.verdict,
              why: option.label,
              rewrite: option.rewrite,
              options: undefined,
            }
          : h,
      ),
    );
  }

  async function eatIt() {
    if (!result) return;
    const res = await fetch("/api/food-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "scan",
        label: result.product.name,
        barcode: result.product.barcode,
        nutrients: result.product.nutrients,
        veganScore: result.score.score,
        veganWhy: result.score.why,
        consumeScan: true,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? t("scan.fail"));
      return;
    }
    setSaved(true);
  }

  const n = result?.product.nutrimentsRaw;
  const info = result?.product.barcodeInfo;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl">{t("scan.title")}</h1>
        <p className="mt-2 max-w-2xl text-ink/70">{t("scan.lead")}</p>
      </div>
      <p className="text-sm text-ink/60">
        {t("scan.remaining")} : {remaining === "unlimited" ? t("scan.unlimited") : remaining}
      </p>

      {cam === "idle" ? (
        <div className="max-w-lg rounded-3xl border border-forest/15 bg-white p-5">
          <p className="display text-xl">{t("scan.permTitle")}</p>
          <p className="mt-2 text-sm text-ink/70">{t("scan.permLead")}</p>
          <button
            type="button"
            onClick={() => void askPermission()}
            className="mt-4 rounded-full bg-forest px-4 py-2 text-cream"
          >
            {t("scan.permAllow")}
          </button>
        </div>
      ) : null}

      {cam === "denied" ? (
        <div className="max-w-lg rounded-3xl border border-terracotta/40 bg-white p-5">
          <p className="text-terracotta">{t("scan.permDenied")}</p>
          <button
            type="button"
            onClick={() => void askPermission()}
            className="mt-3 rounded-full border border-forest px-4 py-2"
          >
            {t("scan.permRetry")}
          </button>
        </div>
      ) : null}

      {cam === "live" ? (
        <CameraScanner
          liveLabel={t("scan.live")}
          stopLabel={t("scan.stopCamera")}
          onStop={stopCamera}
          onDenied={() => {
            killAllCameras();
            setCam("denied");
          }}
          onCode={(code) => void runScan({ barcode: code })}
        />
      ) : null}

      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          stopCamera();
          void runScan({ barcode: manual });
        }}
      >
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder={t("scan.barcodePh")}
          className="flex-1 rounded-full border border-forest/20 bg-white px-4 py-2"
        />
        <button type="submit" className="rounded-full bg-leaf px-4 py-2 text-cream">
          {t("scan.search")}
        </button>
      </form>

      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          stopCamera();
          void runScan({ ingredients });
        }}
      >
        <label className="text-sm">{t("scan.orIngredients")}</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows={3}
          placeholder={t("scan.ingredientsPh")}
          className="rounded-2xl border border-forest/20 bg-white px-4 py-2"
        />
        <button type="submit" className="self-start rounded-full border border-forest px-4 py-2">
          {t("scan.analyze")}
        </button>
      </form>

      {loading ? <p>{t("scan.loading")}</p> : null}
      {error ? <p className="text-terracotta">{error}</p> : null}

      {result ? (
        <article className="flex flex-col gap-4 rounded-3xl bg-white p-5">
          <div className="flex gap-4">
            {result.product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={result.product.image} alt="" className="h-24 w-24 rounded-xl object-cover" />
            ) : null}
            <div>
              <h2 className="text-2xl">{result.product.name || t("scan.manualName")}</h2>
              <p className="text-sm text-ink/60">{result.product.brands}</p>
              {info?.digits ? (
                <p className="mt-1 font-mono text-sm">
                  {t("scan.ref")} {info.format} · {info.gtin || info.digits}
                  {info.origin ? ` · ${t("scan.origin")} ${info.origin}` : ""}
                </p>
              ) : null}
            </div>
          </div>
          <AnimalScore score={result.score.score} />
          <p>{result.score.why}</p>
          {result.analysis.animalHits.length > 0 ? (
            <ul className="list-disc pl-5 text-sm">
              {result.analysis.animalHits.map((h) => (
                <li key={h.original}>
                  {h.original} — {h.why}
                </li>
              ))}
            </ul>
          ) : null}
          <DisambiguateIngredient hits={hits} onChoose={onChoose} />
          {n && (n.energy || n.proteins) ? (
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <p>
                {t("nutri.energy")} : {n.energy} kcal/100g
              </p>
              <p>
                {t("nutri.protein")} : {n.proteins} g
              </p>
              <p>
                {t("nutri.fiber")} : {n.fiber} g
              </p>
              <p>
                {t("nutri.salt")} : {n.salt} g
              </p>
            </div>
          ) : null}
          <button type="button" onClick={() => void eatIt()} className="rounded-full bg-cat px-4 py-2 text-ink">
            {t("scan.eat")}
          </button>
          {saved ? <p className="text-leaf">{t("scan.saved")}</p> : null}
        </article>
      ) : null}
    </div>
  );
}
