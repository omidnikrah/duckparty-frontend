import { useQueryClient } from "@tanstack/solid-query";
import type { JSX } from "solid-js";
import {
  getGetDucksQueryKey,
  useDeleteDuckDuckId,
} from "@/api/generated/endpoints";
import type { DuckResponse } from "@/api/generated/schemas/duckResponse";
import { Button, Modal } from "@/components";

interface IDeleteDuckConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  duck: Pick<
    DuckResponse,
    | "id"
    | "image"
    | "name"
    | "likes_count"
    | "dislikes_count"
    | "rank"
    | "created_at"
  >;
}

export const DeleteDuckConfirmationModal = (
  props: IDeleteDuckConfirmationModalProps,
): JSX.Element => {
  const queryClient = useQueryClient();
  const deleteDuckMutation = useDeleteDuckDuckId();

  const handleDelete = async () => {
    deleteDuckMutation.mutate(
      { duckId: props.duck.id! },
      {
        onSuccess: () => {
          const queryKey = getGetDucksQueryKey();
          queryClient.setQueryData<DuckResponse[]>(queryKey, (oldData) => {
            if (!oldData) return oldData;

            return oldData.filter(
              (duck) => duck.id?.toString() !== props.duck.id?.toString(),
            );
          });
          props.onClose();
        },
        onError: (error) => {
          console.error("Failed to delete duck:", error);
        },
      },
    );
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      ariaLabel={`Delete confirmation for ${props.duck.name}`}
    >
      <div class="flex flex-col gap-8">
        <div class="text-center">
          <h2 class="mb-2 text-3xl text-purple-700">Wait! Are you sure?</h2>
          <p class="text-lg text-purple-700/80">
            This duck will be gone forever. Like, really gone.
          </p>
        </div>

        <div class="flex items-center gap-6 rounded-2xl bg-gray-100 p-6">
          <figure class="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
            <img
              src={props.duck.image}
              alt={props.duck.name}
              class="h-[80%] object-cover"
            />
          </figure>
          <div class="flex flex-1 flex-col gap-3">
            <div class="flex items-center gap-2">
              <span class="text-purple-700 text-xl">Name:</span>
              <span class="text-primary text-xl">{props.duck.name}</span>
            </div>
            <div class="flex items-center gap-4 text-lg">
              <div class="flex items-center gap-1">
                <span class="text-2xl text-primary">
                  {props.duck.likes_count}
                </span>
                <span class="text-purple-700">Quacks</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-2xl text-primary">
                  {props.duck.dislikes_count}
                </span>
                <span class="text-purple-700">Yucks</span>
              </div>
              {props.duck.rank && (
                <div class="flex items-center gap-1">
                  <span class="text-2xl text-primary">#{props.duck.rank}</span>
                  <span class="text-purple-700">Rank</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-8">
          <div class="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4">
            <p class="text-center text-primary/60">
              ⚠️ This action cannot be undone! ⚠️
            </p>
          </div>

          <div class="flex items-center gap-4">
            <Button
              type="button"
              onClick={props.onClose}
              class="flex-1 bg-gray-200 text-gray-700 transition-all hover:scale-105"
            >
              Nevermind, Keep It!
            </Button>
            <Button type="button" onClick={handleDelete} class="flex-1">
              Quack, Delete It!
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
