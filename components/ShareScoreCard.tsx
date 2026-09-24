"use client";

import { useEffect, useState } from "react";
import { AnimalScore } from "@/components/score/AnimalScore";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function ShareScoreCard({
  score,
  productName,
  handle: handleProp,
}: {
  score: number;
  productName: string;
  handle?: string;
}) {
  const { t } = useI18n();
  const [handle, setHandle] = useState(handleProp ?? "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (handleProp) return;
    void fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.handle) setHandle(String(j.handle));
      });
  }, [handleProp]);

  const line = t("share.line")
    .replace("{name}", productName)
    .replace("{score}", String(score))
    .replace("{handle}", handle ? `@${handle.replace(/^@/, "")}` : "Verdegan");

  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Verdegan", text: line });
        return;
      } catch {
        /* fallback */
      }
    }
    try {
      await navigator.clipboard.writeText(line);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-white p-3">
      <p className="text-xs font-semibold text-ink/70">{t("share.title")}</p>
      <div className="flex items-center gap-3">
        <AnimalScore score={score} size={36} showLabel={false} />
        <p className="text-sm">{line}</p>
      </div>
      <button type="button" className="btn btn-secondary w-full" onClick={() => void share()}>
        {copied ? t("share.copied") : t("share.cta")}
      </button>
    </div>
  );
}
