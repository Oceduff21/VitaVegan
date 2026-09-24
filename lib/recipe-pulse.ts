import type { Gauge } from "@/lib/nutrition/gauges";

export type PulseRecipe = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  timeMinutes: number;
  glutenFree: boolean;
  nutrients: string;
  source: string;
  veganScore: number;
  image?: string | null;
};

export type PulseTheme = {
  id: "batch" | "bases" | "boisson" | "petit-dej" | "rapide" | "fer" | "b12" | "dessert" | "gf" | "apero";
  cat?: string;
  max?: number;
  gf?: boolean;
  nutrient?: "iron" | "b12";
  href: string;
};

export type PulseChallenge = {
  id: string;
  titleKey: string;
  hintKey: string;
  current: number;
  goal: number;
  href: string;
};

const THEMES: PulseTheme[] = [
  { id: "batch", cat: "batch", href: "/recettes?cat=batch" },
  { id: "bases", cat: "bases", href: "/recettes?cat=bases" },
  { id: "boisson", cat: "boisson", href: "/recettes?cat=boisson" },
  { id: "petit-dej", cat: "petit-dej", href: "/recettes?cat=petit-dej" },
  { id: "rapide", max: 20, href: "/recettes?max=20" },
  { id: "fer", nutrient: "iron", href: "/recettes" },
  { id: "b12", nutrient: "b12", href: "/dashboard#plan" },
  { id: "dessert", cat: "dessert", href: "/recettes?cat=dessert" },
  { id: "gf", gf: true, href: "/recettes?gf=1" },
  { id: "apero", cat: "apero", href: "/recettes?cat=apero" },
];

const SEASON_SLUGS = {
  winter: ["soupe-miso-tofu", "risotto-champignons", "tajine-pois-chiches-abricots"],
  spring: ["poke-edamame", "smoothie-vert-chanvre", "wraps-houmous-crudites"],
  summer: ["virgin-mojito", "guacamole-chips-mais", "nice-cream-banane"],
  autumn: ["crumble-pommes-avoine", "chili-sin-carne", "dal-lentilles-corail"],
} as const;

export function isoWeek(d = new Date()) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: date.getUTCFullYear(), week };
}

export function utcWeekDays(d = new Date()) {
  const day = d.getUTCDay() || 7;
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day + 1));
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(monday);
    x.setUTCDate(monday.getUTCDate() + i);
    return x.toISOString().slice(0, 10);
  });
}

export function currentTheme(d = new Date()): PulseTheme {
  const { week } = isoWeek(d);
  return THEMES[(week - 1 + THEMES.length) % THEMES.length];
}

function parseNutrients(raw: string) {
  try {
    return JSON.parse(raw) as Record<string, number>;
  } catch {
    return {};
  }
}

export function matchesTheme(recipe: PulseRecipe, theme: PulseTheme) {
  if (theme.cat && recipe.category !== theme.cat) return false;
  if (theme.max && recipe.timeMinutes > theme.max) return false;
  if (theme.gf && !recipe.glutenFree) return false;
  if (theme.nutrient && (parseNutrients(recipe.nutrients)[theme.nutrient] ?? 0) <= 0) return false;
  return true;
}

export function pickRecipeOfWeek(recipes: PulseRecipe[], d = new Date()) {
  const theme = currentTheme(d);
  const { year, week } = isoWeek(d);
  const official = recipes.filter((r) => r.source === "official");
  const pool = official.filter((r) => matchesTheme(r, theme));
  const list = pool.length ? pool : official.length ? official : recipes;
  if (!list.length) return null;
  return list[(year * 53 + week) % list.length];
}

export function seasonId(d = new Date()): keyof typeof SEASON_SLUGS {
  const m = d.getUTCMonth();
  if (m === 11 || m <= 1) return "winter";
  if (m <= 4) return "spring";
  if (m <= 7) return "summer";
  return "autumn";
}

export function seasonalPicks(recipes: PulseRecipe[], d = new Date()) {
  const slugs = SEASON_SLUGS[seasonId(d)];
  return slugs.map((slug) => recipes.find((r) => r.slug === slug)).filter((r): r is PulseRecipe => Boolean(r));
}

export function buildChallenges(input: {
  weekRecipeSlug: string | null;
  theme: PulseTheme;
  recipes: PulseRecipe[];
  logs: { date: string; kind: string; barcode: string | null; nutrients: string }[];
  scanScores: number[];
}): PulseChallenge[] {
  const bySlug = new Map(input.recipes.map((r) => [r.slug, r]));
  const cooked = input.logs.filter((l) => l.kind === "recipe" && l.barcode);
  const cookedRecipes = cooked.map((l) => bySlug.get(l.barcode ?? "")).filter((r): r is PulseRecipe => Boolean(r));

  const weekCook = cooked.filter((l) => l.barcode === input.weekRecipeSlug).length;
  const themeCook = cookedRecipes.filter((r) => matchesTheme(r, input.theme)).length;

  let nutrientDays = 0;
  if (input.theme.nutrient) {
    const days = new Set<string>();
    for (const log of input.logs) {
      const n = parseNutrients(log.nutrients);
      if ((n[input.theme.nutrient] ?? 0) > 0) days.add(log.date);
    }
    nutrientDays = days.size;
  }

  const themeCurrent = input.theme.nutrient ? nutrientDays : themeCook;
  const themeGoal = input.theme.nutrient ? 3 : 2;
  const kindScans = input.scanScores.filter((s) => s >= 4).length;

  return [
    {
      id: "week-cook",
      titleKey: "recipes.challenge.weekCook",
      hintKey: "recipes.challenge.weekCookHint",
      current: Math.min(weekCook, 1),
      goal: 1,
      href: input.weekRecipeSlug ? `/recettes/${input.weekRecipeSlug}` : "/recettes",
    },
    {
      id: "theme",
      titleKey: `recipes.challenge.theme.${input.theme.id}`,
      hintKey: `recipes.challenge.themeHint.${input.theme.id}`,
      current: Math.min(themeCurrent, themeGoal),
      goal: themeGoal,
      href: input.theme.href,
    },
    {
      id: "scans",
      titleKey: "recipes.challenge.scans",
      hintKey: "recipes.challenge.scansHint",
      current: Math.min(kindScans, 3),
      goal: 3,
      href: "/scan",
    },
  ];
}

export function lowGaugeKeys(gauges: Gauge[]) {
  return gauges.filter((g) => g.key === "b12" || g.key === "iron" || g.key === "iodine").filter((g) => g.ratio < 0.7);
}
