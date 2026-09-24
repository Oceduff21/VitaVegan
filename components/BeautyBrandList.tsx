"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { SearchRow } from "@/components/ui/SearchRow";
import { BadgeLegend, VerdictBadges } from "@/components/ui/StatusBadge";
import { IconAlert, IconBunny, IconLeaf } from "@/components/nav-icons";
import type { BeautyBrand, BeautyVeganStatus } from "@/data/beauty-brands";

type Hit = BeautyBrand & { products?: number; source?: string; vegan?: BeautyVeganStatus };

export function BeautyBrandList() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState<"all" | "free" | "tested" | "vegan">("all");
  const [list, setList] = useState<Hit[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(q.trim()), 280);
    return () => window.clearTimeout(id);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    const params = new URLSearchParams();
    if (debounced) params.set("q", debounced);
    if (filter !== "all") params.set("filter", filter);
    fetch(`/api/beauty-brands?${params}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("fail");
        const data = (await res.json()) as { brands?: Hit[]; suggestions?: string[] };
        if (!cancelled) {
          setList(data.brands ?? []);
          setSuggestions(data.suggestions ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setList([]);
          setSuggestions([]);
          setError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced, filter]);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl">{t("brands.title")}</h2>
      <p className="text-sm text-ink/70">{t("brands.lead")}</p>
      <BadgeLegend t={t} />

      <SearchRow>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("brands.search")}
          aria-label={t("brands.search")}
          autoComplete="off"
        />
      </SearchRow>
      <div className="tabs" role="tablist" aria-label={t("brands.title")}>
        {(["all", "free", "vegan", "tested"] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            onClick={() => setFilter(id)}
            className={`tab inline-flex items-center gap-1.5 ${filter === id ? "is-on" : ""}`}
          >
            {id === "free" ? <IconBunny className="h-3.5 w-3.5" /> : null}
            {id === "vegan" ? <IconLeaf className="h-3.5 w-3.5" /> : null}
            {id === "tested" ? <IconAlert className="h-3.5 w-3.5" /> : null}
            {id === "all"
              ? t("recipes.all")
              : id === "free"
                ? t("brands.badge.cf")
                : id === "vegan"
                  ? t("brands.badge.vegan")
                  : t("brands.badge.tested")}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex flex-col gap-2" aria-busy aria-label={t("brands.loading")}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/80" />
          ))}
        </div>
      ) : null}
      {error ? <p className="text-sm text-terracotta">{t("brands.error")}</p> : null}
      {!loading && !error && list.length === 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-ink/55">{t("brands.empty")}</p>
          {suggestions.length > 0 ? (
            <p className="text-sm text-ink/70">
              {t("brands.didYouMean")}{" "}
              {suggestions.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  className="font-semibold text-forest underline"
                  onClick={() => setQ(s)}
                >
                  {s}
                  {i < suggestions.length - 1 ? ", " : ""}
                </button>
              ))}
            </p>
          ) : null}
        </div>
      ) : null}
      <ul className="flex flex-col gap-2.5">
        {!loading
          ? list.map((b) => (
              <li
                key={`${b.name}-${b.source ?? "x"}`}
                className="rounded-2xl bg-white px-4 py-3.5 shadow-[0_1px_0_rgba(18,60,40,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-base font-semibold leading-snug text-ink">{b.name}</p>
                  {typeof b.products === "number" && b.products > 0 ? (
                    <p className="shrink-0 pt-0.5 text-[0.65rem] tabular-nums text-ink/40">
                      {t("brands.productsShort").replace("{n}", String(b.products))}
                    </p>
                  ) : null}
                </div>
                <VerdictBadges cruelty={b.cruelty} vegan={b.vegan} t={t} className="mt-2" />
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{b.note}</p>
                <Link
                  href={`/scan?brand=${encodeURIComponent(b.name)}`}
                  className="mt-2 inline-block text-xs font-semibold text-forest underline"
                >
                  {t("brands.scanProduct")}
                </Link>
              </li>
            ))
          : null}
      </ul>
    </section>
  );
}
