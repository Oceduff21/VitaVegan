import { prisma } from "@/lib/prisma";

export type CatalogSource = "user-scan" | "user-created" | "openfoodfacts" | "openbeautyfacts" | "openproducts";

export type ContributedProduct = {
  id: string;
  source: string;
  scanCount: number;
};

/** Persist a scanned/analyzed product so others see “scanned by users”. */
export async function contributeScannedProduct(input: {
  userId?: string | null;
  kind: string;
  barcode: string;
  name: string;
  brand?: string;
  image?: string | null;
  ingredientsText?: string;
  veganScore: number;
  veganWhy: string;
  cruelty?: string;
  source?: CatalogSource;
}): Promise<ContributedProduct | null> {
  const digits = (input.barcode ?? "").replace(/\D/g, "");
  if (!digits || !input.name?.trim()) return null;

  try {
    const existing = await prisma.catalogProduct.findFirst({
      where: { barcode: digits },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      const updated = await prisma.catalogProduct.update({
        where: { id: existing.id },
        data: {
          scanCount: { increment: 1 },
          name: existing.name || input.name.trim(),
          brand: existing.brand || (input.brand ?? ""),
          image: existing.image || (input.image ?? ""),
          ingredientsText: existing.ingredientsText || (input.ingredientsText ?? ""),
          veganScore: input.veganScore || existing.veganScore,
          veganWhy: input.veganWhy || existing.veganWhy,
          cruelty: input.cruelty || existing.cruelty,
          source: existing.source === "user-created" ? "user-created" : "user-scan",
        },
      });
      return { id: updated.id, source: updated.source, scanCount: updated.scanCount };
    }

    const created = await prisma.catalogProduct.create({
      data: {
        kind: input.kind,
        barcode: digits,
        name: input.name.trim(),
        brand: input.brand ?? "",
        image: input.image ?? "",
        ingredientsText: input.ingredientsText ?? "",
        veganScore: input.veganScore,
        veganWhy: input.veganWhy,
        cruelty: input.cruelty ?? "unknown",
        source: input.source ?? "user-scan",
        scanCount: 1,
        authorId: input.userId ?? null,
      },
    });
    return { id: created.id, source: created.source, scanCount: created.scanCount };
  } catch {
    return null;
  }
}

export function isUserScannedSource(source?: string | null) {
  return source === "user-scan" || source === "user-created";
}
