"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function HomeNotifications({
  items,
}: {
  items: { id: string; title: string; body: string; href: string; type: string }[];
}) {
  const { t } = useI18n();
  if (!items.length) return null;

  function label(n: { title: string; body: string; type: string }) {
    if (n.type === "share") {
      return t("notif.shareLine")
        .replace("{recipe}", n.title)
        .replace("{from}", n.body || t("notif.shareSomeone"));
    }
    if (n.title.includes(".")) return t(n.title);
    return n.title;
  }

  return (
    <div className="rounded-xl bg-sand/50 px-3 py-2">
      <p className="text-xs font-semibold text-ink/70">{t("notif.unread")}</p>
      <ul className="mt-1 flex flex-col gap-1">
        {items.slice(0, 3).map((n) => (
          <li key={n.id}>
            <Link href={n.href || "/compte"} className="text-sm text-forest underline">
              {label(n)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
