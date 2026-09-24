"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { isStrongPassword, passwordErrors, ageFromBirthDate, MIN_AGE } from "@/lib/password";
import { OAuthButtons } from "@/components/OAuthButtons";

export function RegisterForm() {
  const { t } = useI18n();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function localError() {
    if (!firstName.trim() || !lastName.trim()) return t("auth.needName");
    if (!birthDate || ageFromBirthDate(birthDate) < MIN_AGE) return t("auth.needAge");
    const pe = passwordErrors(password);
    if (pe) return t(`auth.pw.${pe}`);
    return null;
  }

  return (
    <form
      className="mx-auto flex max-w-md flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const local = localError();
        if (local) {
          setError(local);
          return;
        }
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, birthDate, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          const map: Record<string, string> = {
            name: t("auth.needName"),
            age: t("auth.needAge"),
            password: t("auth.pw.weak"),
            taken: t("auth.taken"),
          };
          setError(map[data.error] ?? t("scan.fail"));
          return;
        }
        await signIn("credentials", { email, password, callbackUrl: "/scan" });
      }}
    >
      <h1 className="text-2xl sm:text-3xl">{t("auth.register")}</h1>
      <p className="text-sm text-ink/70">{t("auth.registerLead")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={t("auth.firstName")}
          className="field"
        />
        <input
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder={t("auth.lastName")}
          className="field"
        />
      </div>
      <label className="text-sm text-ink/70">
        {t("auth.birthDate")}
        <input
          type="date"
          required
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="field mt-1 text-ink"
        />
      </label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("auth.email")}
        className="field"
      />
      <input
        type="password"
        required
        minLength={10}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t("auth.password")}
        className="field"
      />
      <p className="text-xs text-ink/55">{t("auth.pw.hint")}</p>
      {password && !isStrongPassword(password) ? <p className="text-sm text-terracotta">{t(`auth.pw.${passwordErrors(password)}`)}</p> : null}
      {error ? <p className="text-terracotta">{error}</p> : null}
      <button type="submit" className="btn btn-primary">
        {t("auth.create")}
      </button>
      <p className="text-xs text-ink/60">{t("home.pricing")}</p>
      <p className="text-sm">
        <Link href="/connexion" className="underline">
          {t("auth.login")}
        </Link>
      </p>
      <OAuthButtons />
    </form>
  );
}
