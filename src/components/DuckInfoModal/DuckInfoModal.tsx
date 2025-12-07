import { useQueryClient } from "@tanstack/solid-query";
import clsx from "clsx";
import { createMemo, createSignal, type JSX, Show } from "solid-js";
import {
  getGetDucksQueryKey,
  usePutDuckDuckIdReactionReaction,
} from "@/api/generated/endpoints";
import type { DuckReactionResponse } from "@/api/generated/schemas/duckReactionResponse";
import type { DuckResponse } from "@/api/generated/schemas/duckResponse";
import { DeleteDuckConfirmationModal, Modal } from "@/components";
import { getUserData, isUserLoggedIn, timeAgo } from "@/helpers";
import { useSound } from "@/hooks";

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
    | "owner_id"
  >;
  isMe: boolean;
}

export const DuckInfoModal = (props: IDuckInfoModalProps): JSX.Element => {
  const queryClient = useQueryClient();
  const reactionMutation = usePutDuckDuckIdReactionReaction();
  const [showDeleteModal, setShowDeleteModal] = createSignal(false);
  const isLoggedIn = isUserLoggedIn();
  const authenticatedUser = getUserData();
  const { play: playLikeSound } = useSound("/sounds/like.mp3");
  const { play: playDislikeSound } = useSound("/sounds/dislike.mp3");

  const isMe = createMemo(() => authenticatedUser?.ID === props.data.owner_id);

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
    playLikeSound();
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
    playDislikeSound();
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

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <Modal
        open={props.open && !showDeleteModal()}
        onClose={props.onClose}
        ariaLabel={props.data.name}
        headerActions={
          <Show when={isMe()}>
            <button
              type="button"
              class={clsx(
                "hover:-rotate-12 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-white text-purple-700 text-sm transition-transform hover:scale-110",
              )}
              onClick={handleDeleteClick}
            >
              <img src="/trash.svg" alt="Delete" class="w-[60%]" />
            </button>
          </Show>
        }
      >
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
              "pointer-events-none": props.isMe || !isLoggedIn,
            })}
          >
            <div class="flex flex-row items-end gap-1 transition-opacity group-hover:opacity-50">
              <span class="text-4xl text-primary">
                {props.data.likes_count}
              </span>
              <span class="text-lg text-purple-700">Quack</span>
            </div>
            <button
              type="button"
              disabled={props.isMe || !isLoggedIn}
              onClick={handleLike}
              class="absolute scale-0 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"
            >
              <img src="/thumbs-up.png" alt="Like" class="w-[45px]" />
            </button>
          </div>
          <div class="relative h-[20px] w-px rotate-30 bg-purple-700/30 after:absolute after:inset-0 after:top-[-px] after:left-[2px] after:h-[20px] after:w-px after:bg-purple-700/30 after:content-['']" />
          <div
            class={clsx("group flex flex-row items-center justify-center", {
              "pointer-events-none": props.isMe || !isLoggedIn,
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
              disabled={props.isMe || !isLoggedIn}
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
      </Modal>
      <DeleteDuckConfirmationModal
        open={showDeleteModal()}
        onClose={() => setShowDeleteModal(false)}
        duck={props.data}
      />
    </>
  );
};
