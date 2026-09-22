"use client";

import { useEffect, useRef } from "react";
import { killAllCameras, requestCameraStream } from "@/lib/camera";

type BarcodeDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]>;
};

function getDetector(): BarcodeDetectorLike | null {
  const Ctor = (window as unknown as { BarcodeDetector?: new (opts: { formats: string[] }) => BarcodeDetectorLike }).BarcodeDetector;
  if (!Ctor) return null;
  try {
    return new Ctor({
      formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "itf", "qr_code"],
    });
  } catch {
    return null;
  }
}

async function decodeFrame(video: HTMLVideoElement): Promise<string | null> {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx || canvas.width < 20) return null;
  ctx.drawImage(video, 0, 0);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.7));
  if (!blob) return null;
  const file = new File([blob], "frame.jpg", { type: "image/jpeg" });
  const { Html5Qrcode } = await import("html5-qrcode");
  const qr = new Html5Qrcode("qr-fallback", { verbose: false });
  try {
    const text = await qr.scanFile(file, false);
    return text?.trim() || null;
  } catch {
    return null;
  } finally {
    try {
      qr.clear();
    } catch {
      /* ignore */
    }
  }
}

export function CameraScanner({
  onCode,
  onStop,
  onDenied,
  liveLabel,
  stopLabel,
}: {
  onCode: (value: string) => void;
  onStop: () => void;
  onDenied: () => void;
  liveLabel: string;
  stopLabel: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number>(0);
  const busyRef = useRef(false);
  const onCodeRef = useRef(onCode);
  const onStopRef = useRef(onStop);
  const onDeniedRef = useRef(onDenied);
  onCodeRef.current = onCode;
  onStopRef.current = onStop;
  onDeniedRef.current = onDenied;

  useEffect(() => {
    let cancelled = false;

    function shutdown() {
      cancelled = true;
      window.clearTimeout(timerRef.current);
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.srcObject = null;
      }
      streamRef.current?.getTracks().forEach((t) => {
        t.stop();
        t.enabled = false;
      });
      streamRef.current = null;
      killAllCameras();
    }

    async function run() {
      try {
        const stream = await requestCameraStream();
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        video.muted = true;
        video.setAttribute("playsinline", "true");
        await video.play();

        const detector = getDetector();
        const tick = async () => {
          if (cancelled || busyRef.current) return;
          const el = videoRef.current;
          if (el && el.readyState >= 2) {
            let value: string | null = null;
            if (detector) {
              try {
                const codes = await detector.detect(el);
                value = codes[0]?.rawValue?.trim() ?? null;
              } catch {
                value = null;
              }
            } else {
              value = await decodeFrame(el);
            }
            if (value) {
              busyRef.current = true;
              shutdown();
              onCodeRef.current(value);
              return;
            }
          }
          timerRef.current = window.setTimeout(() => void tick(), detector ? 160 : 400);
        };
        void tick();
      } catch (err) {
        const name = err instanceof DOMException ? err.name : "";
        shutdown();
        if (name === "NotAllowedError" || name === "PermissionDeniedError") onDeniedRef.current();
        else onStopRef.current();
      }
    }

    void run();

    const hide = () => {
      if (document.visibilityState === "hidden") {
        shutdown();
        onStopRef.current();
      }
    };
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("pagehide", hide);

    return () => {
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("pagehide", hide);
      shutdown();
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-leaf">{liveLabel}</p>
      <video ref={videoRef} className="w-full max-w-md rounded-2xl bg-ink" autoPlay muted playsInline />
      <div id="qr-fallback" className="hidden" />
      <button
        type="button"
        onClick={() => {
          killAllCameras();
          onStop();
        }}
        className="self-start rounded-full bg-terracotta px-4 py-2 text-cream"
      >
        {stopLabel}
      </button>
    </div>
  );
}
