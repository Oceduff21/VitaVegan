export type RecipeFilterSp = {
  cat?: string;
  gf?: string;
  max?: string;
  fav?: string;
  mine?: string;
  alc?: string;
  kind?: string;
  q?: string;
};

const PARAMS = ["cat", "gf", "max", "fav", "mine", "alc", "kind", "q"] as const;

export function recipesHref(sp: RecipeFilterSp, patch: Partial<Record<(typeof PARAMS)[number], string | null>> = {}) {
  const next: RecipeFilterSp = { ...sp };
  for (const key of PARAMS) {
    if (!(key in patch)) continue;
    const value = patch[key];
    if (value) next[key] = value;
    else delete next[key];
  }
  const q = new URLSearchParams();
  for (const key of PARAMS) {
    const value = next[key];
    if (value) q.set(key, value);
  }
  const s = q.toString();
  return s ? `/recettes?${s}` : "/recettes";
}

export const KIND_CHIPS: Record<string, { id: string; labelKey: string }[]> = {
  "petit-dej": [
    { id: "chaud", labelKey: "recipes.kind.chaud" },
    { id: "smoothie", labelKey: "recipes.kind.smoothie" },
    { id: "crunchy", labelKey: "recipes.kind.crunchy" },
  ],
  plat: [
    { id: "bowl", labelKey: "recipes.kind.bowl" },
    { id: "soup", labelKey: "recipes.kind.soup" },
    { id: "spicy", labelKey: "recipes.kind.spicy" },
    { id: "comfort", labelKey: "recipes.kind.comfort" },
  ],
  dessert: [
    { id: "nobake", labelKey: "recipes.kind.nobake" },
    { id: "oven", labelKey: "recipes.kind.oven" },
  ],
  snack: [
    { id: "savory", labelKey: "recipes.kind.savory" },
    { id: "sweet", labelKey: "recipes.kind.sweet" },
  ],
  apero: [
    { id: "drink", labelKey: "recipes.kind.drink" },
    { id: "bites", labelKey: "recipes.kind.bites" },
  ],
  batch: [
    { id: "meal", labelKey: "recipes.kind.meal" },
    { id: "sauce", labelKey: "recipes.kind.sauce" },
  ],
  bases: [
    { id: "lait", labelKey: "recipes.kind.lait" },
    { id: "proteine", labelKey: "recipes.kind.proteine" },
    { id: "gras", labelKey: "recipes.kind.gras" },
  ],
  boisson: [
    { id: "fermente", labelKey: "recipes.kind.fermente" },
    { id: "latte", labelKey: "recipes.kind.latte" },
    { id: "the", labelKey: "recipes.kind.the" },
  ],
};

const SLUG_KINDS: Record<string, string[]> = {
  "porridge-avoine-myrtilles": ["chaud"],
  "tofu-brouille-epinards": ["chaud"],
  "smoothie-vert-chanvre": ["smoothie"],
  "granola-maison": ["crunchy"],
  "dal-lentilles-corail": ["spicy"],
  "pad-thai-tofu": ["spicy"],
  "steak-soja-frites-patate": ["comfort"],
  "saucisses-vegetales-choucroute": ["comfort"],
  "risotto-champignons": ["comfort"],
  "buddha-bowl-houmous": ["bowl"],
  "curry-pois-chiches": ["spicy"],
  "lasagnes-lentilles": ["comfort"],
  "tajine-pois-chiches-abricots": ["spicy"],
  "poke-edamame": ["bowl"],
  "soupe-miso-tofu": ["soup"],
  "mousse-chocolat-aquafaba": ["nobake"],
  "crumble-pommes-avoine": ["oven"],
  "nice-cream-banane": ["nobake"],
  "wraps-houmous-crudites": ["savory"],
  "guacamole-chips-mais": ["savory"],
  "energy-balls-dattes": ["sweet"],
  "virgin-mojito": ["drink"],
  "spritz-kombucha": ["drink"],
  "mocktail-passion-coco": ["drink"],
  "limonade-gingembre": ["drink"],
  "eau-concombre-basilic": ["drink"],
  "virgin-mary": ["drink"],
  "mojito-rhum": ["drink"],
  "gin-tonic-concombre": ["drink"],
  "spritz-prosecco-vegan": ["drink"],
  "planteur-rhum-agave": ["drink"],
  "kir-vin-vegan": ["drink"],
  "caviar-aubergine": ["bites"],
  "toasts-houmous-grenade": ["bites"],
  "olives-agrumes": ["bites"],
  "chili-sin-carne": ["meal"],
  "batch-bolognaise-lentilles": ["sauce"],
  "pesto-basilic-batch": ["sauce"],
  "bouillon-legumes-batch": ["sauce"],
  "lait-davoine-maison": ["lait"],
  "lait-amande-maison": ["lait"],
  "lait-soja-maison": ["lait"],
  "seitan-maison": ["proteine"],
  "beurre-vegetal-maison": ["gras"],
  "kombucha-gingembre": ["fermente"],
  "latte-matcha-avoine": ["the"],
  "cappuccino-avoine": ["latte"],
  "chai-latte-maison": ["the"],
  "latte-curcuma-dore": ["latte"],
};

export function foldText(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function recipeKindIds(r: {
  slug: string;
  title: string;
  summary: string;
  category: string;
  ingredients?: string;
}): string[] {
  const mapped = SLUG_KINDS[r.slug];
  if (mapped) return mapped;
  const text = foldText(`${r.title} ${r.summary} ${r.ingredients ?? ""}`);
  switch (r.category) {
    case "petit-dej":
      if (/smoothie/.test(text)) return ["smoothie"];
      if (/granola|muesli/.test(text)) return ["crunchy"];
      return ["chaud"];
    case "plat":
      if (/soupe|miso|velouté|veloute/.test(text)) return ["soup"];
      if (/bowl|poke|buddha/.test(text)) return ["bowl"];
      if (/curry|dal|tajine|pad tha|épicé|epice|piment/.test(text)) return ["spicy"];
      return ["comfort"];
    case "dessert":
      if (/four|crumble|gâteau|gateau|cookie|cake/.test(text)) return ["oven"];
      return ["nobake"];
    case "snack":
      if (/datte|cacao|sucré|sucre|ball|cookie/.test(text)) return ["sweet"];
      return ["savory"];
    case "apero":
      if (/toast|houmous|olive|caviar|dip|bouchée|bouchee|chips/.test(text)) return ["bites"];
      return ["drink"];
    case "batch":
      if (/sauce|bolognaise|pesto|bouillon/.test(text)) return ["sauce"];
      return ["meal"];
    case "bases":
      if (/lait|boisson|avoine|amande|soja/.test(text) && !/beurre|seitan/.test(text)) return ["lait"];
      if (/seitan|tofu|tempeh|protéine|proteine/.test(text)) return ["proteine"];
      if (/beurre|margarine|huile|gras/.test(text)) return ["gras"];
      return ["lait"];
    case "boisson":
      if (/kombucha|kéfir|kefir|ferment/.test(text)) return ["fermente"];
      if (/matcha|thé|the|chai|infusion/.test(text)) return ["the"];
      return ["latte"];
    default:
      return [];
  }
}

export function recipeMatchesQuery(
  r: { title: string; summary: string; ingredients?: string },
  q: string,
  extra = "",
) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const extraFold = extra ? ` ${foldText(extra)}` : "";
  const text = `${foldText(`${r.title} ${r.summary} ${r.ingredients ?? ""}`)}${extraFold}`;
  return needle.split(/\s+/).every((word) => text.includes(word));
}
