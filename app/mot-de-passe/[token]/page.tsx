"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { useParams } from "next/navigation";

export default function ResetPage() {
  const { t } = useI18n();
  const params = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mx-auto flex max-w-md flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch("/api/password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: params.token, password }),
        });
        if (!res.ok) setError(t("scan.fail"));
        else setOk(true);
      }}
    >
      <h1 className="text-2xl">{t("auth.newPassword")}</h1>
      <input type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} className="min-h-12 rounded-full border border-forest/20 bg-white px-4" />
      {error ? <p className="text-terracotta">{error}</p> : null}
      {ok ? <p className="text-leaf">{t("auth.login")}</p> : null}
      <button className="min-h-12 rounded-full bg-forest text-cream">{t("auth.savePassword")}</button>
    </form>
  );
}
