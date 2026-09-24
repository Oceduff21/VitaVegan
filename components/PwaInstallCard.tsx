"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** Soft install card for PWA (Compte). */
export function PwaInstallCard() {
  const { t } = useI18n();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [done, setDone] = useState(false);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(display-mode: standalone)");
    setStandalone(mq.matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (standalone || done) {
    return (
      <p className="rounded-xl bg-leaf/12 px-3 py-2 text-sm text-forest">{t("pwa.installed")}</p>
    );
  }

  return (
    <div className="rounded-xl bg-sand/50 px-3 py-3">
      <p className="text-sm font-medium text-ink">{t("pwa.title")}</p>
      <p className="mt-1 text-xs text-ink/60">{t("pwa.lead")}</p>
      {deferred ? (
        <button
          type="button"
          className="btn btn-primary mt-3 min-h-10 w-full text-sm"
          onClick={async () => {
            await deferred.prompt();
            const { outcome } = await deferred.userChoice;
            setDeferred(null);
            if (outcome === "accepted") setDone(true);
          }}
        >
          {t("pwa.install")}
        </button>
      ) : (
        <p className="mt-2 text-xs text-ink/50">{t("pwa.howto")}</p>
      )}
    </div>
  );
}
