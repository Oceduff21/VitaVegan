"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function ReportButton({ barcode, target }: { barcode?: string; target?: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState("off");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  async function send() {
    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, barcode, target, message }),
    });
    if (res.ok) {
      setOk(true);
      setOpen(false);
      setMessage("");
    }
  }

  return (
    <div className="text-sm">
      <button type="button" className="underline text-ink/60" onClick={() => setOpen((v) => !v)}>
        {t("report.cta")}
      </button>
      {ok ? <p className="mt-1 text-leaf">{t("report.sent")}</p> : null}
      {open ? (
        <div className="mt-2 flex flex-col gap-2 rounded-2xl bg-sand/50 p-3">
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="min-h-11 rounded-full border border-forest/20 bg-white px-3">
            <option value="off">{t("report.off")}</option>
            <option value="ocr">{t("report.ocr")}</option>
            <option value="other">{t("report.other")}</option>
          </select>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder={t("report.ph")}
            className="rounded-2xl border border-forest/20 bg-white px-3 py-2"
          />
          <button type="button" onClick={() => void send()} className="min-h-11 rounded-full bg-forest text-cream">
            {t("report.send")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
