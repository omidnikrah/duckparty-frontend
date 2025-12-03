import { createSignal } from "solid-js";
import type { DuckResponse } from "@/api/generated/schemas";
import { DuckInfoModal } from "@/components";
import { getUserData } from "@/helpers";
import DuckMagnifierIcon from "./assets/duck-magnifier.svg";

interface DuckCardProps {
  data: DuckResponse;
}

export const DuckCard = (props: DuckCardProps) => {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const authenticatedUser = getUserData();
  const isMe =
    authenticatedUser?.ID?.toString() === props.data.owner_id?.toString();

  return (
    <>
      <div class="group relative box-content flex h-50 w-50 flex-col items-center justify-center overflow-hidden rounded-full border-10 border-gray bg-gray-100 p-5 transition-all duration-200 hover:border-primary">
        <img
          src={props.data.image}
          alt={props.data.name}
          class="h-full w-full object-cover"
        />
        <div class="cubic-transition absolute top-0 right-0 bottom-0 left-0 z-10 flex items-center justify-center bg-white/80 opacity-0 duration-200 group-hover:opacity-100">
          <button
            type="button"
            class="cubic-transition absolute flex h-20 w-20 scale-0 items-center justify-center rounded-full bg-primary opacity-0 transition-all hover:rotate-12 hover:scale-110 group-hover:scale-100 group-hover:opacity-100 [&>svg]:mt-1"
            onClick={() => setIsModalOpen(true)}
          >
            <DuckMagnifierIcon />
          </button>
        </div>
      </div>

      <DuckInfoModal
        open={isModalOpen()}
        onClose={() => setIsModalOpen(false)}
        data={{
          id: +props.data.id!,
          name: props.data.name ?? "",
          image: props.data.image ?? "",
          owner: {
            display_name: props.data.owner?.display_name ?? "",
          },
          created_at: props.data.created_at ?? "",
          likes_count: props.data.likes_count ?? 0,
          dislikes_count: props.data.dislikes_count ?? 0,
          rank: props.data.rank ?? 0,
        }}
        isMe={isMe}
      />
    </>
  );
};
