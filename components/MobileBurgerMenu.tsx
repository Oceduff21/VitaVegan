"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { UserAvatar } from "@/components/avatars/UserAvatar";
import { logoutAction } from "@/app/actions/auth";
import { killAllCameras } from "@/lib/camera";

type ToolLink = { href: string; label: string };

export function MobileBurgerMenu({
  tools,
  signedIn,
  userName,
  premium,
  avatarId,
  photo,
  stickerId,
}: {
  tools: ToolLink[];
  signedIn: boolean;
  userName?: string;
  premium?: boolean;
  avatarId?: string;
  photo?: string;
  stickerId?: string;
}) {
  const { t } = useI18n();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const drawer =
    open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal aria-labelledby={`${panelId}-title`}>
            <button
              type="button"
              className="absolute inset-0 bg-ink/45"
              aria-label={t("nav.menuClose")}
              onClick={() => setOpen(false)}
            />
            <div
              id={panelId}
              className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col bg-cream shadow-xl ring-1 ring-ink/10"
            >
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-ink/8 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
                <h2 id={`${panelId}-title`} className="display text-lg text-forest">
                  {t("nav.menu")}
                </h2>
                <button
                  type="button"
                  className="tap grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5"
                  aria-label={t("nav.menuClose")}
                  onClick={() => setOpen(false)}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {signedIn ? (
                  <Link
                    href="/compte"
                    onClick={() => {
                      killAllCameras();
                      setOpen(false);
                    }}
                    className="mb-4 flex items-center gap-3 rounded-2xl bg-white px-3 py-3 ring-1 ring-ink/8"
                  >
                    <UserAvatar avatarId={avatarId} photo={photo} stickerId={stickerId} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{userName || t("nav.account")}</p>
                      {premium ? (
                        <span className="text-xs font-semibold text-forest">{t("nav.premium")}</span>
                      ) : (
                        <span className="text-xs text-ink/50">{t("account.sec.profile")}</span>
                      )}
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/connexion"
                    onClick={() => setOpen(false)}
                    className="btn btn-primary mb-4 w-full justify-center"
                  >
                    {t("nav.login")}
                  </Link>
                )}

                {tools.length > 0 ? (
                  <section className="mb-5">
                    <h3 className="mb-2 text-sm font-semibold text-ink/70">{t("account.tools")}</h3>
                    <ul className="flex flex-col gap-1.5">
                      {tools.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => {
                              killAllCameras();
                              setOpen(false);
                            }}
                            className="tap flex min-h-11 items-center rounded-xl bg-white px-3.5 text-sm font-medium ring-1 ring-ink/8"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                <section className="mb-5">
                  <h3 className="mb-2 text-sm font-semibold text-ink/70">{t("nav.language")}</h3>
                  <LanguageSwitcher className="w-full max-w-none" />
                </section>

                {signedIn ? (
                  <form action={logoutAction}>
                    <button type="submit" className="btn btn-secondary w-full justify-center">
                      {t("account.logout")}
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="tap relative z-[101] grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-ink/5"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t("nav.menuClose") : t("nav.menuOpen")}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        )}
      </button>
      {drawer}
    </div>
  );
}
