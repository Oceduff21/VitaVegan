"use client";

export function AdminActions({ id }: { id: string }) {
  async function act(action: "publish" | "reject") {
    await fetch("/api/admin/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    window.location.reload();
  }
  return (
    <div className="mt-2 flex gap-2">
      <button type="button" onClick={() => void act("publish")} className="rounded-full bg-leaf px-3 py-1 text-cream">
        Publier
      </button>
      <button type="button" onClick={() => void act("reject")} className="rounded-full border border-terracotta px-3 py-1">
        Refuser
      </button>
    </div>
  );
}
