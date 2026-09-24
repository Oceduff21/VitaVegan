"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { Gauge } from "@/lib/nutrition/gauges";
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

function GaugeCard({ g }: { g: Gauge }) {
  const { locale } = useI18n();
  const current = useCountUp(g.current);
  const reached = g.state === "reached" || g.state === "over";
  const label = gaugeLabel(locale, g.key);

  return (
    <div className={`rounded-2xl border border-forest/10 bg-white/70 p-4 ${reached ? "gauge-pulse" : ""}`}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="min-w-0 font-medium">{label}</span>
        <span className="shrink-0 text-sm text-ink/60">
          {formatValue(current, g.target)} / {g.target} {g.unit}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-sand">
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
}: {
  gauges: Gauge[];
  showTips?: boolean;
}) {
  const { t, locale } = useI18n();
  const lows = gauges.filter((g) => g.key !== "calories" && g.ratio < 0.5);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {gauges.map((g, i) => (
          <div key={g.key} className="anim-card-in" style={{ animationDelay: `${i * 60}ms` } as CSSProperties}>
            <GaugeCard g={g} />
          </div>
        ))}
      </div>
      {showTips && lows.length > 0 ? (
        <div className="anim-card-in rounded-2xl border border-mango/40 bg-white p-4">
          <p className="display mb-2 text-lg">{t("tips.title")}</p>
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
