import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { remainingScans } from "@/lib/billing";
import { ScanClient } from "@/components/ScanClient";
import { isPremium } from "@/lib/entitlements";

export default async function ScanPage() {
  const session = await auth();
  if (!session?.user) redirect("/inscription");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/inscription");
  const rem = remainingScans(user.role, user.scansToday, user.scansDate, user.trialEndsAt);
  return (
    <Suspense fallback={<p className="text-sm text-ink/55">…</p>}>
      <ScanClient remaining={rem === Infinity ? "unlimited" : rem} fullApp={isPremium(user.role, user.trialEndsAt)} />
    </Suspense>
  );
}
