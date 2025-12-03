import { useQueryClient } from "@tanstack/solid-query";
import clsx from "clsx";
import { type JSX, onCleanup, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";
import {
  getGetDucksQueryKey,
  usePutDuckDuckIdReactionReaction,
} from "@/api/generated/endpoints";
import type { DuckReactionResponse } from "@/api/generated/schemas/duckReactionResponse";
import type { DuckResponse } from "@/api/generated/schemas/duckResponse";
import { timeAgo } from "@/helpers";

interface IDuckInfoModalProps {
  open: boolean;
  onClose: () => void;
  data: Pick<
    DuckResponse,
    | "id"
    | "image"
    | "name"
    | "owner"
    | "created_at"
    | "likes_count"
    | "dislikes_count"
    | "rank"
  >;
  isMe: boolean;
}

export const DuckInfoModal = (props: IDuckInfoModalProps): JSX.Element => {
  const queryClient = useQueryClient();
  const reactionMutation = usePutDuckDuckIdReactionReaction();
  console.log(props);

  const updateDucksCache = (data: DuckReactionResponse) => {
    const queryKey = getGetDucksQueryKey();
    queryClient.setQueryData<DuckResponse[]>(queryKey, (oldData) => {
      if (!oldData || !data.duck) return oldData;

      return oldData.map((duck) =>
        duck.id?.toString() === props.data.id?.toString()
          ? {
              ...duck,
              likes_count: data.duck?.likes_count ?? duck.likes_count,
              dislikes_count: data.duck?.dislikes_count ?? duck.dislikes_count,
            }
          : duck,
      );
    });
  };

  const handleLike = () => {
    reactionMutation.mutate(
      {
        duckId: props.data.id?.toString()!,
        reaction: "like",
      },
      {
        onSuccess: (data) => {
          updateDucksCache(data);
        },
      },
    );
  };

  const handleDislike = () => {
    reactionMutation.mutate(
      {
        duckId: props.data.id?.toString()!,
        reaction: "dislike",
      },
      {
        onSuccess: (data) => {
          updateDucksCache(data);
        },
      },
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      props.onClose();
    }
  };

  onMount(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    document.body.style.overflow = "";
    window.removeEventListener("keydown", handleKeyDown);
  });

  const handleOverlayClick = () => {
    props.onClose();
  };

  return (
    <Show when={props.open}>
      <Portal>
        <div
          role="presentation"
          aria-label={props.data.name}
          class="fixed inset-0 z-500 grid select-text place-items-center bg-black/50"
        >
          <div
            role="dialog"
            aria-label="Overlay"
            class="fixed inset-0 bg-black/50"
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          />
          <div class="relative flex min-w-[550px] max-w-[min(800px,70vw)] flex-col gap-10 rounded-3xl bg-white p-5 text-black">
            <button
              type="button"
              class="absolute top-[-30%] right-5 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white transition-transform hover:rotate-12 hover:scale-110"
              onClick={props.onClose}
            >
              <img src="/close.svg" alt="Close" class="w-[80%]" />
            </button>
            <div class="flex items-center gap-5">
              <figure class="flex h-40 w-40 items-center justify-center overflow-hidden rounded-xl bg-gray">
                <img
                  src={props.data.image}
                  alt={props.data.name}
                  class="h-[80%] object-cover"
                />
              </figure>
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-2 text-2xl">
                  <span class="text-purple-700">Duck Name:</span>
                  <span class="text-primary">{props.data.name}</span>
                </div>
                <div class="flex items-center gap-2 text-2xl">
                  <span class="text-purple-700">Creator:</span>
                  <span class="text-primary">
                    {props.data.owner?.display_name || "N/A"}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-2xl">
                  <span class="text-purple-700">Birthday:</span>
                  <span class="text-primary capitalize">
                    {timeAgo(new Date(props.data.created_at!))}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between gap-5">
              <div
                class={clsx("group flex flex-row items-center justify-center", {
                  "pointer-events-none": props.isMe,
                })}
              >
                <div class="flex flex-row items-end gap-1 transition-opacity group-hover:opacity-50">
                  <span class="text-4xl text-primary">
                    {props.data.likes_count}
                  </span>
                  <span class="text-lg text-purple-700">Duck</span>
                </div>
                <button
                  type="button"
                  disabled={props.isMe}
                  onClick={handleLike}
                  class="absolute scale-0 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"
                >
                  <img src="/thumbs-up.png" alt="Like" class="w-[45px]" />
                </button>
              </div>
              <div class="relative h-[20px] w-px rotate-30 bg-purple-700/30 after:absolute after:inset-0 after:top-[-px] after:left-[2px] after:h-[20px] after:w-px after:bg-purple-700/30 after:content-['']" />
              <div
                class={clsx("group flex flex-row items-center justify-center", {
                  "pointer-events-none": props.isMe,
                })}
              >
                <div class="flex flex-row items-end gap-1 transition-opacity group-hover:opacity-50">
                  <span class="text-4xl text-primary">
                    {props.data.dislikes_count}
                  </span>
                  <span class="text-lg text-purple-700">Yuck</span>
                </div>
                <button
                  type="button"
                  disabled={props.isMe}
                  onClick={handleDislike}
                  class="absolute rotate-180 scale-0 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"
                >
                  <img src="/thumbs-up.png" alt="Dislike" class="w-[45px]" />
                </button>
              </div>
              <div class="relative h-[20px] w-px rotate-30 bg-purple-700/30 after:absolute after:inset-0 after:top-[-px] after:left-[2px] after:h-[20px] after:w-px after:bg-purple-700/30 after:content-['']" />
              <div class="flex flex-row items-end gap-1">
                <span class="text-4xl text-primary">
                  {props.data.rank ? `#${props.data.rank}` : "N/A"}
                </span>
                <span class="text-lg text-purple-700">On the Duckboard</span>
              </div>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};
