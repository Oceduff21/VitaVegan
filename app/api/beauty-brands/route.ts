import { NextResponse } from "next/server";
import { searchBeautyBrands, suggestBeautyBrands } from "@/lib/openbeautyfacts/brands";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const filterRaw = searchParams.get("filter") ?? "all";
  const filter =
    filterRaw === "free" || filterRaw === "tested" || filterRaw === "vegan" ? filterRaw : "all";

  try {
    const brands = await searchBeautyBrands({ q, filter, limit: q ? 50 : 80 });
    const suggestions = brands.length === 0 && q.length >= 3 ? await suggestBeautyBrands(q) : [];
    return NextResponse.json({ brands, suggestions, source: "openbeautyfacts", count: brands.length });
  } catch {
    return NextResponse.json({ brands: [], suggestions: [], error: "fetch_failed", count: 0 }, { status: 502 });
  }
}
