"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { AnimalScore } from "@/components/score/AnimalScore";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { UserScannedBadge } from "@/components/UserScannedBadge";
import { ARTICLE_KINDS, kindI18nKey, normalizeArticleKind, showsCruelty } from "@/lib/article-kind";
import { VerdictBadges } from "@/components/ui/StatusBadge";

const OFFLINE_KEY = "vitavegan-last-scans";

type OfflineScan = { name: string; score: number; cruelty?: string };

export type HistoryEvent = {
  id: string;
  kind: string;
  name: string;
  brand: string;
  barcode: string;
  image: string;
  veganScore: number;
  veganWhy: string;
  cruelty: string;
  createdAt: string;
};

export type HistoryFav = {
  kind: string;
  barcode: string;
  name: string;
  image: string;
  veganScore: number;
};

function when(iso: string) {
  return iso.slice(0, 16).replace("T", " ");
}

function readOfflineScans(): OfflineScan[] {
  try {
    const raw = JSON.parse(localStorage.getItem(OFFLINE_KEY) || "[]") as unknown;
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((x): x is OfflineScan => !!x && typeof x === "object" && typeof (x as OfflineScan).name === "string")
      .slice(0, 12);
  } catch {
    return [];
  }
}

export function HistoryClient({ events, favs }: { events: HistoryEvent[]; favs: HistoryFav[] }) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<string>("all");
  const [offline, setOffline] = useState<OfflineScan[]>([]);

  useEffect(() => {
    setOffline(readOfflineScans());
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of events) {
      const k = normalizeArticleKind(e.kind);
      map[k] = (map[k] ?? 0) + 1;
    }
    return map;
  }, [events]);

  const visible = filter === "all" ? events : events.filter((e) => normalizeArticleKind(e.kind) === filter);
  const grouped = ARTICLE_KINDS.map((kind) => ({
    kind,
    items: visible.filter((e) => normalizeArticleKind(e.kind) === kind),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {offline.length > 0 ? (
        <section>
          <h2 className="mb-1 text-xl">{t("hist.offline")}</h2>
          <p className="mb-2 text-sm text-ink/60">{t("hist.offlineLead")}</p>
          <ul className="flex flex-col gap-2">
            {offline.map((o, i) => (
              <li key={`${o.name}-${i}`} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{o.name}</p>
                  {o.cruelty === "free" || o.cruelty === "tested" ? (
                    <VerdictBadges
                      cruelty={o.cruelty}
                      vegan={o.score >= 4 ? "yes" : o.score <= 2 ? "no" : undefined}
                      t={t}
                      className="mt-1"
                    />
                  ) : o.score >= 4 || o.score <= 2 ? (
                    <VerdictBadges vegan={o.score >= 4 ? "yes" : "no"} t={t} className="mt-1" />
                  ) : null}
                </div>
                <AnimalScore score={o.score || 3} size={28} showLabel={false} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section id="favs" className="scroll-mt-24">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl">{t("hist.favs")}</h2>
          <Link href="/favoris" className="text-sm font-semibold text-forest underline">
            {t("fav.hubTitle")}
          </Link>
        </div>
        {favs.length === 0 ? <p className="text-sm text-ink/60">{t("hist.noFav")}</p> : null}
        <ul className="flex flex-col gap-2">
          {favs.map((f) => (
            <li key={`${f.kind}-${f.barcode}`} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
              {f.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.image} alt={f.name || f.barcode} className="h-12 w-12 rounded-lg object-cover" />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="text-[0.65rem] font-medium uppercase tracking-wide text-leaf">{t(kindI18nKey(f.kind))}</p>
                <p className="font-medium">{f.name || f.barcode}</p>
                <p className="font-mono text-xs text-ink/50">{f.barcode}</p>
              </div>
              <AnimalScore score={f.veganScore || 3} size={28} showLabel={false} />
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="mb-2 text-xl">{t("hist.scanned")}</h2>
          <p className="text-sm text-ink/60">{t("hist.byType")}</p>
        </div>
        {events.length > 0 ? (
          <div className="chip-row" role="tablist" aria-label={t("hist.byType")}>
            <button
              type="button"
              className={`chip${filter === "all" ? " is-on" : ""}`}
              onClick={() => setFilter("all")}
            >
              {t("hist.filterAll")} · {events.length}
            </button>
            {ARTICLE_KINDS.filter((k) => counts[k]).map((k) => (
              <button
                key={k}
                type="button"
                className={`chip${filter === k ? " is-on" : ""}`}
                onClick={() => setFilter(k)}
              >
                {t(kindI18nKey(k))} · {counts[k]}
              </button>
            ))}
          </div>
        ) : null}
        {events.length === 0 ? <p className="text-sm text-ink/60">{t("hist.empty")}</p> : null}
        {grouped.map((g) => (
          <div key={g.kind} className="hist-group">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-leaf">{t(kindI18nKey(g.kind))}</h3>
            <ul className="flex flex-col gap-2">
              {g.items.map((e) => (
                <li key={e.id} className="rounded-2xl bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium">{e.name}</p>
                      <p className="text-sm text-ink/60">
                        {e.brand} {e.barcode ? `· ${e.barcode}` : ""}
                      </p>
                      <UserScannedBadge className="mt-1.5" />
                    </div>
                    <AnimalScore score={e.veganScore} size={28} showLabel={false} />
                  </div>
                  {showsCruelty(normalizeArticleKind(e.kind)) || e.cruelty === "free" || e.cruelty === "tested" ? (
                    <VerdictBadges cruelty={e.cruelty} vegan={e.veganScore >= 4 ? "yes" : e.veganScore <= 2 ? "no" : undefined} t={t} className="mt-1.5" />
                  ) : e.veganScore >= 4 || e.veganScore <= 2 ? (
                    <VerdictBadges vegan={e.veganScore >= 4 ? "yes" : "no"} t={t} className="mt-1.5" />
                  ) : null}
                  <p className="mt-1 text-sm text-ink/55">{e.veganWhy}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-xs text-ink/45">{when(e.createdAt)}</p>
                    {e.barcode ? (
                      <Link href={`/comparer?a=${e.barcode}`} className="text-xs underline">
                        {t("cmp.title")}
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
