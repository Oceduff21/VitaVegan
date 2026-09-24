export const MASCOT_IDS = [
  "pip",
  "lulu",
  "chien",
  "pesto",
  "meuh",
  "pompon",
  "cocotte",
  "mouton",
  "tofu",
  "carotte",
  "edamame",
  "avocat",
  "champi",
  "banane",
  "brocoli",
  "aubergine",
] as const;

export type MascotId = (typeof MASCOT_IDS)[number];

export const MASCOTS: { id: MascotId; nameKey: string; group: "animal" | "food" }[] = [
  { id: "pip", nameKey: "ava.pip", group: "animal" },
  { id: "lulu", nameKey: "ava.lulu", group: "animal" },
  { id: "chien", nameKey: "ava.chien", group: "animal" },
  { id: "pesto", nameKey: "ava.pesto", group: "animal" },
  { id: "meuh", nameKey: "ava.meuh", group: "animal" },
  { id: "pompon", nameKey: "ava.pompon", group: "animal" },
  { id: "cocotte", nameKey: "ava.cocotte", group: "animal" },
  { id: "mouton", nameKey: "ava.mouton", group: "animal" },
  { id: "tofu", nameKey: "ava.tofu", group: "food" },
  { id: "carotte", nameKey: "ava.carotte", group: "food" },
  { id: "edamame", nameKey: "ava.edamame", group: "food" },
  { id: "avocat", nameKey: "ava.avocat", group: "food" },
  { id: "champi", nameKey: "ava.champi", group: "food" },
  { id: "banane", nameKey: "ava.banane", group: "food" },
  { id: "brocoli", nameKey: "ava.brocoli", group: "food" },
  { id: "aubergine", nameKey: "ava.aubergine", group: "food" },
];

export const ANIMAL_MASCOTS = MASCOTS.filter((m) => m.group === "animal");
export const FOOD_MASCOTS = MASCOTS.filter((m) => m.group === "food");

export function isMascotId(v: string | null | undefined): v is MascotId {
  return !!v && (MASCOT_IDS as readonly string[]).includes(v);
}
