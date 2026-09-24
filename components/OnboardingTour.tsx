"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { prefersReducedMotion } from "@/lib/motion";

const KEY = "vitavegan-onboarded";

export function OnboardingTour() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) return;
      setOpen(true);
    } catch {
      /* private mode */
    }
  }, []);

  function close() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  const steps = [
    { title: t("onboard.1.title"), body: t("onboard.1.body") },
    { title: t("onboard.2.title"), body: t("onboard.2.body") },
    { title: t("onboard.3.title"), body: t("onboard.3.body") },
  ];
  const current = steps[step]!;
  const last = step >= steps.length - 1;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/35 p-4 sm:items-center"
      role="dialog"
      aria-modal
      aria-labelledby="onboard-title"
    >
      <div
        className={`w-full max-w-md rounded-3xl bg-cream p-5 shadow-xl ring-1 ring-ink/10 ${prefersReducedMotion() ? "" : "anim-card-in"}`}
      >
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-leaf">
          {t("onboard.kicker").replace("{n}", String(step + 1)).replace("{total}", String(steps.length))}
        </p>
        <h2 id="onboard-title" className="mt-1 text-xl text-ink">
          {current.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{current.body}</p>
        <div className="mt-5 flex gap-2">
          <button type="button" className="btn btn-secondary flex-1" onClick={close}>
            {t("onboard.skip")}
          </button>
          <button
            type="button"
            className="btn btn-primary flex-1"
            onClick={() => {
              if (last) close();
              else setStep((s) => s + 1);
            }}
          >
            {last ? t("onboard.done") : t("onboard.next")}
          </button>
        </div>
      </div>
    </div>
  );
}
