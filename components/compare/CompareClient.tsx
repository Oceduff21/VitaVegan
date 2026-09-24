"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { AnimalScore } from "@/components/score/AnimalScore";
import { PlanetExtras } from "@/components/PlanetExtras";
import { CameraScanner } from "@/components/CameraScanner";
import { BarcodeScanArt } from "@/components/BarcodeScanArt";
import { SearchRow } from "@/components/ui/SearchRow";
import { useScanCamera } from "@/components/useScanCamera";
import type { CompareItem } from "@/lib/compare-lookup";
import { animalWinner, compareFamily } from "@/lib/compare-rules";
import { kindI18nKey, showsCruelty } from "@/lib/article-kind";
import { VerdictBadges } from "@/components/ui/StatusBadge";

type SlotId = "a" | "b";

function SlotCard({
  item,
  revealed,
  highlight,
  showPlanet,
  onRescan,
  rescanLabel,
  notFound,
}: {
  item: CompareItem;
  revealed: boolean;
  highlight: boolean;
  showPlanet: boolean;
  onRescan: () => void;
  rescanLabel: string;
  notFound: string;
}) {
  const { t } = useI18n();
  return (
    <article className={`compare-slot${highlight ? " is-ahead" : ""}`}>
      {item.error ? <p className="text-sm text-terracotta">{notFound}</p> : null}
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt="" className="mb-3 h-28 w-full rounded-2xl object-cover" />
      ) : (
        <div className="mb-3 h-28 w-full rounded-2xl bg-sand" />
      )}
      <p className="text-[0.65rem] font-medium uppercase tracking-wide text-leaf">
        {t(kindI18nKey(item.kind))}
      </p>
      <h2 className="text-lg leading-snug">{item.name || "—"}</h2>
      <p className="text-sm text-ink/60">{item.brands}</p>
      {item.cruelty && showsCruelty(item.kind) ? (
        <VerdictBadges cruelty={item.cruelty} t={t} className="mt-2" />
      ) : null}
      {revealed && item.score ? (
        <div className="mt-3 flex flex-col gap-2">
          <AnimalScore score={Math.min(item.score.score, 4)} size={32} />
          <VerdictBadges
            vegan={item.score.score >= 4 ? "yes" : item.score.score <= 2 ? "no" : "mixed"}
            t={t}
          />
          <p className="text-sm">{item.score.why}</p>
          {showPlanet && item.planet ? <PlanetExtras planet={item.planet} /> : null}
        </div>
      ) : null}
      <button type="button" className="btn btn-secondary mt-auto w-full" onClick={onRescan}>
        {rescanLabel}
      </button>
    </article>
  );
}

