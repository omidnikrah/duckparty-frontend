import { useNavigate } from "@solidjs/router";
import { useQueryClient } from "@tanstack/solid-query";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import {
  getGetDucksQueryKey,
  useGetDucks,
  useGetUser,
} from "@/api/generated/endpoints";
import type { DuckResponse } from "@/api/generated/schemas/duckResponse";
import MuteIcon from "@/assets/mute.svg";
import UnmuteIcon from "@/assets/unmute.svg";
import { Dropdown, DucksCanvas, SetNameDialog } from "@/components";
import { getUserData } from "@/helpers";
import { useSocket, useSound } from "@/hooks";
import { SocketEvent } from "@/types/socket";

type SocketEventMap = {
  [SocketEvent.NewDuckCreated]: DuckResponse;
};

export default function Party() {
  const getDucks = useGetDucks();
  const userInfo = useGetUser();
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = createSignal(false);
  const navigate = useNavigate();
  const authenticatedUser = getUserData();
  const { play: playPartyStartSound } = useSound("/sounds/party-intro.mp3");
  const {
    play: playPartyYardSound,
    pause: pausePartyYardSound,
    isPaused: isPartyYardSoundPaused,
  } = useSound("/sounds/party-yard.mp3", {
    loop: true,
    volume: 0.2,
  });
  useSocket<SocketEventMap>({
    events: [SocketEvent.NewDuckCreated],
    handler: (_event, payload) => {
      queryClient.setQueryData<DuckResponse[]>(
        getGetDucksQueryKey(),
        (oldData) => {
          if (!oldData) return oldData;

          const duckExists = oldData.some((duck) => duck.id === payload.id);
          if (duckExists) {
            return oldData;
          }

          return [payload, ...oldData];
        },
      );
    },
  });

  const togglePartyYardSound = () => {
    if (isPartyYardSoundPaused()) {
      playPartyYardSound();
    } else {
      pausePartyYardSound();
    }
  };

  onMount(() => {
    playPartyStartSound();
    playPartyYardSound();
  });

  createEffect(() => {
    const shouldShow =
      !userInfo.data?.user?.display_name && !userInfo.isLoading;

    if (shouldShow !== showDialog()) {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          setShowDialog(shouldShow);
        });
      } else {
        setShowDialog(shouldShow);
      }
    }
  });

  return (
    <Show when={!getDucks.isError && !getDucks.isLoading}>
      <DucksCanvas ducks={getDucks.data} ducksPerRow={5} />
      <Show when={showDialog()}>
        <SetNameDialog />
      </Show>
      <div class="fixed top-6 left-6 z-600 flex items-center gap-4">
        <Dropdown
          items={[
            { label: "Create new duck", onClick: () => navigate("/") },
            ...(authenticatedUser?.ID
              ? [
                  {
                    label: "My ducks",
                    onClick: () =>
                      navigate(`/creator/${authenticatedUser.ID}/ducks`),
                  },
                ]
              : []),
            {
              label: "Duckboard",
              onClick: () => navigate("/leaderboard"),
            },
            {
              label: "Give a star",
              onClick: () =>
                window.open(
                  "https://github.com/omidnikrah/duckparty-frontend",
                  "_blank",
                ),
            },
          ]}
        />
        <button
          type="button"
          onClick={togglePartyYardSound}
          class="flex h-14 w-14 items-center justify-center rounded-full bg-white p-4 text-purple-700 text-purple-700 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          <Show when={isPartyYardSoundPaused()} fallback={<UnmuteIcon />}>
            <MuteIcon />
          </Show>
        </button>
      </div>
    </Show>
  );
}
