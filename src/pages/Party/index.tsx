import { useNavigate } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import { useGetDucks, useGetUser } from "@/api/generated/endpoints";
import { Dropdown, DucksCanvas, SetNameDialog } from "@/components";

export default function Party() {
  const getDucks = useGetDucks();
  const userInfo = useGetUser();
  const [showDialog, setShowDialog] = createSignal(false);
  const navigate = useNavigate();

  createEffect(() => {
    const shouldShow =
      !userInfo.data?.user?.display_name && !userInfo.isLoading;

    if (shouldShow !== showDialog()) {
      if (document.startViewTransition) {
        setTimeout(() => {
          document.startViewTransition(() => {
            setShowDialog(shouldShow);
          });
        }, 1000);
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
            {
              label: "My ducks",
              onClick: () => navigate("/my-ducks"),
            },
            {
              label: "Duckboard",
              onClick: () => navigate("/duckboard"),
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
