import Link from "next/link";
import { auth, isAdmin } from "@/auth";
import { BottomNav } from "@/components/BottomNav";
import { DesktopNav } from "@/components/DesktopNav";
import { DesktopAccountMenu, DesktopGuestActions } from "@/components/DesktopAccountMenu";
import { MobileBurgerMenu } from "@/components/MobileBurgerMenu";
import { getT } from "@/lib/i18n/server";
import { isPremium } from "@/lib/entitlements";
import { prisma } from "@/lib/prisma";
import { parsePrefs } from "@/lib/profile";
import { ThemeSync } from "@/components/ThemeSync";

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

  /** Mobile burger — keep as-is (do not sync with desktop tabs). */
  const burgerTools = session?.user
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

  /** Desktop account dropdown only: pages not already in the desktop tab bar. */
  const desktopMenuLinks = [
    { href: "/amis", label: t("friends.title") },
    { href: "/favoris", label: t("fav.hubTitle") },
    { href: "/historique", label: t("hist.title") },
    { href: "/comparer", label: t("cmp.title") },
    ...(premium
      ? [
          { href: "/menu", label: t("menu.title") },
          { href: "/courses", label: t("shop.title") },
        ]
      : []),
  ].filter((item) => !links.some((l) => l.href === item.href));

  return (
    <>
      <ThemeSync themeId={prefs?.themeId} />
      <header className="sticky top-0 z-20 w-full border-b border-ink/8 bg-white/80 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="flex h-14 w-full items-center gap-2 pl-3 pr-[max(0.25rem,env(safe-area-inset-right))] sm:pl-4 md:h-16 md:pl-6 md:pr-3">
          <Link
            href="/"
            className="tap flex h-10 shrink-0 items-center gap-2"
            aria-label="Verdegan"
          >
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

          {/* Always flex-1 so the burger stays pinned to the right on mobile too. */}
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <div className="hidden md:block">
              <DesktopNav links={links} />
            </div>
          </div>

          <div className="flex h-10 shrink-0 items-center justify-end gap-1.5 sm:gap-2">
            {session?.user ? (
              <DesktopAccountMenu
                handle={publicHandle}
                premium={premium}
                avatarId={prefs?.avatarId}
                photo={prefs?.photo}
                stickerId={prefs?.stickerId}
                links={desktopMenuLinks}
              />
            ) : (
              <DesktopGuestActions />
            )}
            <MobileBurgerMenu
              tools={burgerTools}
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
