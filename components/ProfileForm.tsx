"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import type { UserPrefs } from "@/lib/profile";

const FLAGS: { key: keyof Omit<UserPrefs, "extraAllergies" | "avatarId" | "photo">; label: string }[] = [
  { key: "glutenFree", label: "pref.glutenFree" },
  { key: "nutFree", label: "pref.nutFree" },
  { key: "peanutFree", label: "pref.peanutFree" },
  { key: "soyFree", label: "pref.soyFree" },
  { key: "sesameFree", label: "pref.sesameFree" },
  { key: "coconutFree", label: "pref.coconutFree" },
  { key: "noAlcohol", label: "pref.noAlcohol" },
];

export function ProfileForm({ initial }: { initial: UserPrefs }) {
  const { t } = useI18n();
  const [prefs, setPrefs] = useState<UserPrefs>(initial);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-3 rounded-3xl bg-white p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prefs),
        });
        if (!res.ok) {
          setError(t("scan.fail"));
          return;
        }
        setOk(true);
      }}
    >
      <h2 className="text-xl">{t("pref.title")}</h2>
      <p className="text-sm text-ink/70">{t("pref.lead")}</p>
      {FLAGS.map((f) => (
        <label key={f.key} className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(prefs[f.key])}
            onChange={(e) => setPrefs((p) => ({ ...p, [f.key]: e.target.checked }))}
          />
          {t(f.label)}
        </label>
      ))}
      <textarea
        value={prefs.extraAllergies}
        onChange={(e) => setPrefs((p) => ({ ...p, extraAllergies: e.target.value }))}
        placeholder={t("pref.extra")}
        rows={3}
        className="field text-sm"
      />
      {error ? <p className="text-terracotta">{error}</p> : null}
      {ok ? <p className="text-leaf">{t("pref.saved")}</p> : null}
      <button type="submit" className="btn btn-primary">
        {t("pref.save")}
      </button>
    </form>
  );
}
