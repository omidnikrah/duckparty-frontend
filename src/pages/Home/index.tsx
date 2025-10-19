import clsx from "clsx";
import { createSignal } from "solid-js";
import { WelcomeScreen } from "@/components";
import { AppearanceSelectorScreen } from "@/components/AppearanceSelectorScreen";

export default function Home() {
  const [isCreatingOwnDuck, setIsCreatingOwnDuck] = createSignal(false);
  const circleCommonClasses =
    "-translate-x-1/2 -translate-y-1/2 absolute inset-0 top-1/2 left-1/2 z-10 flex flex-col items-center justify-center overflow-hidden rounded-full";
  const circleExpandedClasses =
    "h-[max(calc(100dvw-5dvh),1200px)] w-[max(calc(100dvw-5dvh),1200px)]";

  const createOwnDuck = () => {
    setIsCreatingOwnDuck(true);
  };

  return (
    <div class="relative flex h-full w-full shrink-0 items-start justify-center bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-primary)_0%,var(--color-primary-700)_100%)] pt-[50dvh] after:pointer-events-none after:absolute after:inset-0 after:bg-[length:60vh] after:bg-[url('/bg-pattern.png')] after:bg-center after:bg-repeat after:opacity-5 after:content-['']">
      <img src="/body.png" alt="body" class="fixed top-0 z-12 w-[50dvh]" />
      <div
        class={clsx(
          circleCommonClasses,
          "h-[75dvh] w-[75dvh] bg-white shadow-[0_0_45px_20px_rgba(0,0,0,0.05)] transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)]",
          {
            [circleExpandedClasses]: isCreatingOwnDuck(),
          },
        )}
      />
      <div class={clsx(circleCommonClasses, circleExpandedClasses)}>
        <div class="relative z-10 w-[75dvh]">
          <WelcomeScreen
            visible={!isCreatingOwnDuck()}
            onCreateClick={createOwnDuck}
          />
          <AppearanceSelectorScreen visible={isCreatingOwnDuck()} />
        </div>
      </div>
    </div>
  );
}
