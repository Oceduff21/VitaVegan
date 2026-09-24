import {
  currentTheme,
  matchesTheme,
  pickRecipeOfWeek,
  type PulseRecipe,
} from "@/lib/recipe-pulse";

/** Points feuille — plant-based karma; spend in the leaf shop (badges, themes, boosts). */
export const RECIPE_LEAF_POINTS = 10;

/** Min comment length to validate a cook and earn leaf points. */
export const COOK_PROOF_MIN_CHARS = 24;

/** Max data-URL length for optional cook photo (~compressed JPEG). */
export const COOK_PROOF_PHOTO_MAX = 420_000;

export function isValidCookProofComment(comment: string): boolean {
  return comment.trim().length >= COOK_PROOF_MIN_CHARS;
}

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
