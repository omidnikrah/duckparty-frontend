import { useNavigate } from "@solidjs/router";
import clsx from "clsx";
import { createSignal, onMount, Show } from "solid-js";
import {
  CreateDuckFormSection,
  Duck,
  GithubStarButton,
  LoginForm,
  WelcomeScreen,
} from "@/components";
import { AppearanceSelectorScreen } from "@/components/AppearanceSelectorScreen";
import { getUserData, isUserLoggedIn, startViewTransition } from "@/helpers";
import { useSound } from "@/hooks";

export default function Home() {
  const [isCreatingOwnDuck, setIsCreatingOwnDuck] = createSignal(false);
  const [isDirectLogin, setIsDirectLogin] = createSignal(false);
  const [isChoosingName, setIsChoosingName] = createSignal(false);
  const [isLoadingParty, setIsLoadingParty] = createSignal(false);
  const navigate = useNavigate();
  const isLoggedIn = isUserLoggedIn();
  const authenticatedUser = getUserData();
  const { play: playStartSound } = useSound("/sounds/start.mp3");

  const circleCommonClasses =
    "-translate-x-1/2 -translate-y-1/2 absolute inset-0 top-1/2 left-1/2 z-10 flex flex-col items-center justify-center overflow-hidden rounded-full";
  const circleExpandedClasses =
    "h-[max(calc(100dvw-5dvh),1200px)] w-[max(calc(100dvw-5dvh),1200px)]";
  const circleLoadPartyClasses =
    "h-[300dvh] w-[300dvh] transition-width transition-height duration-700 [&>*]:opacity-0 [&>*]:transition-opacity [&>*]:duration-300 duration-700 bg-[url('/yard-pattern.jpg')] bg-top-left bg-repeat bg-size-[30%] bg-fixed";

  onMount(() => {
    document.body.style.backgroundColor = "var(--color-primary)";
  });

  const createOwnDuck = () => {
    playStartSound();
    startViewTransition(() => {
      setIsCreatingOwnDuck(true);
    });
  };

  const handleOnChangeStyleClick = () => {
    startViewTransition(() => {
      setIsChoosingName(false);
    });
  };

  const handleOnChooseNameClick = () => {
    startViewTransition(() => {
      setIsChoosingName(true);
    });
  };

  const handleOnDuckCreated = () => {
    setIsLoadingParty(true);

    document.body.style.backgroundColor = "var(--color-yard-green)";
    startViewTransition(() => {
      setTimeout(() => {
        navigate("/party", { replace: true });
      }, 200);
    });
  };

  const handleOnManageClick = () => {
    if (isLoggedIn) {
      navigate(`/creator/${authenticatedUser?.ID}/ducks`, { replace: true });
      return;
    }

    startViewTransition(() => {
      setIsDirectLogin(true);
    });
  };

  const handleOnLoginSuccess = (userData: { ID?: string | number }) => {
    if (userData?.ID) {
      navigate(`/creator/${userData.ID}/ducks`, { replace: true });
    }
  };

  return (
    <div class="relative flex h-full w-full shrink-0 scale-fade-in-enter items-start justify-center bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-primary)_0%,var(--color-primary-700)_100%)] pt-[50dvh] after:pointer-events-none after:absolute after:inset-0 after:bg-[url('/bg-pattern.png')] after:bg-center after:bg-size-[60vh] after:bg-repeat after:opacity-5 after:content-['']">
      <GithubStarButton class="absolute top-4 right-4" />
      <Duck isVisible={!isLoadingParty()} />
      <div
        class={clsx(
          circleCommonClasses,
          {
            [circleExpandedClasses]:
              (isCreatingOwnDuck() || isDirectLogin()) && !isLoadingParty(),
            [circleLoadPartyClasses]: isLoadingParty(),
          },
          "circle-container group h-[75dvh] w-[75dvh] bg-white",
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
            <Show when={!isDirectLogin()}>
              <Show
                when={!isCreatingOwnDuck()}
                fallback={
                  <AppearanceSelectorScreen
                    onChooseNameClick={handleOnChooseNameClick}
                  />
                }
              >
                <WelcomeScreen
                  onCreateClick={createOwnDuck}
                  onManageClick={handleOnManageClick}
                />
              </Show>
            </Show>
            <Show when={isDirectLogin()}>
              <LoginForm onLoginSuccess={handleOnLoginSuccess} />
            </Show>
          </Show>
        </div>
      </div>
    </div>
  );
}
