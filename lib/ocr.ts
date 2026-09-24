export async function compressImage(file: File, max = 900): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.72);
}

export async function ocrLabel(file: File): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("fra+eng");
  try {
    const { data } = await worker.recognize(file);
    return (data.text || "").replace(/\n{2,}/g, "\n").replace(/[ \t]+\n/g, "\n").trim();
  } finally {
    await worker.terminate();
  }
}
