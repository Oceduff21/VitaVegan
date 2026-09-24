import { auth, isSubscriber, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { SubscribeButtons } from "@/components/SubscribeButtons";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";
import { ProfileForm } from "@/components/ProfileForm";
import { prisma } from "@/lib/prisma";
import { remainingScans } from "@/lib/billing";
import { getT } from "@/lib/i18n/server";
import { isPremium, isTrialActive } from "@/lib/entitlements";
import { parsePrefs } from "@/lib/profile";
import { AvatarPicker } from "@/components/AvatarPicker";
import { UserAvatar } from "@/components/avatars/UserAvatar";
import { ShortcutPills } from "@/components/ShortcutPills";
import Link from "next/link";

export default async function ComptePage({
  searchParams,
}: {
  searchParams: Promise<{ locked?: string }>;
}) {
  const { t } = await getT();
  const sp = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/connexion");
  const rem = remainingScans(user.role, user.scansToday, user.scansDate, user.trialEndsAt);
  const premium = isPremium(user.role, user.trialEndsAt);
  const trial = isTrialActive(user.trialEndsAt) && !isSubscriber(user.role);
  const prefs = parsePrefs(user.prefs);

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <UserAvatar avatarId={prefs.avatarId} photo={prefs.photo} size={64} />
        <div>
          <h1 className="text-2xl sm:text-3xl">{t("account.title")}</h1>
          <p>
            {user.firstName || user.name} {user.lastName} · {user.email}
          </p>
        </div>
      </div>
      <p className="text-sm text-ink/70">
        {trial ? t("trial.active") : isSubscriber(user.role) ? t("status.sub") : t("status.free")}
        {trial && user.trialEndsAt ? ` · ${t("trial.until")} ${user.trialEndsAt.toISOString().slice(0, 10)}` : ""}
        {" · "}
        {t("account.remaining")} : {rem === Infinity ? t("account.unlimited") : rem}
      </p>
      {sp.locked === "1" && !premium ? (
        <section className="rounded-3xl border border-terracotta/30 bg-white p-5">
          <h2 className="mb-2 text-2xl">{t("lock.title")}</h2>
          <p className="text-sm text-ink/70">{t("lock.lead")}</p>
        </section>
      ) : null}
      {!isSubscriber(user.role) ? (
        <section className="rounded-3xl bg-white p-5">
          <h2 className="mb-2 text-2xl">{t("account.upgrade")}</h2>
          <p className="mb-4 text-sm text-ink/70">{t("account.upgradeLead")}</p>
          <SubscribeButtons />
        </section>
      ) : (
        <p className="rounded-2xl bg-leaf/10 p-4">{t("account.thanks")}</p>
      )}
      <AvatarPicker avatarId={prefs.avatarId} photo={prefs.photo} />
      <ProfileForm initial={prefs} />
      <section className="rounded-2xl border border-ink/10 bg-white p-5">
        <h2 className="mb-3 text-xl">{t("account.tools")}</h2>
        <ShortcutPills
          items={
            premium
              ? [
                  { href: "/historique", label: t("hist.title") },
                  { href: "/comparer", label: t("cmp.title") },
                  { href: "/menu", label: t("menu.title") },
                  { href: "/courses", label: t("shop.title") },
                  { href: "/academie", label: t("nav.academy") },
                  { href: "/recettes?fav=1", label: t("fav.title") },
                ]
              : [
                  { href: "/historique", label: t("hist.title") },
                  { href: "/comparer", label: t("cmp.title") },
                ]
          }
        />
      </section>
      <p className="text-sm">
        <Link href="/cgu" className="underline">
          {t("footer.cgu")}
        </Link>
        {" · "}
        <Link href="/confidentialite" className="underline">
          {t("footer.privacy")}
        </Link>
      </p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button type="submit" className="btn btn-secondary w-full md:w-auto">
          {t("account.logout")}
        </button>
      </form>
      <DeleteAccountButton />
    </div>
  );
}
