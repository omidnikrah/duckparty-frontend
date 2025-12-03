import { A } from "@solidjs/router";
import type { DuckResponse } from "@/api/generated/schemas";

interface LeaderboardItemProps {
  data: DuckResponse;
}

export const LeaderboardItem = (props: LeaderboardItemProps) => {
  return (
    <div class="relative flex w-full flex-row items-center justify-between rounded-full bg-gray-100 px-7 py-3">
      <div class="flex flex-row items-center gap-5">
        <span class="text-4xl text-primary">#{props.data.rank}</span>
        <figure class="flex h-10 w-10 items-center justify-center overflow-hidden">
          <img
            src={props.data.image}
            alt={props.data.name}
            class="h-full w-full scale-150 object-contain"
          />
        </figure>
        <div class="flex flex-col gap-1">
          <span class="text-2xl text-purple-700">{props.data.name}</span>
          <span class="text-purple-700 text-sm">
            By:{" "}
            <A
              href={`/creator/${props.data.owner_id}/ducks`}
              class="text-primary"
            >
              {props.data.owner?.display_name || "N/A"}
            </A>
          </span>
        </div>
      </div>
      <div class="flex flex-row items-center gap-1">
        <span class="text-lg text-purple-700">
          <span class="text-primary">{props.data.likes_count}</span> Ducks
        </span>
        <div class="mx-2 h-[6px] w-[6px] rounded-full bg-primary/30" />
        <span class="text-lg text-purple-700">
          <span class="text-primary">{props.data.dislikes_count}</span> Yucks
        </span>
      </div>
    </div>
  );
};
