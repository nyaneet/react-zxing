import { useCallback, useEffect, useRef, useState } from "react";

interface UseTorchOptions {
  resetStream: () => void;
}

export const useTorch = ({ resetStream }: UseTorchOptions) => {
  const [isOn, setIsOn] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const resetStreamRef = useRef(resetStream);

  const init = useCallback((videoTrack: MediaStreamTrack) => {
    videoTrackRef.current = videoTrack;
    setIsAvailable(
      typeof videoTrack.getCapabilities === "function"
        ? (videoTrack.getCapabilities() as any).torch !== undefined
        : false
    );
  }, []);

  const on = useCallback(async () => {
    if (!videoTrackRef.current || !isAvailable) return;
    await videoTrackRef.current.applyConstraints({
      advanced: [{ torch: true } as any],
    });
    setIsOn(true);
  }, [isAvailable]);

  const off = useCallback(async () => {
    if (!videoTrackRef.current || !isAvailable) return;
    await videoTrackRef.current.applyConstraints({
      advanced: [{ torch: false } as any],
    });
    setIsOn(false);
  }, [isAvailable]);

  useEffect(() => {
    resetStreamRef.current = resetStream;
  }, [resetStream]);

  return { init, isOn, isAvailable, on, off };
};
