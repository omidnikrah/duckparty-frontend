import { useNavigate } from "@solidjs/router";
import clsx from "clsx";
import { createEffect, onMount } from "solid-js";
import { getGetUserQueryKey } from "@/api/generated/endpoints";
import { queryClient } from "@/api/query-client";
import LeftArrowIcon from "@/assets/left-arrow.svg";
import { LoginForm } from "@/components";
import { getUserData, startViewTransition } from "@/helpers";

export default function SetEmail() {
  const navigate = useNavigate();
  const authenticatedUser = getUserData();
  const circleCommonClasses =
    "-translate-x-1/2 -translate-y-1/2 absolute inset-0 top-1/2 left-1/2 z-10 flex flex-col items-center justify-center overflow-hidden rounded-full";
  const circleExpandedClasses =
    "h-[max(calc(100dvw-5dvh),1200px)] w-[max(calc(100dvw-5dvh),1200px)]";

  onMount(() => {
    document.body.style.backgroundColor = "var(--color-primary)";
  });

  const handleNavigateToParty = () => {
    navigate("/party", { replace: true });
  };

  const handleOnSetEmailSuccess = () => {
    queryClient
      .invalidateQueries({ queryKey: getGetUserQueryKey() })
      .then(() => {
        handleNavigateToParty();
      });
  };

  createEffect(() => {
    if (authenticatedUser?.email) {
      handleNavigateToParty();
    }
  });

  return (
    <div class="relative flex h-full w-full shrink-0 scale-fade-in-enter items-start justify-center bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-primary)_0%,var(--color-primary-700)_100%)] pt-[50dvh] after:pointer-events-none after:absolute after:inset-0 after:bg-[length:60vh] after:bg-[url('/bg-pattern.png')] after:bg-center after:bg-repeat after:opacity-5 after:content-['']">
      <h3 class="fixed top-30 z-100 text-center text-5xl text-primary">
        Set your email
      </h3>

      <div
        class={clsx(
          circleCommonClasses,
          circleExpandedClasses,
          "circle-container h-[75dvh] w-[75dvh] bg-white",
        )}
      >
        <div class="absolute bottom-[80px] z-10 flex h-[calc(100dvh-200px)] w-[80dvh] flex-col items-center justify-start justify-center gap-20">
          <p class="text-center text-purple-700 text-xl">
            Your duck wants a forever home. <br />
            Enter your email to save this duck, edit it later, and create more
            ducks.
          </p>
          <LoginForm
            mode="set-email"
            class="relative gap-10"
            onLoginSuccess={handleOnSetEmailSuccess}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          startViewTransition(() => {
            navigate(-1);
          });
        }}
        class="fixed top-6 left-6 flex h-14 w-14 items-center justify-center rounded-full bg-white p-4 text-purple-700 text-purple-700 opacity-50 shadow-lg transition-all duration-300 hover:scale-110 hover:opacity-100 hover:shadow-xl"
      >
        <LeftArrowIcon />
      </button>
    </div>
  );
}
