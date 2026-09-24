import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FriendsClient } from "@/components/FriendsClient";
import { getT } from "@/lib/i18n/server";

export default async function AmisPage() {
  const { t } = await getT();
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl sm:text-3xl">{t("friends.title")}</h1>
      <p className="text-sm text-ink/70">{t("friends.lead")}</p>
      <FriendsClient />
    </div>
  );
}
