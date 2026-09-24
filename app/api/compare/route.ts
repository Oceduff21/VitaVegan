import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isLocale, type Locale } from "@/lib/i18n/dictionaries";
import { lookupCompareItem } from "@/lib/compare-lookup";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json()) as { barcodes?: string[]; lang?: string };
  const lang: Locale = isLocale(body.lang) ? body.lang : "fr";
  const codes = (body.barcodes ?? []).map((c) => c.replace(/\D/g, "")).filter(Boolean).slice(0, 2);
  if (!codes.length) return NextResponse.json({ error: "need_code" }, { status: 400 });

  const items = await Promise.all(codes.map((barcode) => lookupCompareItem(barcode, lang, session.user.id)));
  return NextResponse.json({ items });
}
