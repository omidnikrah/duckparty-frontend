import { For } from "solid-js";
import { AppearanceItem } from "@/components";
import { ACCESSORIES } from "@/data";
import { useAppearanceStore } from "@/stores";

export const AccessoriesSelectorTab = () => {
  const { toggleAccessory, isAccessorySelected } = useAppearanceStore();

  return (
    <div class="flex h-[45dvh] flex-row flex-wrap items-center justify-center gap-5 overflow-y-auto py-5 pb-30">
      <For each={ACCESSORIES}>
        {(accessory) => (
          <AppearanceItem
            item={accessory}
            selected={isAccessorySelected(accessory.id)}
            onClick={() => toggleAccessory(accessory.id)}
          />
        )}
      </For>
    </div>
  );
};
