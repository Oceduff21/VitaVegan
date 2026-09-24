"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";
import type { Reminder } from "@/lib/reminders";

export function ReminderBanners({ items }: { items: Reminder[] }) {
  const { t } = useI18n();
  if (!items.length) return null;
  return (
    <ul className="flex flex-col gap-2">
      {items.map((r) => (
        <li
          key={r.id}
          className={`rounded-2xl px-4 py-3 text-sm ${r.tone === "warn" ? "bg-terracotta/15 text-terracotta" : "bg-leaf/10"}`}
        >
          {t(r.textKey)}{" "}
          {r.href ? (
            <Link href={r.href} className="underline">
              →
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
