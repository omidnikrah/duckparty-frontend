import { createSignal, onCleanup, onMount, Show } from "solid-js";

export const MobileOverlay = () => {
  const [isMobile, setIsMobile] = createSignal(false);

  const checkIfMobile = () => {
    const isMobileDevice =
      window.innerWidth < 768 ||
      (window.matchMedia("(pointer: coarse)").matches &&
        window.innerWidth < 1024);

    setIsMobile(isMobileDevice);
  };

  onMount(() => {
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    onCleanup(() => {
      window.removeEventListener("resize", checkIfMobile);
    });
  });

  return (
    <Show when={isMobile()}>
      <div class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-primary)_0%,var(--color-primary-700)_100%)] p-8">
        <div class="flex flex-col items-center justify-center gap-8">
          <div class="relative">
            <img
              src="/body.png"
              alt="Duck"
              class="w-[400px] max-w-[80vw] animate-[duck-float_2s_ease-in-out_infinite]"
            />
          </div>
          <div class="flex flex-col items-center gap-4 text-center">
            <h2 class="text-3xl text-white md:text-4xl">Use Desktop Version</h2>
            <p class="max-w-md font-family-carter text-lg text-white/90 md:text-xl">
              For the best experience, please visit DuckParty on a desktop
              device.
            </p>
          </div>
        </div>
      </div>
    </Show>
  );
};
