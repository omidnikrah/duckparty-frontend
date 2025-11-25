import { createMemo } from "solid-js";
import { Portal, Show } from "solid-js/web";
import { useAppearanceStore } from "@/stores";

interface IChooseNameButtonProps {
  onChooseNameClick: () => void;
}

export const ChooseNameButton = (props: IChooseNameButtonProps) => {
  const store = useAppearanceStore();

  const isAppearanceSelected = createMemo(
    () =>
      store.state().selectedSkin !== null &&
      store.state().selectedAccessories.length > 0,
  );

  return (
    <Show when={isAppearanceSelected()}>
      <Portal>
        <button
          type="button"
          class="-translate-x-1/2 choose-name-btn fixed bottom-10 left-1/2 z-100 rounded-full bg-primary px-8 py-4 font-family-carter text-2xl text-white shadow-[0_10px_20px_5px_color-mix(in_srgb,var(--color-primary),transparent_50%)] transition-transform hover:scale-105"
          onClick={props.onChooseNameClick}
        >
          Choose name
        </button>
      </Portal>
    </Show>
  );
};
