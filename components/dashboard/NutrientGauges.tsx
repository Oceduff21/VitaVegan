"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { LOW_RATIO, type Gauge } from "@/lib/nutrition/gauges";
import { prefersReducedMotion } from "@/lib/motion";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { gaugeLabel, gaugeTip } from "@/lib/i18n/gauges";

function stateColor(key: Gauge["key"], state: Gauge["state"]) {
  if (state === "empty") return "bg-sand";
  const palette: Record<string, string> = {
    calories: "bg-mango",
    protein: "bg-leaf",
    iron: "bg-mango",
    calcium: "bg-sky",
    b12: "bg-cat",
    omega3: "bg-leaf",
    vitaminD: "bg-lemon",
    iodine: "bg-cow",
    zinc: "bg-forest",
    fiber: "bg-petal",
  };
  return palette[key] ?? "bg-leaf";
}

function formatValue(n: number, target: number) {
  if (target >= 100) return Math.round(n).toString();
  return (Math.round(n * 10) / 10).toString();
}

function useCountUp(value: number, duration = 800) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion() || value === 0) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return display;
}

function GaugeCard({ g, compact }: { g: Gauge; compact?: boolean }) {
  const { t, locale } = useI18n();
  const current = useCountUp(g.current);
  const reached = g.state === "reached" || g.state === "over";
  const label = gaugeLabel(locale, g.key);
  const value = `${formatValue(current, g.target)} / ${g.target} ${g.unit}`;

  return (
    <div
      className={`rounded-2xl border bg-white/70 ${compact ? "p-2.5 sm:p-3" : "p-3.5 sm:p-4"} ${
        g.focus ? "border-forest/30" : "border-forest/10"
      } ${reached ? "gauge-pulse" : ""}`}
    >
      <div className={`mb-1.5 flex flex-col ${compact ? "gap-0.5" : "gap-1 sm:mb-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2"}`}>
        <div className="flex min-w-0 items-center gap-1.5">
          <span className={`min-w-0 truncate font-medium ${compact ? "text-sm" : "text-[0.95rem] sm:text-base"}`}>
            {label}
          </span>
          {g.focus ? (
            compact ? (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-leaf"
                title={t("gauge.focus")}
                aria-label={t("gauge.focus")}
              />
            ) : (
              <span className="shrink-0 rounded-full bg-leaf/15 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-leaf">
                {t("gauge.focus")}
              </span>
            )
          ) : null}
        </div>
        <span className={`tabular-nums text-ink/55 ${compact ? "text-[0.7rem] leading-tight" : "text-xs sm:shrink-0 sm:text-sm"}`}>
          {value}
        </span>
      </div>
      <div className={`overflow-hidden rounded-full bg-sand ${compact ? "h-2" : "h-2.5 sm:h-3"}`}>
        <div
          className={`gauge-fill h-full rounded-full ${stateColor(g.key, g.state)}`}
          style={{ width: `${Math.min(100, g.percent)}%` }}
        />
      </div>
    </div>
  );
}

export function NutrientGauges({
  gauges,
  showTips = true,
  compact = false,
}: {
  gauges: Gauge[];
  showTips?: boolean;
  /** Focus gauges only, denser layout for home hub */
  compact?: boolean;
}) {
  const { t, locale } = useI18n();
  const list = compact ? gauges.filter((g) => g.focus).slice(0, 6) : gauges;
  const shown = list.length ? list : gauges.slice(0, 4);
  const lows = gauges.filter((g) => g.key !== "calories" && g.displayRatio < LOW_RATIO);
  const focusLows = gauges.filter((g) => g.focus && g.displayRatio < 0.7);

  return (
    <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-4 sm:gap-6"}`}>
      {focusLows.length > 0 && !compact ? (
        <p className="rounded-2xl bg-leaf/12 px-3 py-2 text-sm text-forest">
          {t("gauge.focusLead")}{" "}
          <strong>{focusLows.map((g) => gaugeLabel(locale, g.key)).join(", ")}</strong>
        </p>
      ) : null}
      <div
        className={`grid gap-2 sm:gap-3 ${
          compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {shown.map((g, i) => (
          <div key={g.key} className="anim-card-in min-w-0" style={{ animationDelay: `${i * 40}ms` } as CSSProperties}>
            <GaugeCard g={g} compact={compact} />
          </div>
        ))}
      </div>
      {showTips && !compact && lows.length > 0 ? (
        <div className="anim-card-in rounded-2xl border border-mango/40 bg-white p-3.5 sm:p-4">
          <p className="display mb-2 text-base sm:text-lg">{t("tips.title")}</p>
          <ul className="flex flex-col gap-2 text-sm text-ink/80">
            {lows.map((g) => (
              <li key={g.key}>
                <strong>{gaugeLabel(locale, g.key)}</strong> — {gaugeTip(locale, g.key)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
