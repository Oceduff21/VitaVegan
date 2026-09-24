"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";

export function SubscribeButtons() {
  const { t } = useI18n();
  async function go(plan: "monthly" | "yearly" | "demo") {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    if (data.ok) {
      window.location.reload();
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={() => void go("monthly")} className="btn btn-primary w-full">
        {t("billing.monthly")}
      </button>
      <button type="button" onClick={() => void go("yearly")} className="btn btn-secondary w-full">
        {t("billing.yearly")}
      </button>
      <button type="button" onClick={() => void go("demo")} className="btn btn-accent w-full">
        {t("billing.demo")}
      </button>
    </div>
  );
}
