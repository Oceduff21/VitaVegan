import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LANG_COOKIE } from "@/lib/i18n/cookie";

const LOCALES = new Set(["fr", "en", "de", "es", "it", "nl", "pt", "pl"]);

function localeFromAccept(header: string | null): string {
  if (!header) return "fr";
  for (const part of header.split(",")) {
    const code = part.trim().slice(0, 2).toLowerCase();
    if (LOCALES.has(code)) return code;
  }
  return "fr";
}

/** Set Verdegan-lang from Accept-Language on first visit (cookie wins thereafter). */
export function middleware(req: NextRequest) {
  if (req.cookies.get(LANG_COOKIE)?.value) {
    return NextResponse.next();
  }
  const locale = localeFromAccept(req.headers.get("accept-language"));
  const res = NextResponse.next();
  res.cookies.set(LANG_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api|.*\\..*).*)"],
};
