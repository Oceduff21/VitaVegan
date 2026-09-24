import { prisma } from "@/lib/prisma";
import type { PlanetContext } from "@/lib/planet";

export async function rememberScan(
  userId: string,
  input: {
    kind?: string;
    barcode?: string;
    name?: string;
    brand?: string;
    image?: string | null;
    veganScore: number;
    veganWhy: string;
    cruelty?: string;
    planet?: PlanetContext;
  },
) {
  try {
    await prisma.scanEvent.create({
      data: {
        userId,
        kind: input.kind ?? "food",
        barcode: input.barcode ?? "",
        name: input.name || "Produit",
        brand: input.brand ?? "",
        image: input.image ?? "",
        veganScore: input.veganScore,
        veganWhy: input.veganWhy,
        cruelty: input.cruelty ?? "",
        ecoGrade: input.planet?.ecoGrade ?? "",
        palmOil: input.planet?.palmOil ?? "unknown",
        origin: input.planet?.origin ?? "",
      },
    });
  } catch {
    /* history is best-effort */
  }
}
