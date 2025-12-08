import { createMemo, createSignal, onCleanup } from "solid-js";

interface UseSoundOptions {
  loop?: boolean;
  volume?: number;
}

export const useSound = (src: string, options: UseSoundOptions = {}) => {
  const { loop = false, volume = 1.0 } = options;
  const [isPaused, setIsPaused] = createSignal(false);

  const audio = createMemo(() => {
    const audioElement = new Audio(src);
    audioElement.loop = loop;
    audioElement.volume = Math.max(0, Math.min(1, volume));
    return audioElement;
  });

  onCleanup(() => {
    const audioElement = audio();
    audioElement.pause();
  });

  const play = () => {
    const audioElement = audio();
    audioElement.currentTime = 0;
    audioElement.play().catch((err) => {
      console.error("Audio play failed:", err);
    });
    setIsPaused(false);
  };

  const pause = () => {
    audio().pause();
    setIsPaused(true);
  };

  const stop = () => {
    const audioElement = audio();
    audioElement.pause();
    audioElement.currentTime = 0;
    setIsPaused(true);
  };

  return { play, pause, stop, isPaused };
};
