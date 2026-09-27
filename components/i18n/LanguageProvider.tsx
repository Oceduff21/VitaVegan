"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isLocale, translate, type Locale } from "@/lib/i18n/dictionaries";
import { LANG_COOKIE } from "@/lib/i18n/cookie";

const STORAGE = "verdegan-lang";

type I18n = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const Ctx = createContext<I18n>({
  locale: "fr",
  setLocale: () => undefined,
  t: (k) => translate("fr", k),
});

function persist(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE, locale);
  } catch {
    /* private mode */
  }
  document.cookie = `${LANG_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
  document.documentElement.lang = locale;
}

export function LanguageProvider({
  children,
  initialLocale = "fr",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    setLocaleState(initialLocale);
    document.documentElement.lang = initialLocale;
    try {
      window.localStorage.setItem(STORAGE, initialLocale);
    } catch {
      /* private mode */
    }
  }, [initialLocale]);

  const value = useMemo<I18n>(
    () => ({
      locale,
      setLocale: (l) => {
        if (!isLocale(l)) return;
        persist(l);
        setLocaleState(l);
      },
      t: (key) => translate(locale, key),
    }),
    [locale],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
