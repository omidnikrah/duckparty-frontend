import { useNavigate } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { useGetDucks, useGetUser } from "@/api/generated/endpoints";
import { Dropdown, DucksCanvas, SetNameDialog } from "@/components";
import { getUserData } from "@/helpers";
import { useSound } from "@/hooks";

export default function Party() {
  const getDucks = useGetDucks();
  const userInfo = useGetUser();
  const [showDialog, setShowDialog] = createSignal(false);
  const navigate = useNavigate();
  const authenticatedUser = getUserData();
  const { play: playPartyStartSound } = useSound("/sounds/party-intro.mp3");
  const { play: playPartyYardSound } = useSound("/sounds/party-yard.mp3", {
    loop: true,
    volume: 0.2,
  });

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
      <div class="fixed top-6 left-6 z-600">
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
      </div>
    </Show>
  );
}
