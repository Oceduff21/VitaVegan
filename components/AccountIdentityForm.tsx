"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { ageFromBirthDate, MIN_AGE } from "@/lib/password";
import { normalizeHandle } from "@/lib/public-author";

export function AccountIdentityForm({
  userId,
  handle: initialHandle,
  firstName,
  lastName,
  birthDate,
  email,
}: {
  userId: string;
  handle: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [handle, setHandle] = useState(initialHandle);
  const [fn, setFn] = useState(firstName);
  const [ln, setLn] = useState(lastName);
  const [dob, setDob] = useState(birthDate);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const age = dob ? ageFromBirthDate(dob) : 0;

  async function copyId() {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  function handleErrorMessage(code?: string) {
    if (code === "handle_empty" || code === "handle_format") return t("account.handleFormat");
    if (code === "handle_reserved") return t("account.handleReserved");
    if (code === "handle_taken") return t("account.handleTaken");
    if (code === "age") return t("auth.needAge");
    if (code === "name") return t("auth.needName");
    return t("scan.fail");
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setOk(false);
        if (!fn.trim() || !ln.trim()) {
          setError(t("auth.needName"));
          return;
        }
        if (!dob || ageFromBirthDate(dob) < MIN_AGE) {
          setError(t("auth.needAge"));
          return;
        }
        if (!normalizeHandle(handle)) {
          setError(t("account.handleFormat"));
          return;
        }
        setBusy(true);
        try {
          const res = await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identity: true,
              firstName: fn.trim(),
              lastName: ln.trim(),
              birthDate: dob,
              handle: normalizeHandle(handle),
            }),
          });
          if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as { error?: string };
            setError(handleErrorMessage(data.error));
            return;
          }
          setOk(true);
          router.refresh();
        } finally {
          setBusy(false);
        }
      }}
    >
      <p className="text-sm text-ink/70">{t("account.identityLead")}</p>
      <p className="rounded-2xl bg-sand/50 px-3 py-2 text-xs text-ink/60">{t("account.privacyNote")}</p>

      <label className="text-sm">
        {t("account.handle")}
        <div className="mt-1 flex items-center gap-1">
          <span className="text-ink/45" aria-hidden>
            @
          </span>
          <input
            className="field flex-1 font-mono"
            value={handle}
            onChange={(e) => setHandle(normalizeHandle(e.target.value))}
            autoComplete="username"
            spellCheck={false}
            maxLength={20}
            required
            placeholder={t("account.handlePh")}
            aria-describedby="handle-hint"
          />
        </div>
        <p id="handle-hint" className="mt-1 text-[0.7rem] text-ink/50">
          {t("account.handleHint")}
        </p>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          {t("auth.firstName")}
          <input
            className="field mt-1"
            value={fn}
            onChange={(e) => setFn(e.target.value)}
            autoComplete="given-name"
            required
          />
        </label>
        <label className="text-sm">
          {t("auth.lastName")}
          <input
            className="field mt-1"
            value={ln}
            onChange={(e) => setLn(e.target.value)}
            autoComplete="family-name"
            required
          />
        </label>
      </div>
      <label className="text-sm">
        {t("auth.birthDate")}
        <input
          type="date"
          className="field mt-1"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          autoComplete="bday"
          required
        />
      </label>
      {dob && age >= MIN_AGE ? (
        <p className="text-xs text-ink/55">{t("account.ageShown").replace("{n}", String(age))}</p>
      ) : null}
      <label className="text-sm">
        {t("account.email")}
        <input className="field mt-1 bg-sand/40" type="email" value={email} readOnly aria-readonly />
      </label>
      <p className="text-[0.7rem] text-ink/45">{t("account.emailHint")}</p>

      <div className="rounded-2xl bg-sand/50 px-3 py-2.5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-ink/45">{t("account.userId")}</p>
        <div className="mt-1 flex items-center gap-2">
          <code className="min-w-0 flex-1 truncate font-mono text-xs text-ink/80" title={userId}>
            {userId}
          </code>
          <button type="button" className="btn btn-secondary h-8 min-h-8 shrink-0 px-2.5 text-xs" onClick={() => void copyId()}>
            {copied ? t("account.copied") : t("account.copyId")}
          </button>
        </div>
        <p className="mt-1 text-[0.65rem] text-ink/45">{t("account.userIdHint")}</p>
      </div>

      {error ? <p className="text-sm text-terracotta">{error}</p> : null}
      {ok ? <p className="text-sm text-leaf">{t("pref.saved")}</p> : null}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? t("ava.saving") : t("account.identitySave")}
      </button>
    </form>
  );
}
