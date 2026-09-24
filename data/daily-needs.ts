export type NutrientKey =
  | "calories"
  | "protein"
  | "iron"
  | "calcium"
  | "b12"
  | "omega3"
  | "vitaminD"
  | "iodine"
  | "zinc"
  | "fiber";

export type NutrientDef = {
  key: NutrientKey;
  label: string;
  unit: string;
  adultDaily: number;
  tipLow: string;
};

export const DAILY_NEEDS: NutrientDef[] = [
  {
    key: "calories",
    label: "Calories",
    unit: "kcal",
    adultDaily: 2000,
    tipLow: "Ajoute une poignée de noix, un bol de riz ou un smoothie.",
  },
  {
    key: "protein",
    label: "Protéines",
    unit: "g",
    adultDaily: 60,
    tipLow: "Idées : tofu, lentilles, seitan, yaourt de soja.",
  },
  {
    key: "iron",
    label: "Fer",
    unit: "mg",
    adultDaily: 11,
    tipLow: "Idées : lentilles, pois chiches ; souvent avec citron ou poivron en cuisine.",
  },
  {
    key: "calcium",
    label: "Calcium",
    unit: "mg",
    adultDaily: 950,
    tipLow: "Idées : lait végétal enrichi, chou, tahini, tofu nigari.",
  },
  {
    key: "b12",
    label: "Vitamine B12",
    unit: "µg",
    adultDaily: 4,
    tipLow: "Idées : aliments enrichis ou complément — à voir avec un professionnel de santé.",
  },
  {
    key: "omega3",
    label: "Oméga-3 (ALA + DHA)",
    unit: "g",
    adultDaily: 2,
    tipLow: "Idées : graines de lin mixées, chia, noix, huile de colza, algues.",
  },
  {
    key: "vitaminD",
    label: "Vitamine D",
    unit: "µg",
    adultDaily: 15,
    tipLow: "Idées : champignons, aliments enrichis, soleil — avis médical si besoin.",
  },
  {
    key: "iodine",
    label: "Iode",
    unit: "µg",
    adultDaily: 150,
    tipLow: "Idées : sel iodé, algues nori avec parcimonie.",
  },
  {
    key: "zinc",
    label: "Zinc",
    unit: "mg",
    adultDaily: 11,
    tipLow: "Idées : graines de courge, pois chiches, flocons d'avoine.",
  },
  {
    key: "fiber",
    label: "Fibres",
    unit: "g",
    adultDaily: 30,
    tipLow: "Idées : légumineuses, fruits, pain complet.",
  },
];

export type NutrientMap = Record<NutrientKey, number>;

export function emptyNutrients(): NutrientMap {
  return {
    calories: 0,
    protein: 0,
    iron: 0,
    calcium: 0,
    b12: 0,
    omega3: 0,
    vitaminD: 0,
    iodine: 0,
    zinc: 0,
    fiber: 0,
  };
}

export function addNutrients(a: NutrientMap, b: Partial<NutrientMap>): NutrientMap {
  const out = { ...a };
  (Object.keys(b) as NutrientKey[]).forEach((k) => {
    out[k] += b[k] ?? 0;
  });
  return out;
}
