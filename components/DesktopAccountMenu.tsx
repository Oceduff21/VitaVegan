"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LOCALES } from "@/lib/i18n/dictionaries";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { UserAvatar } from "@/components/avatars/UserAvatar";
import { logoutAction } from "@/app/actions/auth";
import { navIsActive } from "@/lib/nav-active";

type MenuLink = { href: string; label: string };

export function DesktopAccountMenu({
  handle,
  premium,
  avatarId,
  photo,
  stickerId,
  links = [],
}: {
  handle: string | null;
  premium?: boolean;
  avatarId?: string;
  photo?: string;
  stickerId?: string;
  /** Pages not already in the desktop tab bar. */
  links?: MenuLink[];
}) {
  const { t, locale, setLocale } = useI18n();
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <div ref={rootRef} className="relative hidden md:block">
      <button
        type="button"
        className="tap flex h-10 items-center gap-1.5 rounded-full pl-1 pr-2 hover:bg-ink/5"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="relative">
          <UserAvatar avatarId={avatarId} photo={photo} stickerId={stickerId} size={32} />
          {premium ? (
            <span
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-leaf ring-2 ring-white"
              title={t("nav.premium")}
              aria-hidden
            />
          ) : null}
        </span>
        <span className="max-w-[7.5rem] truncate text-sm font-semibold">{handle || t("nav.account")}</span>
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 shrink-0 text-ink/45 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
          fill="none"
        >
          <path
            d="M5.25 7.5 10 12.25 14.75 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-[calc(100%+0.35rem)] z-50 max-h-[min(70vh,28rem)] w-56 overflow-y-auto rounded-2xl bg-white py-1 shadow-lg ring-1 ring-ink/10"
        >
          {premium ? (
            <p className="px-3 pb-1 pt-2 text-[0.65rem] font-semibold uppercase tracking-wide text-leaf">
              {t("nav.premium")}
            </p>
          ) : null}

          <Link
            href="/compte"
            role="menuitem"
            className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium hover:bg-ink/5 ${
              navIsActive(path, "/compte") ? "text-forest" : ""
            }`}
            onClick={() => setOpen(false)}
          >
            {t("nav.account")}
          </Link>

          {links.length ? (
            <div className="border-t border-ink/8 py-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  role="menuitem"
                  className={`flex items-center px-3 py-2.5 text-sm font-medium hover:bg-ink/5 ${
                    navIsActive(path, l.href) ? "text-forest" : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ) : null}

          <div className="border-t border-ink/8 px-3 py-2">
            <label className="flex flex-col gap-1">
              <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-ink/45">
                {t("nav.language")}
              </span>
              <select
                value={locale}
                aria-label={t("nav.language")}
                className="h-9 w-full rounded-xl border border-ink/10 bg-ink/5 px-2 text-sm font-semibold"
                onChange={(e) => {
                  setLocale(e.target.value as typeof locale);
                  router.refresh();
                }}
              >
                {LOCALES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.native}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <form action={logoutAction} className="border-t border-ink/8">
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center px-3 py-2.5 text-left text-sm font-medium text-ink/70 hover:bg-ink/5 hover:text-ink"
            >
              {t("nav.logout")}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export function DesktopGuestActions() {
  const { t, locale, setLocale } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="hidden items-center gap-2 md:flex">
      <div ref={rootRef} className="relative">
        <button
          type="button"
          className="tap grid h-10 w-10 place-items-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-ink"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={menuId}
          aria-label={t("nav.language")}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="8.5" />
            <path
              d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.2 3.3 8.5s-1.1 6.1-3.3 8.5M12 3.5C9.8 5.9 8.7 8.7 8.7 12s1.1 6.1 3.3 8.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {open ? (
          <div
            id={menuId}
            role="menu"
            className="absolute right-0 top-[calc(100%+0.35rem)] z-50 w-44 overflow-hidden rounded-2xl bg-white py-1 shadow-lg ring-1 ring-ink/10"
          >
            {LOCALES.map((l) => (
              <button
                key={l.id}
                type="button"
                role="menuitem"
                className={`flex w-full px-3 py-2 text-left text-sm font-medium hover:bg-ink/5 ${
                  l.id === locale ? "text-forest" : "text-ink/70"
                }`}
                onClick={() => {
                  setLocale(l.id);
                  setOpen(false);
                  router.refresh();
                }}
              >
                {l.native}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <Link href="/connexion" className="btn btn-primary h-10 px-4 text-sm">
        {t("nav.login")}
      </Link>
    </div>
  );
}
