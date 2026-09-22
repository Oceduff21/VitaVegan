"use client";

import type { Gauge } from "@/lib/nutrition/gauges";

function stateColor(state: Gauge["state"]) {
  if (state === "reached") return "bg-leaf";
  if (state === "over") return "bg-forest";
  if (state === "progress") return "bg-cat";
  return "bg-sand";
}

export function NutrientGauges({
  gauges,
  showTips = true,
}: {
  gauges: Gauge[];
  showTips?: boolean;
}) {
  const lows = gauges.filter((g) => g.key !== "calories" && g.ratio < 0.5);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {gauges.map((g) => (
          <div key={g.key} className="rounded-2xl border border-forest/10 bg-white/70 p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="font-medium">{g.label}</span>
              <span className="text-sm text-ink/60">
                {g.current} / {g.target} {g.unit}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-sand">
              <div
                className={`gauge-fill h-full rounded-full ${stateColor(g.state)}`}
                style={{ width: `${Math.min(100, g.percent)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {showTips && lows.length > 0 ? (
        <div className="rounded-2xl border border-terracotta/30 bg-white p-4">
          <p className="display mb-2 text-lg">Pistes du jour</p>
          <ul className="flex flex-col gap-2 text-sm text-ink/80">
            {lows.map((g) => (
              <li key={g.key}>
                <strong>{g.label}</strong> encore basse — {g.tipLow}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
