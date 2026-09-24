"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { OAuthButtons } from "@/components/OAuthButtons";

export function LoginForm() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mx-auto flex max-w-md flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await signIn("credentials", { email, password, redirect: false });
        if (res?.error) setError(t("auth.badLogin"));
        else window.location.href = "/dashboard";
      }}
    >
      <h1 className="text-2xl sm:text-3xl">{t("auth.login")}</h1>
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.email")} className="field" />
      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.password")} className="field" />
      {error ? <p className="text-terracotta">{error}</p> : null}
      <button type="submit" className="btn btn-primary">
        {t("auth.enter")}
      </button>
      <p className="text-sm">
        {t("auth.noAccount")} <Link href="/inscription">{t("auth.register")}</Link>
      </p>
      <p className="text-sm">
        <Link href="/mot-de-passe" className="underline">
          {t("auth.forgot")}
        </Link>
      </p>
      <OAuthButtons />
      <p className="text-xs text-ink/50">{t("auth.demo")}</p>
    </form>
  );
}
