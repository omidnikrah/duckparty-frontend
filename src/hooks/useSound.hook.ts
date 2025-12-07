import { createMemo, onCleanup } from "solid-js";

export const useSound = (src: string) => {
  const audio = createMemo(() => new Audio(src));

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
  };

  const pause = () => {
    audio().pause();
  };

  const stop = () => {
    const audioElement = audio();
    audioElement.pause();
    audioElement.currentTime = 0;
  };

  return { play, pause, stop };
};
