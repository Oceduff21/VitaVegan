import { cookies } from "next/headers";
import { isLocale, translate, type Locale } from "@/lib/i18n/dictionaries";
import { LANG_COOKIE } from "@/lib/i18n/cookie";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLocale(value) ? value : "fr";
}

export async function getT() {
  const locale = await getLocale();
  return {
    locale,
    t: (key: string) => translate(locale, key),
  };
}
