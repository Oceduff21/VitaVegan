"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  isLocale,
  localeFromBrowser,
  translate,
  type Locale,
} from "@/lib/i18n/dictionaries";

const STORAGE = "vitavegan-lang";

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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE);
    const next = isLocale(stored) ? stored : localeFromBrowser();
    setLocaleState(next);
    document.documentElement.lang = next;
  }, []);

  const value = useMemo<I18n>(
    () => ({
      locale,
      setLocale: (l) => {
        setLocaleState(l);
        window.localStorage.setItem(STORAGE, l);
        document.documentElement.lang = l;
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
