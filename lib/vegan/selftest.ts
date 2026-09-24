import { analyzeIngredients } from "./analyze";

const cases: { name: string; input: string; overall: string }[] = [
  { name: "lait amande", input: "lait d'amande", overall: "vegetal_certain" },
  { name: "lait seul", input: "lait", overall: "ambigu" },
  { name: "lait vache", input: "lait de vache", overall: "animal_certain" },
  { name: "steak soja", input: "steak de soja", overall: "vegetal_certain" },
  { name: "steak seul", input: "steak", overall: "ambigu" },
  { name: "saucisse vegetale", input: "saucisse végétale", overall: "vegetal_certain" },
  { name: "saucisse porc", input: "saucisse de porc", overall: "animal_certain" },
  { name: "beurre cacahuete", input: "beurre de cacahuète", overall: "vegetal_certain" },
  { name: "beurre seul", input: "beurre", overall: "animal_certain" },
  { name: "miel", input: "miel", overall: "animal_certain" },
  { name: "cuir", input: "cuir de vachette", overall: "animal_certain" },
  { name: "coton", input: "100% coton", overall: "vegetal_certain" },
  { name: "silicone pas soie", input: "silicone", overall: "vegetal_certain" },
];

let failed = 0;
for (const c of cases) {
  const got = analyzeIngredients(c.input).overall;
  if (got !== c.overall) {
    console.error(`FAIL ${c.name}: expected ${c.overall}, got ${got}`);
    failed++;
  } else {
    console.log(`ok ${c.name}`);
  }
}
if (failed) process.exit(1);
