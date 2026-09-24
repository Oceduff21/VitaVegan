"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { prefersReducedMotion } from "@/lib/motion";

const KEY = "vitavegan-onboarded";

/** Anchored tour: scan CTA on home, then bottom nav. */
export function OnboardingTour() {
  const { t } = useI18n();
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [spot, setSpot] = useState<DOMRect | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) return;
      setOpen(true);
    } catch {
      /* private mode */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = step === 0 ? "onboard-scan-cta" : null;
    function measure() {
      if (!id) {
        setSpot(null);
        return;
      }
      const el = document.getElementById(id);
      setSpot(el?.getBoundingClientRect() ?? null);
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, step, path]);

  function close(goScan = false) {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
    if (goScan) router.push("/scan");
  }

  if (!open) return null;

  const steps = [
    { title: t("onboard.1.title"), body: t("onboard.1.body"), anchor: "scan" as const },
    { title: t("onboard.2.title"), body: t("onboard.2.body"), anchor: "nav" as const },
  ];
  const current = steps[step]!;
  const last = step >= steps.length - 1;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal aria-labelledby="onboard-title">
      <div className="absolute inset-0 bg-ink/45" onClick={() => close()} />
      {spot && step === 0 ? (
        <div
          className="pointer-events-none absolute z-[81] rounded-3xl ring-4 ring-leaf/80"
          style={{
            top: spot.top - 8,
            left: spot.left - 8,
            width: spot.width + 16,
            height: spot.height + 16,
            boxShadow: "0 0 0 9999px rgb(42 20 48 / 0.4)",
          }}
        />
      ) : null}
      {step === 1 ? (
        <div
          className="pointer-events-none absolute inset-x-3 z-[81] rounded-[1.35rem] ring-4 ring-leaf/80 md:hidden"
          style={{
            bottom: "max(0.55rem, env(safe-area-inset-bottom))",
            height: "4.25rem",
            boxShadow: "0 0 0 9999px rgb(42 20 48 / 0.4)",
          }}
        />
      ) : null}

      <div
        className={`absolute inset-x-0 z-[82] flex justify-center p-4 ${
          step === 1 ? "bottom-[5.5rem] md:bottom-auto md:top-1/3" : "bottom-8 sm:bottom-auto sm:top-1/3"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-3xl bg-cream p-5 shadow-xl ring-1 ring-ink/10 ${
            prefersReducedMotion() ? "" : "anim-card-in"
          }`}
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-leaf">
            {t("onboard.kicker").replace("{n}", String(step + 1)).replace("{total}", String(steps.length))}
          </p>
          <h2 id="onboard-title" className="mt-1 text-xl text-ink">
            {current.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">{current.body}</p>
          <div className="mt-5 flex gap-2">
            <button type="button" className="btn btn-secondary flex-1" onClick={() => close()}>
              {t("onboard.skip")}
            </button>
            <button
              type="button"
              className="btn btn-primary flex-1"
              onClick={() => {
                if (last) close(true);
                else {
                  if (path !== "/") router.push("/");
                  setStep((s) => s + 1);
                }
              }}
            >
              {last ? t("onboard.done") : t("onboard.next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