export function CompareClient() {
  const { t, locale } = useI18n();
  const sp = useSearchParams();
  const cam = useScanCamera();
  const [a, setA] = useState<CompareItem | null>(null);
  const [b, setB] = useState<CompareItem | null>(null);
  const [scanning, setScanning] = useState<SlotId | null>(null);
  const [codes, setCodes] = useState({ a: "", b: "" });
  const [loading, setLoading] = useState<SlotId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  async function fillSlot(slot: SlotId, barcode: string) {
    const digits = barcode.replace(/\D/g, "");
    if (!digits) {
      setError(t("cmp.need"));
      return;
    }
    setError(null);
    setLoading(slot);
    setRevealed(false);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcodes: [digits], lang: locale }),
      });
      const json = await res.json();
      const item = (json.items?.[0] ?? null) as CompareItem | null;
      if (!res.ok || !item) {
        setError(t("scan.fail"));
        return;
      }
      if (item.error) {
        setError(t("scan.notFound"));
        return;
      }
      if (slot === "a") setA(item);
      else setB(item);
    } finally {
      setLoading(null);
      cam.pause();
      setScanning(null);
    }
  }

  useEffect(() => {
    const presetA = sp.get("a");
    const presetB = sp.get("b");
    if (presetA) void fillSlot("a", presetA);
    if (presetB) void fillSlot("b", presetB);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- preload once from the URL
  }, []);

  function openScan(slot: SlotId) {
    setScanning(slot);
    cam.resume();
  }

  function closeScan() {
    cam.pause();
    setScanning(null);
  }

  const ready = Boolean(a && !a.error && b && !b.error);
  const family = a && b && ready ? compareFamily(a, b) : null;
  const winner = a && b && ready ? animalWinner(a, b) : null;

  function kindLabel(kind: CompareItem["kind"]) {
    return t(kindI18nKey(kind));
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl sm:text-3xl">{t("cmp.title")}</h1>
        <p className="mt-1 text-sm text-ink/70">{t("cmp.lead")}</p>
      </div>

      {revealed && a && b && family ? (
        <div className="compare-verdict">
          {family === "mixed" ? (
            <>
              <p className="font-medium">{t("cmp.mixedTitle")}</p>
              <p className="mt-1 text-sm text-ink/70">
                {t("cmp.mixedLead")
                  .replace("{a}", a.name || t("scan.modeFood"))
                  .replace("{b}", b.name || t("scan.modeBeauty"))
                  .replace("{kindA}", kindLabel(a.kind))
                  .replace("{kindB}", kindLabel(b.kind))}
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">
                {winner === "tie"
                  ? t("cmp.tieAnimals")
                  : t("cmp.betterAnimals").replace("{name}", winner === "a" ? a.name : b.name)}
              </p>
              <p className="mt-1 text-sm text-ink/60">{t("cmp.infoOnly")}</p>
            </>
          )}
        </div>
      ) : null}

      <div className="compare-grid">
        {a ? (
          <SlotCard
            item={a}
            revealed={revealed}
            highlight={revealed && family !== "mixed" && winner === "a"}
            showPlanet={revealed && family !== "mixed"}
            onRescan={() => openScan("a")}
            rescanLabel={t("cmp.rescan")}
            notFound={t("scan.notFound")}
          />
        ) : (
          <div className="compare-slot">
            <button type="button" className="compare-slot-scan" onClick={() => openScan("a")} disabled={loading === "a"}>
              <BarcodeScanArt />
              <span className="scan-barcode-label">{loading === "a" ? t("scan.loading") : t("cmp.scanFirst")}</span>
            </button>
            <form
              className="mt-3 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                void fillSlot("a", codes.a);
              }}
            >
              <SearchRow>
                <input
                  value={codes.a}
                  onChange={(e) => setCodes((c) => ({ ...c, a: e.target.value }))}
                  placeholder={t("cmp.orCode")}
                  inputMode="numeric"
                  autoComplete="off"
                  aria-label={t("cmp.orCode")}
                />
                <button type="submit" className="btn btn-primary">
                  {t("scan.search")}
                </button>
              </SearchRow>
            </form>
          </div>
        )}

        {b ? (
          <SlotCard
            item={b}
            revealed={revealed}
            highlight={revealed && family !== "mixed" && winner === "b"}
            showPlanet={revealed && family !== "mixed"}
            onRescan={() => openScan("b")}
            rescanLabel={t("cmp.rescan")}
            notFound={t("scan.notFound")}
          />
        ) : (
          <div className="compare-slot">
            <button type="button" className="compare-slot-scan" onClick={() => openScan("b")} disabled={loading === "b"}>
              <BarcodeScanArt />
              <span className="scan-barcode-label">{loading === "b" ? t("scan.loading") : t("cmp.scanSecond")}</span>
            </button>
            <form
              className="mt-3 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                void fillSlot("b", codes.b);
              }}
            >
              <SearchRow>
                <input
                  value={codes.b}
                  onChange={(e) => setCodes((c) => ({ ...c, b: e.target.value }))}
                  placeholder={t("cmp.orCode")}
                  inputMode="numeric"
                  autoComplete="off"
                  aria-label={t("cmp.orCode")}
                />
                <button type="submit" className="btn btn-primary">
                  {t("scan.search")}
                </button>
              </SearchRow>
            </form>
          </div>
        )}
      </div>

      {error ? <p className="text-terracotta">{error}</p> : null}
      {cam.status === "denied" ? (
        <p className="text-sm text-terracotta">{t("scan.permDenied")}</p>
      ) : null}

      {!revealed ? (
        <p className="text-sm text-ink/60">{ready ? t("cmp.ready") : t("cmp.waitSecond")}</p>
      ) : null}

      <button
        type="button"
        className="btn btn-primary w-full sm:w-auto"
        disabled={!ready}
        onClick={() => setRevealed(true)}
      >
        {t("cmp.go")}
      </button>

      {cam.status === "live" && scanning ? (
        <CameraScanner
          liveLabel={scanning === "a" ? t("cmp.scanFirst") : t("cmp.scanSecond")}
          closeLabel={t("scan.close")}
          flashOnLabel={t("scan.flashOn")}
          flashOffLabel={t("scan.flashOff")}
          flashUnavailable={t("scan.flashUnavailable")}
          onReady={cam.granted}
          onStop={closeScan}
          onDenied={cam.denied}
          onCode={(code) => void fillSlot(scanning, code)}
        />
      ) : null}
    </div>
  );
}
