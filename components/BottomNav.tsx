"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { killAllCameras } from "@/lib/camera";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { UserAvatar } from "@/components/avatars/UserAvatar";
import { IconAccount, IconBeauty, IconHealth, IconRecipes, IconScan } from "@/components/nav-icons";
import { navIsActive } from "@/lib/nav-active";

type Tab = {
  href: string;
  key: "nav.scan" | "nav.recipes" | "nav.gauges" | "nav.cosmetics" | "nav.account";
  icon: typeof IconScan;
};

const FULL_TABS: Tab[] = [
  { href: "/scan", key: "nav.scan", icon: IconScan },
  { href: "/recettes", key: "nav.recipes", icon: IconRecipes },
  { href: "/dashboard", key: "nav.gauges", icon: IconHealth },
  { href: "/cosmetiques", key: "nav.cosmetics", icon: IconBeauty },
  { href: "/compte", key: "nav.account", icon: IconAccount },
];

const FREE_TABS: Tab[] = [
  { href: "/scan", key: "nav.scan", icon: IconScan },
  { href: "/cosmetiques", key: "nav.cosmetics", icon: IconBeauty },
  { href: "/compte", key: "nav.account", icon: IconAccount },
];

export function BottomNav({
  fullApp = false,
  signedIn = false,
  avatarId,
  photo,
}: {
  fullApp?: boolean;
  signedIn?: boolean;
  avatarId?: string;
  photo?: string;
}) {
  const path = usePathname();
  const { t } = useI18n();
  const tabs = signedIn && fullApp ? FULL_TABS : FREE_TABS;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.55rem,env(safe-area-inset-bottom))] md:hidden"
      aria-label="Principal"
    >
      <ul
        className={`nav-dock grid rounded-[1.35rem] bg-white/95 p-1 backdrop-blur-md ${
          tabs.length === 3 ? "grid-cols-3" : "grid-cols-5"
        }`}
      >
        {tabs.map((tab) => {
          const active = navIsActive(path, tab.href);
          const Icon = tab.icon;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                onClick={() => killAllCameras()}
                aria-current={active ? "page" : undefined}
                className={`tap flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-[1.05rem] px-1 text-center text-[0.7rem] font-semibold leading-tight ${
                  active ? "bg-leaf/22 text-forest" : "text-ink/50"
                }`}
              >
                {tab.href === "/compte" && signedIn ? (
                  <UserAvatar avatarId={avatarId} photo={photo} size={22} />
                ) : (
                  <Icon className={`h-6 w-6 ${active ? "text-forest" : "text-ink/45"}`} />
                )}
                {t(tab.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
