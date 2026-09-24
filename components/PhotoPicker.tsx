"use client";

import { useId, useState } from "react";
import { compressImage } from "@/lib/ocr";

export function PhotoPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
}) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <input
        id={inputId}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          try {
            onChange(await compressImage(file));
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
      <label htmlFor={inputId} className={`btn btn-secondary self-start cursor-pointer ${busy ? "pointer-events-none opacity-60" : ""}`}>
        {label}
      </label>
      {busy ? <span className="text-xs text-ink/50">…</span> : null}
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-28 w-full rounded-xl object-cover" />
      ) : null}
    </div>
  );
}
