"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimalScore } from "@/components/score/AnimalScore";
import { ScanResultLayout, ScanStickyHead } from "@/components/ScanResultLayout";
import { DisambiguateIngredient } from "@/components/vegan/DisambiguateIngredient";
import { CameraScanner } from "@/components/CameraScanner";
import type { IngredientHit } from "@/lib/vegan/analyze";
import type { DisambiguationOption } from "@/data/vegan-terms";
import type { ScoreResult } from "@/lib/score/compassion";
import type { OffProduct } from "@/lib/openfoodfacts/client";
import type { AnalysisResult } from "@/lib/vegan/analyze";
import type { PlanetContext } from "@/lib/planet";
import type { AllergenHit } from "@/lib/allergens";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { prefersReducedMotion } from "@/lib/motion";
import { CreateProductForm } from "@/components/CreateProductForm";
import { AllergenBanner } from "@/components/AllergenBanner";
import { PlanetExtras } from "@/components/PlanetExtras";
import { ReportButton } from "@/components/ReportButton";
import { ShortcutPills } from "@/components/ShortcutPills";
import { SearchRow } from "@/components/ui/SearchRow";
import { VerdictBadges } from "@/components/ui/StatusBadge";
import { useScanCamera } from "@/components/useScanCamera";
import { BarcodeScanArt } from "@/components/BarcodeScanArt";
import { IngredientsLabelScan } from "@/components/IngredientsLabelScan";
import { UserScannedBadge } from "@/components/UserScannedBadge";
import { isEdible, kindI18nKey, showsCruelty, type ArticleKind } from "@/lib/article-kind";
import { nutrientCoverage } from "@/lib/nutrition/gauges";
import { scaleNutrients as scaleMap } from "@/lib/nutrition/scale";
import { ScanPostActions } from "@/components/ScanPostActions";
import { ShareScoreCard } from "@/components/ShareScoreCard";

type ScanKind = "food" | "beauty" | ArticleKind;

type CommunityMeta = { userScanned?: boolean; scanCount?: number; source?: string };

type FoodPayload = {
  kind: string;
  product: OffProduct;
  analysis: AnalysisResult;
  score: ScoreResult;
  planet?: PlanetContext;
  allergens?: AllergenHit[];
};

type BeautyPayload = {
  product: {
    name: string;
    brands: string;
    image: string | null;
    cruelty: string;
    crueltyWhy: string;
    barcode?: string;
  };
  score: { score: number; why: string };
  analysis: { animalHits: IngredientHit[]; hits: IngredientHit[] };
};

type GoodsPayload = {
  kind: ArticleKind;
  product: {
    name: string;
    brands: string;
    image: string | null;
    cruelty?: string;
    crueltyWhy?: string;
    barcode?: string;
    ingredientsText?: string;
  };
  score: { score: number; why: string };
  analysis: { animalHits: IngredientHit[]; hits: IngredientHit[] };
};

const OFFLINE_KEY = "verdegan-last-scans";
const LAST_COMPARE_KEY = "verdegan-last-compare-a";

function rememberCompareBarcode(barcode?: string) {
  const digits = (barcode ?? "").replace(/\D/g, "");
  if (!digits) return;
  try {
    sessionStorage.setItem(LAST_COMPARE_KEY, digits);
  } catch {
    /* ignore */
  }
}

