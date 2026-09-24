"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { PipGuide } from "@/components/guide/PipGuide";
import { prefersReducedMotion } from "@/lib/motion";

const ONBOARD_KEY = "verdegan-onboarded";
const BUDDY_KEY = "verdegan-pip-buddy";
const TIP_DAY_KEY = "verdegan-pip-tip-day";

type Tip = { key: string; href?: string };

function tipForPath(path: string): Tip {
  if (path.startsWith("/scan")) return { key: "pip.tip.scan", href: "/comparer" };
  if (path.startsWith("/recettes")) return { key: "pip.tip.recipes", href: "/favoris" };
  if (path.startsWith("/academie")) return { key: "pip.tip.academy" };
  if (path.startsWith("/dashboard") || path === "/") return { key: "pip.tip.home", href: "/scan" };
  if (path.startsWith("/comparer")) return { key: "pip.tip.compare" };
  if (path.startsWith("/compte") || path.startsWith("/amis")) return { key: "pip.tip.account" };
  return { key: "pip.tip.default", href: "/scan" };
}

/** Floating Pip companion — after onboarding, one tip per day (expandable). */
export function GuideBuddy() {
  const { t } = useI18n();
  const path = usePathname();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [hiddenToday, setHiddenToday] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(ONBOARD_KEY)) {
        setReady(false);
        return;
      }
      if (localStorage.getItem(BUDDY_KEY) === "off") {
        setReady(false);
        return;
      }
      const day = new Date().toISOString().slice(0, 10);
      setHiddenToday(localStorage.getItem(TIP_DAY_KEY) === day);
      setReady(true);
    } catch {
      setReady(false);
    }
  }, [path]);

  const tip = useMemo(() => tipForPath(path), [path]);

  if (!ready || hiddenToday) return null;

  function dismissToday() {
    try {
      localStorage.setItem(TIP_DAY_KEY, new Date().toISOString().slice(0, 10));
    } catch {
      /* ignore */
    }
    setHiddenToday(true);
    setOpen(false);
  }

  function disableBuddy() {
    try {
      localStorage.setItem(BUDDY_KEY, "off");
    } catch {
      /* ignore */
    }
    setReady(false);
  }

  return (
    <div className="pointer-events-none fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-3 z-[55] flex flex-col items-end gap-2 md:bottom-6">
      {open ? (
        <div
          className={`pointer-events-auto w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl bg-cream p-3 shadow-lg ring-1 ring-ink/10 ${
            prefersReducedMotion() ? "" : "anim-card-in"
          }`}
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-leaf">{t("pip.name")}</p>
          <p className="mt-1 text-sm text-ink/80">{t(tip.key)}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tip.href ? (
              <Link href={tip.href} className="btn btn-primary text-xs" onClick={() => setOpen(false)}>
                {t("pip.tipGo")}
              </Link>
            ) : null}
            <button type="button" className="btn btn-secondary text-xs" onClick={dismissToday}>
              {t("pip.tipOk")}
            </button>
          </div>
          <button type="button" className="mt-2 text-[0.65rem] text-ink/45 underline" onClick={disableBuddy}>
            {t("pip.hide")}
          </button>
        </div>
      ) : null}
      <button
        type="button"
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream shadow-md ring-2 ring-leaf/40 transition hover:ring-leaf"
        aria-label={t("pip.open")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <PipGuide pose={open ? "speak" : "wave"} size={44} />
      </button>
    </div>
  );
}
