"use client";

import { useId, useRef, useState } from "react";
import { compressImage, ocrLabel } from "@/lib/ocr";
import { IconScan } from "@/components/nav-icons";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function IngredientsLabelScan({
  onText,
}: {
  onText: (text: string) => void;
}) {
  const { t } = useI18n();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState("");
  const [empty, setEmpty] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    setEmpty(false);
    try {
      setPreview(await compressImage(file, 1400));
      const text = await ocrLabel(file);
      if (text) onText(text);
      else setEmpty(true);
    } catch {
      setEmpty(true);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <button
        type="button"
        className="btn btn-secondary self-start gap-2"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        <IconScan className="h-4 w-4" />
        {t("scan.scanLabel")}
      </button>
      <p className="text-xs text-ink/55">{t("scan.scanLabelHint")}</p>
      {busy ? <p className="anim-soft-pulse text-sm">{t("scan.ocrRun")}</p> : null}
      {empty ? <p className="text-sm text-terracotta">{t("scan.ocrEmpty")}</p> : null}
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="h-28 max-w-full rounded-xl object-cover" />
      ) : null}
    </div>
  );
}
