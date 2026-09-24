import { auth, isSubscriber } from "@/auth";
import { redirect } from "next/navigation";
import { SubscribeButtons } from "@/components/SubscribeButtons";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";
import { ProfileForm } from "@/components/ProfileForm";
import { AccountIdentityForm } from "@/components/AccountIdentityForm";
import { prisma } from "@/lib/prisma";
import { remainingScans } from "@/lib/billing";
import { getT } from "@/lib/i18n/server";
import { isPremium, isTrialActive } from "@/lib/entitlements";
import { parsePrefs } from "@/lib/profile";
import { LeafStylePicker } from "@/components/LeafStylePicker";
import { LeafShop } from "@/components/LeafShop";
import { UserAvatar } from "@/components/avatars/UserAvatar";
import { ShortcutPills } from "@/components/ShortcutPills";
import { PwaInstallCard } from "@/components/PwaInstallCard";
import { resolveLeafLevel } from "@/lib/leaf-rewards";
import { ageFromBirthDate } from "@/lib/dates";
import { logoutAction } from "@/app/actions/auth";
import Link from "next/link";

function Accordion({
  id,
  title,
  children,
  open = false,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details id={id} className="compte-acc group rounded-2xl border border-ink/10 bg-white" open={open}>
      <summary className="cursor-pointer list-none px-4 py-3.5 text-base font-semibold text-ink marker:content-none sm:px-5 sm:py-4 sm:text-lg [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          {title}
          <span className="text-leaf transition group-open:rotate-180" aria-hidden>
            ▾
          </span>
        </span>
      </summary>
      <div className="border-t border-ink/8 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">{children}</div>
    </details>
  );
}

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
  const level = resolveLeafLevel(user.leafPoints);
  const displayName = user.handle ? `@${user.handle}` : t("nav.account");
  const age = ageFromBirthDate(user.birthDate);
  const needsBirth = !user.birthDate;
  const needsHandle = !user.handle;

  return (
    <div className="flex max-w-xl flex-col gap-4 sm:gap-5">
      <div className="flex items-center gap-3">
        <UserAvatar avatarId={prefs.avatarId} photo={prefs.photo} stickerId={prefs.stickerId} size={56} />
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl">{t("account.title")}</h1>
          <p className="truncate text-sm sm:text-base">{displayName}</p>
          <p className="truncate text-xs text-ink/55 sm:text-sm">{t("account.privateOnly")}</p>
          <p className="text-sm text-forest">
            {t(level.current.titleKey)}
            {age != null ? ` · ${t("account.ageShown").replace("{n}", String(age))}` : ""}
          </p>
        </div>
      </div>

      {needsBirth ? (
        <p className="rounded-2xl bg-terracotta/12 px-3 py-2 text-sm text-terracotta">
          {t("account.needBirth")}{" "}
          <a href="#compte-profil" className="font-semibold underline">
            {t("account.sec.profile")}
          </a>
        </p>
      ) : null}
      {needsHandle ? (
        <p className="rounded-2xl bg-leaf/12 px-3 py-2 text-sm text-forest">
          {t("account.needHandle")}{" "}
          <a href="#compte-profil" className="font-semibold underline">
            {t("account.sec.profile")}
          </a>
        </p>
      ) : null}

      <p className="text-sm text-ink/70">
        {trial ? t("trial.active") : isSubscriber(user.role) ? t("status.sub") : t("status.free")}
        {trial && user.trialEndsAt ? ` · ${t("trial.until")} ${user.trialEndsAt.toISOString().slice(0, 10)}` : ""}
        {" · "}
        {t("account.remaining")} : {rem === Infinity ? t("account.unlimited") : rem}
        {" · "}
        {t("leaf.balance").replace("{n}", String(user.leafPoints))}
      </p>

      <nav className="flex flex-wrap gap-2 text-sm" aria-label={t("account.sections")}>
        <a href="#compte-profil" className="chip tap">
          {t("account.sec.profile")}
        </a>
        <a href="#compte-abo" className="chip tap">
          {t("account.sec.sub")}
        </a>
        <a href="#compte-style" className="chip tap">
          {t("account.sec.style")}
        </a>
        <a href="#compte-prefs" className="chip tap">
          {t("account.sec.prefs")}
        </a>
        <a href="#compte-tools" className="chip tap hidden md:inline-flex">
          {t("account.tools")}
        </a>
      </nav>

      {sp.locked === "1" && !premium ? (
        <section className="rounded-3xl border border-terracotta/30 bg-white p-5">
          <h2 className="mb-2 text-2xl">{t("lock.title")}</h2>
          <p className="text-sm text-ink/70">{t("lock.lead")}</p>
        </section>
      ) : null}

      <Accordion id="compte-profil" title={t("account.sec.profile")} open={needsBirth || needsHandle}>
        <AccountIdentityForm
          userId={user.id}
          handle={user.handle || ""}
          firstName={user.firstName || ""}
          lastName={user.lastName || ""}
          birthDate={user.birthDate || ""}
          email={user.email}
        />
      </Accordion>

      <Accordion id="compte-abo" title={t("account.sec.sub")} open={!needsBirth && !needsHandle}>
        {!isSubscriber(user.role) ? (
          <>
            <h2 className="mb-2 text-xl">{t("account.upgrade")}</h2>
            <p className="mb-4 text-sm text-ink/70">{t("account.upgradeLead")}</p>
            <SubscribeButtons />
          </>
        ) : (
          <p className="rounded-2xl bg-leaf/10 p-4">{t("account.thanks")}</p>
        )}
        <div className="mt-4">
          <PwaInstallCard />
        </div>
      </Accordion>

      <Accordion id="compte-style" title={t("account.sec.style")}>
        <LeafStylePicker
          leafPoints={user.leafPoints}
          avatarId={prefs.avatarId}
          photo={prefs.photo}
          themeId={prefs.themeId}
          stickerId={prefs.stickerId}
          purchasedThemes={prefs.purchasedThemes}
        />
        <div className="mt-4">
          <LeafShop />
        </div>
      </Accordion>

      <Accordion id="compte-prefs" title={t("account.sec.prefs")}>
        <ProfileForm initial={prefs} />
      </Accordion>

      <div className="hidden md:block">
        <Accordion id="compte-tools" title={t("account.tools")}>
          <ShortcutPills
            items={
              premium
                ? [
                    { href: "/favoris", label: t("fav.hubTitle") },
                    { href: "/historique", label: t("hist.title") },
                    { href: "/comparer", label: t("cmp.title") },
                    { href: "/amis", label: t("friends.title") },
                    { href: "/menu", label: t("menu.title") },
                    { href: "/courses", label: t("shop.title") },
                    { href: "/academie", label: t("nav.academy") },
                  ]
                : [
                    { href: "/favoris", label: t("fav.hubTitle") },
                    { href: "/historique", label: t("hist.title") },
                    { href: "/comparer", label: t("cmp.title") },
                    { href: "/amis", label: t("friends.title") },
                  ]
            }
          />
          <p className="mt-3 text-xs text-ink/55">{t("account.favHint")}</p>
        </Accordion>
      </div>

      <p className="hidden text-sm md:block">
        <Link href="/cgu" className="underline">
          {t("footer.cgu")}
        </Link>
        {" · "}
        <Link href="/confidentialite" className="underline">
          {t("footer.privacy")}
        </Link>
      </p>
      <form className="hidden md:block" action={logoutAction}>
        <button type="submit" className="btn btn-secondary w-full md:w-auto">
          {t("account.logout")}
        </button>
      </form>
      <DeleteAccountButton />
    </div>
  );
}
