"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import type { ActivityPref, SexPref, UserPrefs } from "@/lib/profile";

const FLAGS: {
  key: keyof Omit<
    UserPrefs,
    "extraAllergies" | "avatarId" | "photo" | "themeId" | "stickerId" | "sex" | "activity" | "pregnant"
  >;
  label: string;
}[] = [
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
      className="flex flex-col gap-3"
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

      <fieldset className="flex flex-col gap-2 rounded-2xl bg-sand/40 p-3">
        <legend className="px-1 text-sm font-semibold">{t("pref.nutrition")}</legend>
        <label className="text-sm">
          {t("pref.sex")}
          <select
            className="field mt-1"
            value={prefs.sex}
            onChange={(e) => setPrefs((p) => ({ ...p, sex: e.target.value as SexPref }))}
          >
            <option value="">{t("pref.sexUnset")}</option>
            <option value="female">{t("pref.sexFemale")}</option>
            <option value="male">{t("pref.sexMale")}</option>
            <option value="other">{t("pref.sexOther")}</option>
          </select>
        </label>
        <label className="text-sm">
          {t("pref.activity")}
          <select
            className="field mt-1"
            value={prefs.activity}
            onChange={(e) => setPrefs((p) => ({ ...p, activity: e.target.value as ActivityPref }))}
          >
            <option value="low">{t("pref.activityLow")}</option>
            <option value="moderate">{t("pref.activityMod")}</option>
            <option value="high">{t("pref.activityHigh")}</option>
          </select>
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={prefs.pregnant}
            onChange={(e) => setPrefs((p) => ({ ...p, pregnant: e.target.checked }))}
          />
          {t("pref.pregnant")}
        </label>
        <p className="text-[0.7rem] text-ink/50">{t("pref.nutritionHint")}</p>
      </fieldset>

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
