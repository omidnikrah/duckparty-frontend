import { useNavigate, useParams } from "@solidjs/router";
import clsx from "clsx";
import { createMemo, For, onMount, Show } from "solid-js";
import { useGetUserUserIdDucks } from "@/api/generated/endpoints";
import DuckOutline from "@/assets/duck-outline.svg";
import LeftArrowIcon from "@/assets/left-arrow.svg";
import { DuckCard, GradientScrollArea } from "@/components";
import { getUserData, startViewTransition } from "@/helpers";

const NoDucks = () => {
  return (
    <div class="w-full max-w-[300px] text-center text-2xl text-primary">
      <div class="relative w-full after:absolute after:inset-0 after:bg-linear-to-b after:from-transparent after:to-white">
        <DuckOutline />
      </div>
      <h5 class="-translate-y-7 text-3xl text-primary">No ducks found</h5>
    </div>
  );
};

export default function CreatorDucks() {
  const { creatorId } = useParams();
  const authenticatedUser = getUserData();
  const userDucks = useGetUserUserIdDucks(Number(creatorId));
  const isMe = authenticatedUser?.ID?.toString() === creatorId;
  const navigate = useNavigate();
  const circleCommonClasses =
    "-translate-x-1/2 -translate-y-1/2 absolute inset-0 top-1/2 left-1/2 z-10 flex flex-col items-center justify-center overflow-hidden rounded-full";
  const circleExpandedClasses =
    "h-[max(calc(100dvw-5dvh),1200px)] w-[max(calc(100dvw-5dvh),1200px)]";

  const userDisplayName = createMemo(() => {
    return userDucks.data?.[0]?.owner?.display_name || "Unknown";
  });

  onMount(() => {
    document.body.style.backgroundColor = "var(--color-primary)";
  });

  return (
    <div class="relative flex h-full w-full shrink-0 scale-fade-in-enter items-start justify-center bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-primary)_0%,var(--color-primary-700)_100%)] pt-[50dvh] after:pointer-events-none after:absolute after:inset-0 after:bg-[length:60vh] after:bg-[url('/bg-pattern.png')] after:bg-center after:bg-repeat after:opacity-5 after:content-['']">
      <h3 class="fixed top-30 z-100 text-center text-5xl text-primary">
        <Show when={isMe || userDucks.data?.length}>
          {isMe ? "My ducks" : `${userDisplayName()}'s ducks`}
        </Show>
      </h3>
      <div
        class={clsx(
          circleCommonClasses,
          circleExpandedClasses,
          "circle-container h-[75dvh] w-[75dvh] bg-white",
        )}
      >
        <div class="absolute bottom-[80px] z-10 h-[calc(100dvh-200px)] w-[90dvh]">
          <GradientScrollArea class="transparent-scrollbar flex h-full flex-row flex-wrap justify-center gap-10 overflow-y-auto py-5 pb-30">
            <For each={userDucks.data} fallback={<NoDucks />}>
              {(duck) => <DuckCard data={duck} />}
            </For>
          </GradientScrollArea>
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
