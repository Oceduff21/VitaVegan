let activeStream: MediaStream | null = null;

function stopTracks(stream: MediaStream | null) {
  if (!stream) return;
  for (const track of stream.getTracks()) {
    try {
      track.stop();
    } catch {
      /* ignore */
    }
    track.enabled = false;
  }
}

function detachVideo(video: HTMLVideoElement | null) {
  if (!video) return;
  try {
    video.pause();
  } catch {
    /* ignore */
  }
  const attached = video.srcObject as MediaStream | null;
  stopTracks(attached);
  video.srcObject = null;
  video.removeAttribute("src");
  try {
    video.load();
  } catch {
    /* ignore */
  }
}

export function killAllCameras() {
  stopTracks(activeStream);
  activeStream = null;
  if (typeof document === "undefined") return;
  document.querySelectorAll("video").forEach((node) => detachVideo(node as HTMLVideoElement));
}

export function setActiveCameraStream(stream: MediaStream | null) {
  if (activeStream && activeStream !== stream) stopTracks(activeStream);
  activeStream = stream;
}

export async function requestCameraStream(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("unsupported");
  }
  killAllCameras();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  });
  setActiveCameraStream(stream);
  return stream;
}

export async function cameraPermissionState(): Promise<PermissionState | "unknown"> {
  try {
    const status = await navigator.permissions.query({ name: "camera" as PermissionName });
    return status.state;
  } catch {
    return "unknown";
  }
}

type TorchTrack = MediaStreamTrack & {
  getCapabilities?: () => { torch?: boolean };
};

function videoTrack(stream: MediaStream | null): TorchTrack | null {
  return (stream?.getVideoTracks()[0] as TorchTrack | undefined) ?? null;
}

export function torchSupported(stream: MediaStream | null): boolean {
  const track = videoTrack(stream);
  if (!track?.getCapabilities) return false;
  try {
    return Boolean(track.getCapabilities().torch);
  } catch {
    return false;
  }
}

export async function setTorch(stream: MediaStream | null, on: boolean): Promise<boolean> {
  const track = videoTrack(stream);
  if (!track) return false;
  try {
    await track.applyConstraints({
      advanced: [{ torch: on } as MediaTrackConstraintSet],
    });
    return true;
  } catch {
    try {
      await track.applyConstraints({ torch: on } as MediaTrackConstraints);
      return true;
    } catch {
      return false;
    }
  }
}

