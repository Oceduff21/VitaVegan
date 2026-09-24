import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json()) as { kind?: string; barcode?: string; target?: string; message?: string };
  const message = (body.message ?? "").trim();
  if (message.length < 8) return NextResponse.json({ error: "short" }, { status: 400 });
  const report = await prisma.report.create({
    data: {
      userId: session.user.id,
      kind: body.kind === "ocr" ? "ocr" : body.kind === "other" ? "other" : "off",
      barcode: (body.barcode ?? "").replace(/\D/g, ""),
      target: body.target ?? "",
      message,
    },
  });
  return NextResponse.json({ ok: true, id: report.id });
}
