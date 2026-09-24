"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function ForgotPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [link, setLink] = useState<string | null>(null);

  return (
    <form
      className="mx-auto flex max-w-md flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch("/api/password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setLink(data.resetUrl ?? "ok");
      }}
    >
      <h1 className="text-2xl">{t("auth.forgot")}</h1>
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.email")} className="min-h-12 rounded-full border border-forest/20 bg-white px-4" />
      <button className="min-h-12 rounded-full bg-forest text-cream">{t("auth.sendLink")}</button>
      {link ? (
        <p className="text-sm">
          {t("auth.resetSent")}
          {link !== "ok" ? (
            <>
              <br />
              <a className="underline break-all" href={link}>
                {link}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}
