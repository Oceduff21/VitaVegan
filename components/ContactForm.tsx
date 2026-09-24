"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function ContactForm({ kind }: { kind: string }) {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setOk(false);
    setError(false);
    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, message, target: kind }),
    });
    if (res.ok) {
      setOk(true);
      setMessage("");
    } else {
      setError(true);
    }
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="mt-4 flex flex-col gap-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
        required
        minLength={8}
        className="field"
        placeholder={t("contact.messagePh")}
      />
      <button type="submit" className="btn btn-primary w-full sm:w-auto">
        {t("contact.send")}
      </button>
      {ok ? <p className="text-sm text-forest">{t("contact.sent")}</p> : null}
      {error ? <p className="text-sm text-terracotta">{t("contact.fail")}</p> : null}
    </form>
  );
}
