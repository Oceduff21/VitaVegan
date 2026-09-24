import {
  currentTheme,
  matchesTheme,
  pickRecipeOfWeek,
  type PulseRecipe,
} from "@/lib/recipe-pulse";

/** Points feuille — plant-based karma; uses TBD later (badges, unlocks…). */
export const RECIPE_LEAF_POINTS = 10;

export type LeafPointsAward = {
  earned: number;
  base: number;
  challenge: boolean;
};

function toPulse(recipe: {
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
}): PulseRecipe {
  return {
    slug: recipe.slug,
    title: recipe.title,
    summary: recipe.summary,
    category: recipe.category,
    timeMinutes: recipe.timeMinutes,
    glutenFree: recipe.glutenFree,
    nutrients: recipe.nutrients,
    source: recipe.source,
    veganScore: recipe.veganScore,
    image: recipe.image,
  };
}

/** Challenge bonus: recipe of the week OR matches this week’s theme. */
export function isChallengeRecipe(
  recipe: PulseRecipe,
  catalog: PulseRecipe[],
  now = new Date(),
): boolean {
  const theme = currentTheme(now);
  const week = pickRecipeOfWeek(catalog, now);
  if (week?.slug === recipe.slug) return true;
  return matchesTheme(recipe, theme);
}

export function awardRecipeLeafPoints(
  recipe: {
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
  },
  catalog: typeof recipe[],
  now = new Date(),
): LeafPointsAward {
  const pulse = toPulse(recipe);
  const pool = catalog.map(toPulse);
  const challenge = isChallengeRecipe(pulse, pool, now);
  const base = RECIPE_LEAF_POINTS;
  return {
    base,
    challenge,
    earned: challenge ? base * 2 : base,
  };
}
