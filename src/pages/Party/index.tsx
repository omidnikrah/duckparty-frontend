import { Show } from "solid-js";
import { useGetDucks } from "@/api/generated/endpoints";
import { DucksCanvas } from "@/components";

export default function Party() {
  const getDucks = useGetDucks();

  return (
    <Show when={!getDucks.isError && !getDucks.isLoading}>
      <DucksCanvas ducks={getDucks.data} ducksPerRow={5} />
    </Show>
  );
}
