export type PlanetContext = {
  ecoGrade: string;
  palmOil: "none" | "present" | "unknown";
  origin: string;
};

export function planetFromOff(p: {
  labels?: string[];
  countries?: string[];
  ecoGrade?: string | null;
  origins?: string[];
}): PlanetContext {
  const tags = (p.labels ?? []).map((t) => t.toLowerCase());
  const palmPresent = tags.some((t) => t.includes("palm-oil") && !t.includes("palm-oil-free") && !t.includes("without-palm"));
  const palmFree = tags.some((t) => t.includes("palm-oil-free") || t.includes("sans-huile-de-palme"));
  let palmOil: PlanetContext["palmOil"] = "unknown";
  if (palmFree) palmOil = "none";
  else if (palmPresent) palmOil = "present";
  const origin = (p.origins ?? p.countries ?? []).filter(Boolean).slice(0, 3).join(", ");
  return {
    ecoGrade: (p.ecoGrade ?? "").toUpperCase().replace("UNKNOWN", ""),
    palmOil,
    origin,
  };
}
