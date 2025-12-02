import { createSignal, onCleanup, onMount } from "solid-js";

export const useAnimationControl = () => {
  const [isAnimating, setIsAnimating] = createSignal(true);

  onMount(() => {
    const handleVisibilityChange = () => {
      setIsAnimating(!document.hidden);
    };

    const handleWindowFocus = () => {
      setIsAnimating(true);
    };

    const handleWindowBlur = () => {
      setIsAnimating(false);
    };

    const abortController = new AbortController();

    document.addEventListener("visibilitychange", handleVisibilityChange, {
      signal: abortController.signal,
    });

    window.addEventListener("focus", handleWindowFocus, {
      signal: abortController.signal,
    });
    window.addEventListener("blur", handleWindowBlur, {
      signal: abortController.signal,
    });

    onCleanup(() => {
      abortController.abort();
    });
  });

  return { isAnimating };
};
