"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ANIMAL_MASCOTS, FOOD_MASCOTS, MASCOTS, type MascotId } from "@/data/mascots";
import { MascotSvg, UserAvatar } from "@/components/avatars/UserAvatar";
import { compressImage } from "@/lib/ocr";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function AvatarPicker({
  avatarId,
  photo,
}: {
  avatarId: string;
  photo: string;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [id, setId] = useState(avatarId || "pip");
  const [pic, setPic] = useState(photo || "");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  async function save(nextId: string, nextPic: string) {
    setBusy(true);
    setOk(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarId: nextId, photo: nextPic, mergeAvatar: true }),
      });
      if (res.ok) {
        setOk(true);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  function pick(next: MascotId) {
    setId(next);
    setPic("");
    void save(next, "");
  }

  async function onPhoto(file: File) {
    setBusy(true);
    try {
      const data = await compressImage(file, 280);
      setPic(data);
      await save(id, data);
    } finally {
      setBusy(false);
    }
  }

  function Grid({ items }: { items: typeof MASCOTS }) {
    return (
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2 lg:grid-cols-8">
        {items.map((m) => {
          const on = !pic && id === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => pick(m.id)}
              className={`flex min-h-[5.5rem] flex-col items-center gap-1 rounded-xl p-1.5 sm:min-h-24 sm:p-2 ${on ? "ring-2 ring-forest bg-leaf/15" : "bg-sand/40"}`}
            >
              <span className="h-12 w-12 overflow-hidden rounded-full sm:h-16 sm:w-16">
                <MascotSvg id={m.id} />
              </span>
              <span className="line-clamp-2 text-center text-[0.65rem] font-medium leading-tight sm:text-xs">{t(m.nameKey)}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center gap-3">
        <UserAvatar avatarId={id} photo={pic} size={72} />
        <div>
          <h2 className="text-xl">{t("ava.title")}</h2>
          <p className="text-sm text-ink/70">{t("ava.lead")}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-ink/80">{t("ava.animals")}</h3>
        <Grid items={ANIMAL_MASCOTS} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-ink/80">{t("ava.foods")}</h3>
        <Grid items={FOOD_MASCOTS} />
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
