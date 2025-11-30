import { createEffect, createSignal, Show } from "solid-js";
import { useGetDucks, useGetUser } from "@/api/generated/endpoints";
import { DucksCanvas, SetNameDialog } from "@/components";

export default function Party() {
  const getDucks = useGetDucks();
  const userInfo = useGetUser();
  const [showDialog, setShowDialog] = createSignal(false);

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
    </Show>
  );
}
