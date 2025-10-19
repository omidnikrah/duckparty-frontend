import { For } from "solid-js";
import { AppearanceItem } from "@/components";
import { ACCESSORIES } from "@/data";
import { useAppearanceStore } from "@/stores";

export const AccessoriesSelectorTab = () => {
  const { toggleAccessory, isAccessorySelected } = useAppearanceStore();

  return (
    <div class="flex flex-row items-center justify-center gap-5 py-5">
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
