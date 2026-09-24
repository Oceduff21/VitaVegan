"use client";

import { useEffect, useRef, useState } from "react";
import { killAllCameras, requestCameraStream, setTorch, torchSupported } from "@/lib/camera";
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
  onReady,
  liveLabel,
  closeLabel,
  flashOnLabel,
  flashOffLabel,
  flashUnavailable,
}: {
  onCode: (value: string) => void;
  onStop: () => void;
  onDenied: () => void;
  onReady?: () => void;
  liveLabel: string;
  closeLabel: string;
  flashOnLabel: string;
  flashOffLabel: string;
  flashUnavailable: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number>(0);
  const busyRef = useRef(false);
  const onCodeRef = useRef(onCode);
  const onStopRef = useRef(onStop);
  const onDeniedRef = useRef(onDenied);
  const onReadyRef = useRef(onReady);
  const [torchOn, setTorchOn] = useState(false);
  const [torchOk, setTorchOk] = useState(false);
  onCodeRef.current = onCode;
  onStopRef.current = onStop;
  onDeniedRef.current = onDenied;
  onReadyRef.current = onReady;

  useEffect(() => {
    let cancelled = false;

    function shutdown() {
      cancelled = true;
      window.clearTimeout(timerRef.current);
      void setTorch(streamRef.current, false);
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
      setTorchOn(false);
      setTorchOk(false);
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
        onReadyRef.current?.();
        setTorchOk(torchSupported(stream));

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        shutdown();
        onStopRef.current();
      }
    };

    document.addEventListener("visibilitychange", hide);
    window.addEventListener("pagehide", hide);
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      shutdown();
    };
  }, []);

  return (
    <div className="scan-cam-overlay" role="dialog" aria-modal="true" aria-label={liveLabel}>
      <button
        type="button"
        className={`scan-cam-flash${torchOn ? " is-on" : ""}`}
        aria-pressed={torchOn}
        aria-label={torchOk ? (torchOn ? flashOffLabel : flashOnLabel) : flashUnavailable}
        title={torchOk ? (torchOn ? flashOffLabel : flashOnLabel) : flashUnavailable}
        disabled={!torchOk}
        onClick={() => {
          const next = !torchOn;
          void setTorch(streamRef.current, next).then((ok) => {
            if (ok) setTorchOn(next);
          });
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path
            d="M13 2 4 14h7l-1 8 10-13h-7l1-7z"
            fill={torchOn ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className="scan-cam-close"
        aria-label={closeLabel}
        onClick={() => {
          void setTorch(streamRef.current, false);
          killAllCameras();
          onStop();
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path
            d="M6 6l12 12M18 6L6 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <p className="scan-cam-hint">{liveLabel}</p>
      <video ref={videoRef} className="scan-cam-video" autoPlay muted playsInline />
      <div id="qr-fallback" className="hidden" />
    </div>
  );
}
