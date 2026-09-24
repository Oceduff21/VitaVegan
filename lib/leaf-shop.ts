/** Spendable leaf-point catalog — badges, early themes, academy boost, challenges. */

export type LeafShopSku =
  | "badge.scanner"
  | "badge.chef"
  | "badge.guardian"
  | "theme.moss"
  | "theme.orchard"
  | "theme.dusk"
  | "boost.academy"
  | "challenge.week";

export type LeafShopItem = {
  sku: LeafShopSku;
  cost: number;
  kind: "badge" | "theme" | "boost" | "challenge";
  titleKey: string;
  descKey: string;
  /** Theme id applied on purchase (theme kind). */
  themeId?: string;
  /** Hours of academy XP boost. */
  boostHours?: number;
};

export const LEAF_SHOP: LeafShopItem[] = [
  {
    sku: "badge.scanner",
    cost: 40,
    kind: "badge",
    titleKey: "shop.badge.scanner",
    descKey: "shop.badge.scannerDesc",
  },
  {
    sku: "badge.chef",
    cost: 120,
    kind: "badge",
    titleKey: "shop.badge.chef",
    descKey: "shop.badge.chefDesc",
  },
  {
    sku: "badge.guardian",
    cost: 280,
    kind: "badge",
    titleKey: "shop.badge.guardian",
    descKey: "shop.badge.guardianDesc",
  },
  {
    sku: "theme.moss",
    cost: 80,
    kind: "theme",
    titleKey: "leaf.theme.moss",
    descKey: "shop.theme.desc",
    themeId: "moss",
  },
  {
    sku: "theme.orchard",
    cost: 180,
    kind: "theme",
    titleKey: "leaf.theme.orchard",
    descKey: "shop.theme.desc",
    themeId: "orchard",
  },
  {
    sku: "theme.dusk",
    cost: 320,
    kind: "theme",
    titleKey: "leaf.theme.dusk",
    descKey: "shop.theme.desc",
    themeId: "dusk",
  },
  {
    sku: "boost.academy",
    cost: 50,
    kind: "boost",
    titleKey: "shop.boost.academy",
    descKey: "shop.boost.academyDesc",
    boostHours: 24,
  },
  {
    sku: "challenge.week",
    cost: 60,
    kind: "challenge",
    titleKey: "shop.challenge.week",
    descKey: "shop.challenge.weekDesc",
  },
];

export function findShopItem(sku: string): LeafShopItem | undefined {
  return LEAF_SHOP.find((i) => i.sku === sku);
}

/** Badge ids owned (from LeafSpend rows). */
export function ownedBadges(skus: string[]): string[] {
  return skus.filter((s) => s.startsWith("badge."));
}

export function ownedThemes(skus: string[]): string[] {
  return skus
    .map((s) => LEAF_SHOP.find((i) => i.sku === s)?.themeId)
    .filter((t): t is string => Boolean(t));
}
