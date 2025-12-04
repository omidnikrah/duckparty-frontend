import { useParams } from "@solidjs/router";
import clsx from "clsx";
import { createMemo, For, onMount } from "solid-js";
import { useGetUserUserIdDucks } from "@/api/generated/endpoints";
import { DuckCard, GradientScrollArea } from "@/components";
import { getUserData } from "@/helpers";

export default function CreatorDucks() {
  const { creatorId } = useParams();
  const authenticatedUser = getUserData();
  const userDucks = useGetUserUserIdDucks(Number(creatorId));
  const isMe = authenticatedUser?.ID?.toString() === creatorId;

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
        {isMe ? "My ducks" : `${userDisplayName()}'s ducks`}
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
            <For each={userDucks.data}>
              {(duck) => <DuckCard data={duck} />}
            </For>
          </GradientScrollArea>
        </div>
      </div>
    </div>
  );
}
