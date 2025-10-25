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

    const { signal, abort } = new AbortController();

    document.addEventListener("visibilitychange", handleVisibilityChange, {
      signal,
    });

    window.addEventListener("focus", handleWindowFocus, {
      signal,
    });
    window.addEventListener("blur", handleWindowBlur, {
      signal,
    });

    onCleanup(() => {
      abort();
    });
  });

  return { isAnimating };
};
