"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { IconFriends } from "@/components/nav-icons";

type Friend = { id: string; handle: string };

export function RecipeShareToFriend({
  recipeSlug,
  recipeTitle,
}: {
  recipeSlug: string;
  recipeTitle: string;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {
    const res = await fetch("/api/friends");
    if (!res.ok) {
      setFriends([]);
      return;
    }
    const json = (await res.json()) as { friends: Friend[] };
    setFriends(json.friends ?? []);
  }, []);

  useEffect(() => {
    if (open && friends === null) void loadFriends();
  }, [open, friends, loadFriends]);

  async function shareTo(handle: string) {
    setBusy(handle);
    setMsg(null);
    try {
      const res = await fetch("/api/recipe-share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeSlug, toHandle: handle }),
      });
      if (!res.ok) {
        setMsg(t("friends.fail"));
        return;
      }
      setMsg(t("recipe.share.sent").replace("{name}", handle));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="chip inline-flex items-center gap-1.5"
        aria-expanded={open}
        aria-controls="recipe-share-panel"
        onClick={() => {
          setMsg(null);
          setOpen((v) => !v);
        }}
      >
        <IconFriends className="h-4 w-4" />
        {t("recipe.share.cta")}
      </button>

      {open ? (
        <div
          id="recipe-share-panel"
          className="mt-2 rounded-2xl bg-white p-3 ring-1 ring-ink/10"
          role="dialog"
          aria-label={t("recipe.share.title")}
        >
          <p className="text-sm font-medium">{t("recipe.share.title")}</p>
          <p className="mt-0.5 text-xs text-ink/55 line-clamp-1">{recipeTitle}</p>

          {friends === null ? (
            <p className="mt-3 text-sm text-ink/55">…</p>
          ) : friends.length === 0 ? (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-ink/65">{t("recipe.share.noFriends")}</p>
              <Link href="/amis" className="btn btn-secondary w-full text-sm">
                {t("recipe.share.manageFriends")}
              </Link>
            </div>
          ) : (
            <ul className="mt-3 flex max-h-48 flex-col gap-1.5 overflow-y-auto">
              {friends.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    disabled={busy === f.handle}
                    className="btn btn-secondary flex w-full items-center justify-between text-left text-sm"
                    onClick={() => void shareTo(f.handle)}
                  >
                    <span>{f.handle}</span>
                    <span className="text-xs text-forest">
                      {busy === f.handle ? "…" : t("recipe.share.send")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {msg ? <p className="mt-2 text-sm text-forest">{msg}</p> : null}

          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/amis" className="text-xs font-semibold text-forest underline">
              {t("recipe.share.manageFriends")}
            </Link>
            <button
              type="button"
              className="text-xs font-semibold text-ink/45 underline"
              onClick={() => setOpen(false)}
            >
              {t("recipe.share.close")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
