import type { CompareItem } from "@/lib/compare-lookup";
import { showsCruelty, type ArticleKind } from "@/lib/article-kind";

export type CompareFamily = ArticleKind | "mixed";
export type AnimalWinner = "a" | "b" | "tie";

export function compareFamily(a: CompareItem, b: CompareItem): CompareFamily {
  if (a.kind === b.kind) return a.kind;
  return "mixed";
}

/** 1 = worst for animals, 4 = vegan. Nutrition bonus (score 5) does not rank higher. */
export function animalRank(item: CompareItem): number {
  const base = Math.min(item.score?.score ?? 0, 4);
  if (showsCruelty(item.kind) && item.cruelty === "tested") {
    return Math.min(base || 2, 2);
  }
  return base;
}

export function animalWinner(a: CompareItem, b: CompareItem): AnimalWinner {
  const ra = animalRank(a);
  const rb = animalRank(b);
  if (ra === rb) return "tie";
  return ra > rb ? "a" : "b";
}
