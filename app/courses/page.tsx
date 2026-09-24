import { requireFullApp } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { getT } from "@/lib/i18n/server";
import { ShoppingListClient } from "@/components/ShoppingListClient";

export default async function CoursesPage() {
  const session = await requireFullApp();
  const { t } = await getT();
  const items = await prisma.shoppingItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl sm:text-3xl">{t("shop.title")}</h1>
        <p className="text-sm text-ink/70">{t("shop.lead")}</p>
      </div>
      <ShoppingListClient initial={items} />
    </div>
  );
}
