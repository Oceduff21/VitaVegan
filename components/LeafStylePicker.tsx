"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/LanguageProvider";
import {
  FOOD_AVATAR_MIN,
  LEAF_STICKERS,
  LEAF_THEMES,
  avatarUnlocked,
  foodAvatarCost,
  resolveLeafLevel,
  stickerUnlocked,
  themeUnlocked,
} from "@/lib/leaf-rewards";
import { ANIMAL_MASCOTS, FOOD_MASCOTS, type MascotId } from "@/data/mascots";
import { MascotSvg, UserAvatar } from "@/components/avatars/UserAvatar";
import { compressImage } from "@/lib/ocr";

export function LeafStylePicker({
  leafPoints,
  avatarId,
  photo,
  themeId,
  stickerId,
  purchasedThemes,
}: {
  leafPoints: number;
  avatarId: string;
  photo: string;
  themeId: string;
  stickerId: string;
  purchasedThemes?: string[];
}) {
  const themesOwned = purchasedThemes ?? [];
  const { t } = useI18n();
  const router = useRouter();
  const [id, setId] = useState(avatarId || "pip");
  const [pic, setPic] = useState(photo || "");
  const [theme, setTheme] = useState(themeId || "default");
  const [sticker, setSticker] = useState(stickerId || "none");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const level = resolveLeafLevel(leafPoints);

  async function save(next: {
    avatarId?: string;
    photo?: string;
    themeId?: string;
    stickerId?: string;
  }) {
    setBusy(true);
    setOk(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mergeAvatar: true,
          avatarId: next.avatarId ?? id,
          photo: next.photo ?? pic,
          themeId: next.themeId ?? theme,
          stickerId: next.stickerId ?? sticker,
        }),
      });
      if (res.ok) {
        const json = (await res.json()) as {
          prefs?: { themeId?: string; stickerId?: string; avatarId?: string; photo?: string };
        };
        if (json.prefs?.themeId) setTheme(json.prefs.themeId);
        if (json.prefs?.stickerId) setSticker(json.prefs.stickerId);
        if (json.prefs?.avatarId) setId(json.prefs.avatarId);
        if (typeof json.prefs?.photo === "string") setPic(json.prefs.photo);
        const applied = json.prefs?.themeId ?? next.themeId ?? theme;
        if (applied === "default") document.documentElement.removeAttribute("data-theme");
        else document.documentElement.setAttribute("data-theme", applied);
        setOk(true);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  function pickAvatar(next: MascotId) {
    if (!avatarUnlocked(next, leafPoints)) return;
    setId(next);
    setPic("");
    void save({ avatarId: next, photo: "" });
  }

  function pickTheme(next: string) {
    if (!themeUnlocked(next, leafPoints, themesOwned)) return;
    setTheme(next);
    void save({ themeId: next });
  }

  function pickSticker(next: string) {
    if (!stickerUnlocked(next, leafPoints)) return;
    setSticker(next);
    void save({ stickerId: next });
  }

  async function onPhoto(file: File) {
    setBusy(true);
    try {
      const data = await compressImage(file, 280);
      setPic(data);
      await save({ photo: data });
    } finally {
      setBusy(false);
    }
  }

  function AvatarGrid({ items }: { items: typeof ANIMAL_MASCOTS }) {
    return (
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2 lg:grid-cols-8">
        {items.map((m) => {
          const locked = !avatarUnlocked(m.id, leafPoints);
          const on = !pic && id === m.id;
          return (
            <button
              key={m.id}
              type="button"
              disabled={locked || busy}
              onClick={() => pickAvatar(m.id)}
              className={`relative flex min-h-[5.5rem] flex-col items-center gap-1 rounded-xl p-1.5 disabled:opacity-55 sm:min-h-24 sm:p-2 ${
                on ? "bg-leaf/15 ring-2 ring-forest" : "bg-sand/40"
              }`}
            >
              <span className="h-12 w-12 overflow-hidden rounded-full sm:h-16 sm:w-16">
                <MascotSvg id={m.id} />
              </span>
              <span className="line-clamp-2 text-center text-[0.65rem] font-medium leading-tight sm:text-xs">{t(m.nameKey)}</span>
              {locked ? (
                <span className="absolute right-1 top-1 rounded-full bg-ink/80 px-1.5 py-0.5 text-[0.6rem] text-cream">
                  {foodAvatarCost(m.id)}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center gap-3">
        <UserAvatar avatarId={id} photo={pic} stickerId={sticker} size={72} />
        <div>
          <h2 className="text-xl">{t("leaf.styleTitle")}</h2>
          <p className="text-sm text-forest">{t(level.current.titleKey)}</p>
          <p className="text-sm text-ink/70">
            {t("leaf.balance").replace("{n}", String(leafPoints))}
            {level.next
              ? ` · ${t("leaf.nextLevel")
                  .replace("{title}", t(level.next.titleKey))
                  .replace("{n}", String(level.next.min - leafPoints))}`
              : ` · ${t("leaf.maxLevel")}`}
          </p>
          <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full bg-forest" style={{ width: `${Math.round(level.progress * 100)}%` }} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink/80">{t("leaf.levelsTitle")}</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {(["seed", "cook", "chef", "guardian"] as const).map((lid) => {
            const L = { seed: 0, cook: 100, chef: 500, guardian: 1000 }[lid];
            const unlocked = leafPoints >= L;
            return (
              <li
                key={lid}
                className={`rounded-xl px-3 py-2 text-sm ${unlocked ? "bg-leaf/15 text-forest" : "bg-sand/40 text-ink/45"}`}
              >
                <span className="font-medium">{t(`leaf.level.${lid}`)}</span>
                <span className="ml-2 text-xs">{L} pts</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-ink/80">{t("ava.animals")}</h3>
        <AvatarGrid items={ANIMAL_MASCOTS} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-ink/80">{t("ava.foods")}</h3>
        <p className="text-xs text-ink/55">{t("leaf.foodLock").replace("{n}", String(FOOD_AVATAR_MIN))}</p>
        <AvatarGrid items={FOOD_MASCOTS} />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-ink/80">{t("leaf.themesTitle")}</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LEAF_THEMES.map((th) => {
            const locked = !themeUnlocked(th.id, leafPoints, themesOwned);
            const on = theme === th.id;
            return (
              <button
                key={th.id}
                type="button"
                disabled={locked || busy}
                onClick={() => pickTheme(th.id)}
                className={`flex flex-col gap-1 rounded-xl p-3 text-left disabled:opacity-55 ${
                  on ? "ring-2 ring-forest bg-leaf/12" : "bg-sand/40"
                }`}
              >
                <span className="h-8 w-full rounded-lg" style={{ background: th.swatch }} />
                <span className="text-sm font-medium">{t(th.nameKey)}</span>
                {locked ? <span className="text-[0.65rem] text-ink/50">{th.min} pts</span> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-ink/80">{t("leaf.stickersTitle")}</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {LEAF_STICKERS.map((s) => {
            const locked = !stickerUnlocked(s.id, leafPoints);
            const on = sticker === s.id;
            return (
              <button
                key={s.id}
                type="button"
                disabled={locked || busy}
                onClick={() => pickSticker(s.id)}
                className={`flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-xl p-2 disabled:opacity-55 ${
                  on ? "ring-2 ring-forest bg-leaf/12" : "bg-sand/40"
                }`}
              >
                <span className="text-lg" aria-hidden>
                  {s.id === "none" ? "—" : s.glyph}
                </span>
                <span className="text-center text-[0.65rem] font-medium leading-tight">{t(s.nameKey)}</span>
                {locked ? <span className="text-[0.6rem] text-ink/45">{s.min}</span> : null}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex min-h-12 cursor-pointer flex-col gap-1 rounded-xl border border-dashed border-ink/20 bg-sand/30 px-4 py-3">
        <span className="text-sm font-medium">{t("ava.photo")}</span>
        <input
          type="file"
          accept="image/*"
          className="text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onPhoto(file);
          }}
        />
      </label>
      {busy ? <p className="anim-soft-pulse text-sm">{t("ava.saving")}</p> : null}
      {ok ? <p className="text-sm text-forest">{t("ava.saved")}</p> : null}
    </section>
  );
}
