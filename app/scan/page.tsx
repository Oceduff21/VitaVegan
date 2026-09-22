import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { remainingScans } from "@/lib/billing";
import { ScanClient } from "@/components/ScanClient";

export default async function ScanPage() {
  const session = await auth();
  let remaining: number | "unlimited" = 3;
  if (session?.user) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user) {
      const rem = remainingScans(user.role, user.scansToday, user.scansDate);
      remaining = rem === Infinity ? "unlimited" : rem;
    }
  }
  return <ScanClient remaining={remaining} />;
}
