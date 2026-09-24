import Link from "next/link";
import { auth, signOut } from "@/auth";
import { isAdmin } from "@/auth";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { BottomNav } from "@/components/BottomNav";
import { DesktopNav } from "@/components/DesktopNav";
import { getT } from "@/lib/i18n/server";
import { isPremium } from "@/lib/entitlements";
import { prisma } from "@/lib/prisma";
import { parsePrefs } from "@/lib/profile";
import { UserAvatar } from "@/components/avatars/UserAvatar";

export async function Nav() {
  const session = await auth();
  const role = session?.user?.role;
  const { t } = await getT();
  const premium = isPremium(role, session?.user?.trialEndsAt);
  const prefs = session?.user
    ? parsePrefs((await prisma.user.findUnique({ where: { id: session.user.id }, select: { prefs: true } }))?.prefs)
    : null;
  const links = premium
    ? [
        { href: "/scan", label: t("nav.scan") },
        { href: "/recettes", label: t("nav.recipes") },
        { href: "/dashboard", label: t("nav.gauges") },
        { href: "/cosmetiques", label: t("nav.cosmetics") },
      ]
    : session?.user
      ? [
          { href: "/scan", label: t("nav.scan") },
          { href: "/cosmetiques", label: t("nav.cosmetics") },
        ]
      : [
          { href: "/scan", label: t("nav.scan") },
          { href: "/cosmetiques", label: t("nav.cosmetics") },
        ];
  if (isAdmin(role)) links.push({ href: "/admin", label: "Admin" });

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-ink/8 bg-white/80 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5">
          <Link href="/" className="display text-xl text-forest sm:text-2xl">
            VitaVegan
          </Link>
          <DesktopNav links={links} />
          <div className="flex items-center gap-2 text-sm">
            <LanguageSwitcher />
            {session?.user ? (
              <>
                <Link href="/compte" className="tap hidden min-h-10 items-center gap-2 rounded-full px-1.5 py-1 hover:bg-ink/5 md:inline-flex">
                  {prefs ? <UserAvatar avatarId={prefs.avatarId} photo={prefs.photo} size={32} /> : null}
                  <span className="max-w-[8rem] truncate font-semibold">{session.user.name}</span>
                  {premium ? (
                    <span className="rounded-full bg-leaf/25 px-2 py-0.5 text-xs font-semibold text-forest">
                      {t("nav.premium")}
                    </span>
                  ) : null}
                </Link>
                <form
                  className="hidden md:block"
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button type="submit" className="min-h-10 rounded-full px-3 text-ink/55 hover:bg-ink/5 hover:text-ink">
                    {t("nav.logout")}
                  </button>
                </form>
              </>
            ) : (
              <Link href="/connexion" className="btn btn-primary min-h-10 px-4 py-2 text-sm">
                {t("nav.login")}
              </Link>
            )}
          </div>
        </div>
      </header>
      <BottomNav fullApp={premium} signedIn={Boolean(session?.user)} avatarId={prefs?.avatarId} photo={prefs?.photo} />
    </>
  );
}
