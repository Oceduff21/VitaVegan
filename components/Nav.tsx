import Link from "next/link";
import { auth, isAdmin } from "@/auth";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { BottomNav } from "@/components/BottomNav";
import { DesktopNav } from "@/components/DesktopNav";
import { MobileBurgerMenu } from "@/components/MobileBurgerMenu";
import { getT } from "@/lib/i18n/server";
import { isPremium } from "@/lib/entitlements";
import { prisma } from "@/lib/prisma";
import { parsePrefs } from "@/lib/profile";
import { UserAvatar } from "@/components/avatars/UserAvatar";
import { ThemeSync } from "@/components/ThemeSync";
import { logoutAction } from "@/app/actions/auth";

export async function Nav() {
  const session = await auth();
  const role = session?.user?.role;
  const { t } = await getT();
  const premium = isPremium(role, session?.user?.trialEndsAt);
  const prefsRow = session?.user
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { prefs: true, handle: true },
      })
    : null;
  const prefs = prefsRow ? parsePrefs(prefsRow.prefs) : null;
  const publicHandle = prefsRow?.handle ? `@${prefsRow.handle}` : null;

  const links = premium
    ? [
        { href: "/scan", label: t("nav.scan") },
        { href: "/recettes", label: t("nav.recipes") },
        { href: "/dashboard", label: t("nav.gauges") },
        { href: "/academie", label: t("nav.academy") },
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

  const tools = session?.user
    ? premium
      ? [
          { href: "/amis", label: t("friends.title") },
          { href: "/dashboard", label: t("nav.gauges") },
          { href: "/favoris", label: t("fav.hubTitle") },
          { href: "/historique", label: t("hist.title") },
          { href: "/comparer", label: t("cmp.title") },
          { href: "/menu", label: t("menu.title") },
          { href: "/courses", label: t("shop.title") },
        ]
      : [
          { href: "/amis", label: t("friends.title") },
          { href: "/favoris", label: t("fav.hubTitle") },
          { href: "/historique", label: t("hist.title") },
          { href: "/comparer", label: t("cmp.title") },
        ]
    : [
        { href: "/scan", label: t("nav.scan") },
        { href: "/cosmetiques", label: t("nav.cosmetics") },
      ];

  return (
    <>
      <ThemeSync themeId={prefs?.themeId} />
      <header className="sticky top-0 z-20 border-b border-ink/8 bg-white/80 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto grid max-w-5xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
          <Link href="/" className="tap relative z-10 flex shrink-0 items-center gap-2" aria-label="Verdegan">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/verdegan-leaf-nav.png"
              alt=""
              width={36}
              height={36}
              className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
            />
            <span className="display text-lg leading-none text-forest sm:text-xl">Verdegan</span>
          </Link>
          <DesktopNav links={links} />
          <div className="flex shrink-0 items-center justify-end gap-1.5 text-sm sm:gap-2">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            {session?.user ? (
              <>
                <Link
                  href="/compte"
                  className="tap hidden min-h-10 items-center gap-2 rounded-full px-1.5 py-1 hover:bg-ink/5 md:inline-flex"
                >
                  {prefs ? (
                    <UserAvatar avatarId={prefs.avatarId} photo={prefs.photo} stickerId={prefs.stickerId} size={32} />
                  ) : null}
                  <span className="max-w-[8rem] truncate font-semibold">{publicHandle || t("nav.account")}</span>
                  {premium ? (
                    <span className="rounded-full bg-leaf/25 px-2 py-0.5 text-xs font-semibold text-forest">
                      {t("nav.premium")}
                    </span>
                  ) : null}
                </Link>
                <form className="hidden md:block" action={logoutAction}>
                  <button type="submit" className="min-h-10 rounded-full px-3 text-ink/55 hover:bg-ink/5 hover:text-ink">
                    {t("nav.logout")}
                  </button>
                </form>
              </>
            ) : (
              <Link href="/connexion" className="btn btn-primary hidden min-h-10 px-4 py-2 text-sm md:inline-flex">
                {t("nav.login")}
              </Link>
            )}
            <MobileBurgerMenu
              tools={tools}
              signedIn={Boolean(session?.user)}
              userName={publicHandle ?? undefined}
              premium={premium}
              avatarId={prefs?.avatarId}
              photo={prefs?.photo}
              stickerId={prefs?.stickerId}
            />
          </div>
        </div>
      </header>
      <BottomNav
        fullApp={premium}
        signedIn={Boolean(session?.user)}
        avatarId={prefs?.avatarId}
        photo={prefs?.photo}
        stickerId={prefs?.stickerId}
      />
    </>
  );
}
