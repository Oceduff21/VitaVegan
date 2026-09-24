import { requireAuth } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getT } from "@/lib/i18n/server";
import { HistoryClient } from "@/components/HistoryClient";

export default async function HistoriquePage() {
  const session = await requireAuth();
  const { t } = await getT();
  const events = await prisma.scanEvent.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 80,
  });
  const favs = await prisma.productFav.findMany({
    where: { userId: session.user.id },
  });
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">{t("hist.title")}</h1>
        <p className="text-sm text-ink/70">{t("hist.lead")}</p>
      </div>
      <p>
        <Link href="/comparer" className="underline">
          {t("cmp.title")}
        </Link>
      </p>
      <HistoryClient
        events={events.map((e) => ({
          id: e.id,
          kind: e.kind,
          name: e.name,
          brand: e.brand,
          barcode: e.barcode,
          image: e.image,
          veganScore: e.veganScore,
          veganWhy: e.veganWhy,
          cruelty: e.cruelty,
          createdAt: e.createdAt.toISOString(),
        }))}
        favs={favs.map((f) => ({
          kind: f.kind,
          barcode: f.barcode,
          name: f.name,
          image: f.image,
          veganScore: f.veganScore,
        }))}
      />
    </div>
  );
}
