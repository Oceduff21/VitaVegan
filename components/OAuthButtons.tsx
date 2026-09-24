"use client";

import { signIn } from "next-auth/react";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function OAuthButtons() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-2">
      <p className="text-center text-xs text-ink/50">{t("auth.orSocial")}</p>
      <button
        type="button"
        onClick={() => void signIn("google", { callbackUrl: "/dashboard" })}
        className="btn btn-secondary"
      >
        {t("auth.google")}
      </button>
      <button
        type="button"
        onClick={() => void signIn("apple", { callbackUrl: "/dashboard" })}
        className="btn btn-secondary"
      >
        {t("auth.apple")}
      </button>
      <p className="text-xs text-ink/45">{t("auth.oauthLater")}</p>
    </div>
  );
}
