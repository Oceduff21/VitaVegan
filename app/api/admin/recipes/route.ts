import { NextResponse } from "next/server";
import { auth, isAdmin } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!isAdmin(session?.user?.role)) {
    return NextResponse.json({ error: "Admin seulement" }, { status: 403 });
  }
  const body = (await req.json()) as { id: string; action: "publish" | "reject"; reason?: string };
  const status = body.action === "publish" ? "published" : "rejected";
  await prisma.recipe.update({
    where: { id: body.id },
    data: { status, rejectReason: body.reason ?? null },
  });
  return NextResponse.json({ ok: true });
}
