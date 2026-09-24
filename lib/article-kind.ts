export const ARTICLE_KINDS = [
  "food",
  "cosmetic",
  "clothing",
  "shoes",
  "bag",
  "linen",
  "household",
  "other",
] as const;

export type ArticleKind = (typeof ARTICLE_KINDS)[number];

const KIND_NEEDLES: { kind: ArticleKind; needles: string[] }[] = [
  {
    kind: "shoes",
    needles: [
      "en:shoes",
      "en:footwear",
      "chaussure",
      "shoe",
      "sneaker",
      "basket",
      "botte",
      "boot",
      "sandale",
      "sandal",
      "espadrille",
    ],
  },
  {
    kind: "bag",
    needles: ["en:bags", "en:handbags", "sac a", "sac à", "handbag", "backpack", "portefeuille", "wallet", "besace"],
  },
  {
    kind: "linen",
    needles: [
      "en:bed-linens",
      "en:towels",
      "linge de",
      "serviette",
      "housse",
      "drap",
      "towel",
      "bedding",
      "pillowcase",
    ],
  },
  {
    kind: "clothing",
    needles: [
      "en:clothes",
      "en:clothing",
      "en:textiles",
      "vetement",
      "vêtement",
      "t-shirt",
      "tshirt",
      "chemise",
      "pantalon",
      "jean",
      "robe",
      "manteau",
      "jacket",
      "hoodie",
      "pull",
      "chaussette",
      "sock",
      "apparel",
    ],
  },
  {
    kind: "household",
    needles: [
      "en:household",
      "en:cleaning",
      "en:detergents",
      "en:laundry",
      "lessive",
      "detergent",
      "vaisselle",
      "menager",
      "ménager",
      "dishwasher",
      "bleach",
      "javel",
      "nettoyant",
    ],
  },
  {
    kind: "cosmetic",
    needles: [
      "en:cosmetics",
      "en:shampoos",
      "cosmetique",
      "cosmétique",
      "shampoo",
      "gel douche",
      "shower gel",
      "creme",
      "crème",
      "lotion",
    ],
  },
  {
    kind: "food",
    needles: [
      "en:foods",
      "en:beverages",
      "en:meals",
      "en:snacks",
      "aliment",
      "boisson",
      "beverage",
      "drink",
      "dairy",
    ],
  },
];

export function isArticleKind(value: string): value is ArticleKind {
  return (ARTICLE_KINDS as readonly string[]).includes(value);
}

export function normalizeArticleKind(value: string | null | undefined): ArticleKind {
  if (value === "beauty") return "cosmetic";
  if (value && isArticleKind(value)) return value;
  return "other";
}

export function kindI18nKey(kind: string): `kind.${ArticleKind}` {
  return `kind.${normalizeArticleKind(kind)}`;
}

export function showsCruelty(kind: string): boolean {
  const k = normalizeArticleKind(kind);
  return k === "cosmetic" || k === "household";
}

export function isEdible(kind: string): boolean {
  return normalizeArticleKind(kind) === "food";
}

function haystack(categories: string[] | undefined, name: string | undefined): string {
  return [...(categories ?? []), name ?? ""]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function classifyArticleKind(input: { categories?: string[]; name?: string }): ArticleKind {
  const hay = haystack(input.categories, input.name);
  for (const rule of KIND_NEEDLES) {
    if (rule.needles.some((n) => hay.includes(n.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")))) {
      return rule.kind;
    }
  }
  return "other";
}
