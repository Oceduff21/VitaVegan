"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import { deleteAccount } from "@/app/compte/actions";

export function DeleteAccountButton() {
  const { t } = useI18n();
  return (
    <form
      action={deleteAccount}
      onSubmit={(e) => {
        if (!window.confirm(t("account.deleteConfirm"))) e.preventDefault();
      }}
    >
      <button type="submit" className="min-h-12 w-full text-sm text-terracotta underline">
        {t("account.delete")}
      </button>
    </form>
  );
}
