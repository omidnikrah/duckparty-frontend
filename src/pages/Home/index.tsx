import { useNavigate } from "@solidjs/router";
import clsx from "clsx";
import { createSignal, Show } from "solid-js";
import { CreateDuckFormSection, Duck, WelcomeScreen } from "@/components";
import { AppearanceSelectorScreen } from "@/components/AppearanceSelectorScreen";

export default function Home() {
  const [isCreatingOwnDuck, setIsCreatingOwnDuck] = createSignal(false);
  const [isChoosingName, setIsChoosingName] = createSignal(false);
  const [isLoadingParty, setIsLoadingParty] = createSignal(false);
  const navigate = useNavigate();
  const circleCommonClasses =
    "-translate-x-1/2 -translate-y-1/2 absolute inset-0 top-1/2 left-1/2 z-10 flex flex-col items-center justify-center overflow-hidden rounded-full";
  const circleExpandedClasses =
    "h-[max(calc(100dvw-5dvh),1200px)] w-[max(calc(100dvw-5dvh),1200px)]";
  const circleLoadPartyClasses = "h-[200dvh] w-[200dvh]";

  const createOwnDuck = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setIsCreatingOwnDuck(true);
      });
    } else {
      setIsCreatingOwnDuck(true);
    }
  };

  const handleOnChangeStyleClick = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setIsChoosingName(false);
      });
    } else {
      setIsChoosingName(false);
    }
  };

  const handleOnChooseNameClick = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setIsChoosingName(true);
      });
    } else {
      setIsChoosingName(true);
    }
  };

  const handleOnDuckCreated = () => {
    setIsLoadingParty(true);

    setTimeout(() => {
      navigate("/party", { replace: true });
    }, 1000);
  };

  return (
    <div class="relative flex h-full w-full shrink-0 items-start justify-center bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-primary)_0%,var(--color-primary-700)_100%)] pt-[50dvh] after:pointer-events-none after:absolute after:inset-0 after:bg-[length:60vh] after:bg-[url('/bg-pattern.png')] after:bg-center after:bg-repeat after:opacity-5 after:content-['']">
      <Duck />
      <div
        class={clsx(
          circleCommonClasses,
          {
            [circleExpandedClasses]: isCreatingOwnDuck() && !isLoadingParty(),
            [circleLoadPartyClasses]: isLoadingParty(),
          },
          "circle-container h-[75dvh] w-[75dvh] bg-white",
        )}
      >
        <div class="relative z-10 w-[75dvh]">
          <Show
            when={!isChoosingName()}
            fallback={
              <CreateDuckFormSection
                onChangeStyleClick={handleOnChangeStyleClick}
                onDuckCreated={handleOnDuckCreated}
              />
            }
          >
            <Show
              when={!isCreatingOwnDuck()}
              fallback={
                <AppearanceSelectorScreen
                  onChooseNameClick={handleOnChooseNameClick}
                />
              }
            >
              <WelcomeScreen onCreateClick={createOwnDuck} />
            </Show>
          </Show>
        </div>
      </div>
    </div>
  );
}