function rememberOffline(entry: { name: string; score: number; cruelty?: string }) {
  try {
    const prev = JSON.parse(localStorage.getItem(OFFLINE_KEY) || "[]") as unknown[];
    const next = [entry, ...prev].slice(0, 12);
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

function ScanSkeleton() {
  return (
    <div className="anim-soft-pulse flex flex-col gap-3 rounded-3xl bg-white p-5" aria-busy>
      <div className="h-3 w-24 rounded bg-sand" />
      <div className="flex gap-3">
        <div className="h-20 w-20 shrink-0 rounded-xl bg-sand" />
        <div className="flex flex-1 flex-col gap-2 pt-1">
          <div className="h-5 w-[75%] rounded bg-sand" />
          <div className="h-3 w-[45%] rounded bg-sand" />
          <div className="h-6 w-40 rounded-full bg-sand" />
        </div>
      </div>
      <div className="h-16 rounded-2xl bg-sand" />
    </div>
  );
}

export function ScanClient({
  remaining: remainingProp,
  fullApp,
}: {
  remaining: number | "unlimited";
  fullApp: boolean;
}) {
  const { t, locale } = useI18n();
  const sp = useSearchParams();
  const brandHint = sp.get("brand") ?? "";
  const cam = useScanCamera();
  const [kind, setKind] = useState<ScanKind>(brandHint ? "beauty" : "food");
  const [manual, setManual] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [food, setFood] = useState<FoodPayload | null>(null);
  const [beauty, setBeauty] = useState<BeautyPayload | null>(null);
  const [goods, setGoods] = useState<GoodsPayload | null>(null);
  const [hits, setHits] = useState<IngredientHit[]>([]);
  const [saved, setSaved] = useState(false);
  const [missingCode, setMissingCode] = useState<string | null>(null);
  const [grams, setGrams] = useState(100);
  const [faved, setFaved] = useState(false);
  const [remaining, setRemaining] = useState(remainingProp);
  const [community, setCommunity] = useState<CommunityMeta | null>(null);

  useEffect(() => {
    setRemaining(remainingProp);
  }, [remainingProp]);

  function startScan() {
    cam.resume();
  }

  function resetResult() {
    setFood(null);
    setBeauty(null);
    setGoods(null);
    setHits([]);
    setError(null);
    setSaved(false);
    setFaved(false);
    setMissingCode(null);
    setCommunity(null);
  }

  function newScan() {
    resetResult();
    cam.resume();
  }

  function finishScan() {
    resetResult();
    cam.pause();
  }

  async function runScan(body: { barcode?: string; ingredients?: string }) {
    cam.pause();
    setLoading(true);
    setError(null);
    setSaved(false);
    setFaved(false);
    setMissingCode(null);
    setFood(null);
    setBeauty(null);
    setGoods(null);
    setCommunity(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, lang: locale }),
      });
      const data = await res.json();
      if (data.remaining === "unlimited" || typeof data.remaining === "number") {
        setRemaining(data.remaining);
      }
      if (!res.ok) {
        if (data.error === "not_found") {
          setMissingCode(body.barcode ?? "");
          setError(t("scan.notFound"));
        } else if (data.error === "quota") {
          setError(t("account.upgradeLead"));
        } else {
          setError(t("scan.fail"));
        }
        return;
      }
      if (data.community?.userScanned) {
        setCommunity(data.community);
      }
      if (data.kind === "cosmetic") {
        setKind("beauty");
        setBeauty(data);
        setHits(data.analysis.hits);
        rememberCompareBarcode(data.product.barcode);
        rememberOffline({
          name: data.product.name,
          score: data.score.score,
          cruelty: data.product.cruelty,
        });
      } else if (data.kind === "product" || data.kind === "manual" || data.kind === "food") {
        setKind("food");
        setFood(data);
        setHits(data.analysis.hits);
        setGrams(100);
        rememberCompareBarcode(data.product.barcode);
        rememberOffline({ name: data.product.name || "Scan", score: data.score.score });
      } else {
        setKind(data.kind as ArticleKind);
        setGoods(data);
        setHits(data.analysis.hits);
        rememberCompareBarcode(data.product.barcode);
        rememberOffline({
          name: data.product.name,
          score: data.score.score,
          cruelty: data.product.cruelty,
        });
      }
      requestAnimationFrame(() => {
        document.getElementById("scan-result")?.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
      });
    } finally {
      setLoading(false);
    }
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
    if (!food) return;
    const coverage = nutrientCoverage(food.product.nutrients);
    if (coverage.isEmpty) {
      setError(t("gauge.noNutrients"));
      return;
    }
    const nutrients = scaleMap(food.product.nutrients, grams / 100);
    const res = await fetch("/api/food-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "scan",
        label: `${food.product.name || t("scan.manualName")} (${grams} g)`,
        barcode: food.product.barcode,
        nutrients,
        veganScore: food.score.score,
        veganWhy: food.score.why,
        consumeScan: false,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? t("scan.fail"));
      return;
    }
    setSaved(true);
  }

  async function fav() {
    const barcode = food?.product.barcode || beauty?.product.barcode || goods?.product.barcode;
    const name = food?.product.name || beauty?.product.name || goods?.product.name;
    const image = food?.product.image || beauty?.product.image || goods?.product.image;
    const score = food?.score.score ?? beauty?.score.score ?? goods?.score.score;
    const favKind = food ? "food" : beauty ? "cosmetic" : (goods?.kind ?? "other");
    if (!barcode) return;
    const res = await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barcode,
        kind: favKind,
        name,
        image,
        veganScore: score,
      }),
    });
    if (res.ok) setFaved(true);
  }

  const n = food?.product.nutrimentsRaw;
  const info = food?.product.barcodeInfo;
  const factor = grams / 100;
  const hasResult = Boolean(food || beauty || goods || missingCode !== null);
  const canFav = Boolean(food?.product.barcode || beauty?.product.barcode || goods?.product.barcode);
  const recipeQuery = food?.product.name || food?.product.brands || "";

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-3xl">{t("scan.title")}</h1>
        {!hasResult ? <p className="mt-2 text-sm text-ink/70 sm:max-w-2xl sm:text-base">{t("scan.lead")}</p> : null}
        {!fullApp ? <p className="mt-2 text-sm text-terracotta">{t("scan.infoOnly")}</p> : null}
        {brandHint && !hasResult ? (
          <p className="mt-2 rounded-2xl bg-leaf/12 px-3 py-2 text-sm text-forest">
            {t("scan.brandHint").replace("{brand}", brandHint)}
          </p>
        ) : null}
        <div className="mt-4">
          <ShortcutPills
            items={[
              { href: "/favoris", label: t("fav.hubTitle") },
              { href: "/historique", label: t("hist.title") },
              { href: "/comparer", label: t("cmp.title") },
              { href: "/menu", label: t("menu.title") },
              ...(kind === "beauty" || brandHint ? [{ href: "/cosmetiques", label: t("brands.title") }] : []),
            ]}
          />
        </div>
      </div>

      {!hasResult ? (
        <div className="flex flex-col items-center gap-3 py-6 sm:py-10">
          <button type="button" onClick={startScan} className="scan-barcode scan-page-cta">
            <BarcodeScanArt />
            <span className="scan-barcode-label">{t("scan.cta")}</span>
          </button>
          <p className="rounded-full bg-white px-3 py-1 text-sm font-medium text-ink/70 ring-1 ring-ink/8">
            {t("scan.remaining")} :{" "}
            <span className="text-forest">
              {remaining === "unlimited" ? t("scan.unlimited") : remaining}
            </span>
          </p>
        </div>
      ) : null}

      {cam.status === "denied" ? (
        <div className="rounded-2xl bg-white p-4 ring-1 ring-ink/10">
          <p className="font-semibold">{t("scan.permDenied")}</p>
          <p className="mt-1 text-sm text-ink/70">{t("scan.permSettings")}</p>
          <button type="button" onClick={startScan} className="btn btn-secondary mt-3">
            {t("scan.permRetry")}
          </button>
        </div>
      ) : null}

      {cam.status === "live" ? (
        <CameraScanner
          liveLabel={t("scan.live")}
          closeLabel={t("scan.close")}
          flashOnLabel={t("scan.flashOn")}
          flashOffLabel={t("scan.flashOff")}
          flashUnavailable={t("scan.flashUnavailable")}
          onReady={cam.granted}
          onStop={cam.pause}
          onDenied={cam.denied}
          onCode={(code) => void runScan({ barcode: code })}
        />
      ) : null}

      {!hasResult ? (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void runScan({ barcode: manual });
            }}
          >
            <SearchRow>
              <input
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder={t("scan.barcodePh")}
                inputMode="numeric"
                autoComplete="off"
                aria-label={t("scan.barcodePh")}
              />
              <button type="submit" className="btn btn-primary">
                {t("scan.search")}
              </button>
            </SearchRow>
          </form>

          <details className="rounded-2xl bg-white p-4 ring-1 ring-ink/8">
            <summary className="cursor-pointer text-sm font-semibold">{t("scan.orIngredients")}</summary>
            <form
              className="mt-3 flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                void runScan({ ingredients });
              }}
            >
              <IngredientsLabelScan onText={setIngredients} />
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                rows={3}
                placeholder={t("scan.ingredientsPh")}
                className="field"
              />
              <button type="submit" className="btn btn-secondary self-start">
                {t("scan.analyze")}
              </button>
            </form>
          </details>

          <button
            type="button"
            className="scan-fallback self-start"
            onClick={() => setMissingCode(missingCode === "" ? null : "")}
          >
            {t("scan.createOwn")}
          </button>
        </>
      ) : null}

      {loading ? <ScanSkeleton /> : null}
      {error ? <p className="text-terracotta">{error}</p> : null}
      {missingCode !== null ? (
        <CreateProductForm
          kind={kind === "beauty" ? "cosmetic" : isEdible(kind) ? "food" : kind}
          barcode={missingCode}
        />
      ) : null}

      {food && kind === "food" ? (
        <ScanResultLayout
          key={food.product.barcode || food.product.name}
          sticky={
            <ScanStickyHead
              mode={t("scan.modeFood")}
              name={food.product.name || t("scan.manualName")}
              brand={food.product.brands}
              image={food.product.image}
              score={food.score.score}
              community={
                community?.userScanned ? (
                  <UserScannedBadge scanCount={community.scanCount} className="mt-2" />
                ) : null
              }
              badges={
                <VerdictBadges
                  offVegan={food.product.offVegan}
                  vegan={
                    food.score.score >= 4
                      ? "yes"
                      : food.score.score <= 2
                        ? "no"
                        : food.analysis.animalHits.length
                          ? "mixed"
                          : undefined
                  }
                  t={t}
                />
              }
              remaining={
                remaining !== "unlimited" ? (
                  <p className="text-[0.65rem] text-ink/45">
                    {t("scan.remaining")} : {remaining}
                  </p>
                ) : null
              }
            />
          }
          detailsLabel={t("scan.details")}
          details={
            <>
              <p>{food.score.why}</p>
              {info?.digits ? (
                <p className="font-mono text-xs">
                  {t("scan.ref")} {info.format} · {info.gtin || info.digits}
                  {info.origin ? ` · ${t("scan.origin")} ${info.origin}` : ""}
                </p>
              ) : null}
              {food.analysis.animalHits.length > 0 ? (
                <ul className="list-disc pl-5">
                  {food.analysis.animalHits.map((h) => (
                    <li key={h.original}>
                      {h.original} — {h.why}
                    </li>
                  ))}
                </ul>
              ) : null}
              {food.planet ? <PlanetExtras planet={food.planet} /> : null}
            </>
          }
        >
          <AllergenBanner hits={food.allergens ?? []} />
          <p className="text-sm text-ink/75 line-clamp-2">{food.score.why}</p>
          <DisambiguateIngredient hits={hits} onChoose={onChoose} />
          {n && (n.energy || n.proteins) ? (
            <div className="grid grid-cols-1 gap-2 text-sm min-[380px]:grid-cols-2 sm:grid-cols-4">
              <p>
                {t("nutri.energy")} : {Math.round((n.energy ?? 0) * factor)} kcal/{grams}g
              </p>
              <p>
                {t("nutri.protein")} : {(((n.proteins ?? 0) * factor * 10) | 0) / 10} g
              </p>
              <p>
                {t("nutri.fiber")} : {(((n.fiber ?? 0) * factor * 10) | 0) / 10} g
              </p>
              <p>
                {t("nutri.salt")} : {(((n.salt ?? 0) * factor * 10) | 0) / 10} g
              </p>
            </div>
          ) : null}
          {fullApp ? (
            <>
              {(() => {
                const cov = nutrientCoverage(food.product.nutrients);
                if (cov.isEmpty) {
                  return <p className="rounded-2xl bg-terracotta/10 px-3 py-2 text-sm text-terracotta">{t("gauge.noNutrients")}</p>;
                }
                if (cov.isPartial) {
                  return (
                    <p className="rounded-2xl bg-sand/70 px-3 py-2 text-sm text-ink/70">
                      {t("gauge.partialNutrients").replace("{n}", String(cov.present.length)).replace("{total}", "10")}
                    </p>
                  );
                }
                return null;
              })()}
              <label className="text-sm">
                {t("scan.portion")}
                <input
                  type="number"
                  min={10}
                  max={800}
                  step={10}
                  value={grams}
                  onChange={(e) => setGrams(Number(e.target.value) || 100)}
                  className="field ml-2 inline-flex min-h-11 w-24 px-3"
                />
                g
              </label>
              <button
                type="button"
                onClick={() => void eatIt()}
                className="btn btn-accent w-full"
                disabled={nutrientCoverage(food.product.nutrients).isEmpty}
              >
                {t("scan.eatGrams").replace("{n}", String(grams))}
              </button>
              {saved ? <p className="anim-bounce text-leaf">{t("scan.saved")}</p> : null}
            </>
          ) : null}
          <ReportButton barcode={food.product.barcode} target={food.product.name} />
          {food.product.barcode ? (
            <>
              <ScanPostActions
                name={food.product.name || food.product.barcode}
                barcode={food.product.barcode}
                kind="food"
                score={food.score.score}
                image={food.product.image ?? undefined}
              />
              <ShareScoreCard score={food.score.score} productName={food.product.name || food.product.barcode} />
            </>
          ) : null}
        </ScanResultLayout>
      ) : null}

      {beauty && kind === "beauty" ? (
        <ScanResultLayout
          sticky={
            <ScanStickyHead
              mode={t("scan.modeBeauty")}
              name={beauty.product.name}
              brand={beauty.product.brands}
              image={beauty.product.image}
              score={beauty.score.score}
              community={
                community?.userScanned ? (
                  <UserScannedBadge scanCount={community.scanCount} className="mt-2" />
                ) : null
              }
              badges={
                <VerdictBadges
                  cruelty={beauty.product.cruelty}
                  vegan={
                    beauty.score.score >= 4 && beauty.analysis.animalHits.length === 0
                      ? "yes"
                      : beauty.analysis.animalHits.length
                        ? "no"
                        : undefined
                  }
                  t={t}
                />
              }
            />
          }
          detailsLabel={t("scan.details")}
          details={
            <>
              <p>{beauty.score.why}</p>
              {beauty.analysis.animalHits.length > 0 ? (
                <ul className="list-disc pl-5">
                  {beauty.analysis.animalHits.map((h) => (
                    <li key={h.original}>
                      {h.original} — {h.why}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-leaf">{t("cos.ok")}</p>
              )}
            </>
          }
        >
          <p className="text-sm text-ink/75 line-clamp-2">{beauty.score.why}</p>
          <DisambiguateIngredient hits={hits} onChoose={onChoose} />
          <ReportButton barcode={beauty.product.barcode} target={beauty.product.name} />
          {beauty.product.barcode ? (
            <>
              <ScanPostActions
                name={beauty.product.name || beauty.product.barcode}
                barcode={beauty.product.barcode}
                kind="cosmetic"
                score={beauty.score.score}
                image={beauty.product.image ?? undefined}
              />
              <ShareScoreCard score={beauty.score.score} productName={beauty.product.name || beauty.product.barcode} />
            </>
          ) : null}
        </ScanResultLayout>
      ) : null}

      {goods ? (
        <ScanResultLayout
          sticky={
            <ScanStickyHead
              mode={t(kindI18nKey(goods.kind))}
              name={goods.product.name}
              brand={goods.product.brands}
              image={goods.product.image}
              score={goods.score.score}
              community={
                community?.userScanned ? (
                  <UserScannedBadge scanCount={community.scanCount} className="mt-2" />
                ) : null
              }
              badges={
                showsCruelty(goods.kind) ? (
                  <VerdictBadges cruelty={goods.product.cruelty} t={t} />
                ) : null
              }
            />
          }
          detailsLabel={t("scan.details")}
          details={
            <>
              <p>{goods.score.why}</p>
              {goods.analysis.animalHits.length > 0 ? (
                <ul className="list-disc pl-5">
                  {goods.analysis.animalHits.map((h) => (
                    <li key={h.original}>
                      {h.original} — {h.why}
                    </li>
                  ))}
                </ul>
              ) : goods.score.score >= 4 ? (
                <p className="text-leaf">{t("scan.noAnimal")}</p>
              ) : null}
            </>
          }
        >
          <p className="text-sm text-ink/75 line-clamp-2">{goods.score.why}</p>
          <DisambiguateIngredient hits={hits} onChoose={onChoose} />
          <ReportButton barcode={goods.product.barcode} target={goods.product.name} />
        </ScanResultLayout>
      ) : null}

      {hasResult ? (
        <div className="scan-result-actions">
          <button type="button" className="btn btn-primary" onClick={newScan}>
            {t("scan.newScan")}
          </button>
          {canFav ? (
            <>
              <button type="button" className="btn btn-secondary" onClick={() => void fav()}>
                {faved ? t("hist.faved") : t("scan.addFav")}
              </button>
              {faved ? (
                <Link href="/favoris" className="btn btn-ghost text-center text-sm">
                  {t("scan.seeProductFavs")}
                </Link>
              ) : null}
            </>
          ) : null}
          {food?.product.barcode ? (
            <Link href={`/comparer?a=${food.product.barcode}`} className="btn btn-secondary text-center">
              {t("cmp.title")}
            </Link>
          ) : null}
          {goods?.product.barcode ? (
            <Link href={`/comparer?a=${goods.product.barcode}`} className="btn btn-secondary text-center">
              {t("cmp.title")}
            </Link>
          ) : null}
          {recipeQuery && kind === "food" ? (
            <Link
              href={`/recettes?q=${encodeURIComponent(recipeQuery.split(/\s+/).slice(0, 3).join(" "))}`}
              className="btn btn-secondary text-center"
            >
              {t("scan.recipesFrom")}
            </Link>
          ) : null}
          {kind === "beauty" ? (
            <Link href="/cosmetiques" className="btn btn-secondary text-center">
              {t("brands.title")}
            </Link>
          ) : null}
          <Link href="/historique" className="btn btn-secondary text-center">
            {t("hist.title")}
          </Link>
          <button type="button" className="btn btn-secondary" onClick={finishScan}>
            {t("scan.done")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
