import type { OfficialRecipe } from "@/data/official-recipes";
import { FOCUS_KEYS, FOCUS_RATIO, type Gauge } from "@/lib/nutrition/gauges";
import type { UserPrefs } from "@/lib/profile";
import { recipeMatchesPrefs } from "@/lib/profile";

export function suggestWeekMeals(gauges: Gauge[], recipes: OfficialRecipe[], prefs: UserPrefs) {
  const lows = FOCUS_KEYS.filter((k) => {
    const g = gauges.find((x) => x.key === k);
    return !g || g.displayRatio < FOCUS_RATIO;
  });
  const keys = lows.length ? lows : ([...FOCUS_KEYS].slice(0, 3) as typeof FOCUS_KEYS);
  const pool = recipes.filter((r) =>
    recipeMatchesPrefs({ ...r, ingredients: r.ingredients.map((i) => i.text).join(" ") }, prefs),
  );
  const ranked = [...pool].sort((a, b) => {
    const sa = keys.reduce((s, k) => s + (a.nutrients[k] ?? 0), 0);
    const sb = keys.reduce((s, k) => s + (b.nutrients[k] ?? 0), 0);
    return sb - sa;
  });
  const picked: OfficialRecipe[] = [];
  const used = new Set<string>();
  for (const key of keys) {
    const next =
      ranked.find((r) => !used.has(r.slug) && (r.nutrients[key] ?? 0) > 0) ??
      ranked.find((r) => !used.has(r.slug));
    if (next) {
      used.add(next.slug);
      picked.push(next);
    }
  }
  while (picked.length < 3) {
    const extra = ranked.find((r) => !used.has(r.slug));
    if (!extra) break;
    used.add(extra.slug);
    picked.push(extra);
  }
  return { lows: keys, meals: picked.slice(0, 3) };
}
