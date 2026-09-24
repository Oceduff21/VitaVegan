"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";

type FriendsPayload = {
  friends: { id: string; handle: string; since: string }[];
  pendingIn: { id: string; fromHandle: string; friendshipId: string }[];
  pendingOut: { id: string; toHandle: string; friendshipId: string }[];
};

export function FriendsClient() {
  const { t } = useI18n();
  const [data, setData] = useState<FriendsPayload | null>(null);
  const [handle, setHandle] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/friends");
    if (res.ok) setData((await res.json()) as FriendsPayload);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function requestFriend() {
    setMsg(null);
    const res = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "request", handle }),
    });
    setMsg(res.ok ? t("friends.sent") : t("friends.fail"));
    if (res.ok) {
      setHandle("");
      await load();
    }
  }

  async function respond(peerHandle: string, action: "accept" | "decline") {
    await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, handle: peerHandle.replace(/^@/, "") }),
    });
    await load();
  }

  return (
    <div className="flex max-w-lg flex-col gap-5">
      <section className="flex flex-col gap-2 rounded-2xl bg-white p-4 ring-1 ring-ink/8">
        <h2 className="text-lg">{t("friends.add")}</h2>
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder={t("friends.handlePh")}
          className="field"
        />
        <button type="button" className="btn btn-primary" onClick={() => void requestFriend()}>
          {t("friends.request")}
        </button>
      </section>

      {data?.pendingIn.length ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg">{t("friends.incoming")}</h2>
          <ul className="flex flex-col gap-2">
            {data.pendingIn.map((p) => (
              <li key={p.friendshipId} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-sand/50 px-3 py-2">
                <span>{p.fromHandle}</span>
                <span className="flex gap-2">
                  <button type="button" className="btn btn-primary text-sm" onClick={() => void respond(p.fromHandle, "accept")}>
                    {t("friends.accept")}
                  </button>
                  <button type="button" className="btn btn-secondary text-sm" onClick={() => void respond(p.fromHandle, "decline")}>
                    {t("friends.decline")}
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data?.pendingOut.length ? (
        <section>
          <h2 className="text-lg">{t("friends.outgoing")}</h2>
          <ul className="mt-2 text-sm text-ink/65">
            {data.pendingOut.map((p) => (
              <li key={p.friendshipId}>{p.toHandle}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="text-lg">{t("friends.list")}</h2>
        {data?.friends.length ? (
          <ul className="mt-2 flex flex-col gap-1">
            {data.friends.map((f) => (
              <li key={f.id} className="rounded-xl bg-white px-3 py-2 ring-1 ring-ink/8">
                {f.handle}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink/55">{t("friends.empty")}</p>
        )}
      </section>

      <p className="text-sm text-ink/55">{t("friends.shareHint")}</p>

      {msg ? <p className="text-sm text-forest">{msg}</p> : null}
    </div>
  );
}
