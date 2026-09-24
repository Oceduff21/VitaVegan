export type CrueltyStatus = "free" | "tested" | "unknown";

export function crueltyFromTags(tags: string[]): { cruelty: CrueltyStatus; why: string } {
  const set = new Set(tags.map((t) => t.toLowerCase()));
  const free =
    set.has("en:not-tested-on-animals") ||
    set.has("en:cruelty-free") ||
    set.has("en:leaping-bunny") ||
    set.has("en:peta-cruelty-free");
  const tested =
    set.has("en:tested-on-animals") ||
    set.has("en:may-be-tested-on-animals") ||
    [...set].some((t) => t.includes("tested-on-animals") && !t.includes("not-tested"));
  if (tested && !free) return { cruelty: "tested", why: "Indices de tests sur animaux." };
  if (free) return { cruelty: "free", why: "Label cruelty-free / non testé sur les animaux." };
  return { cruelty: "unknown", why: "Pas de label cruelty-free clairement renseigné." };
}

export function veganLabelFromTags(tags: string[]): boolean | null {
  const set = new Set(tags.map((t) => t.toLowerCase()));
  if (set.has("en:vegan") || set.has("en:vegan-product")) return true;
  if (set.has("en:non-vegan") || set.has("en:non-vegetarian")) return false;
  return null;
}
