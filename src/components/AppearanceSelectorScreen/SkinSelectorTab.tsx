import { For } from "solid-js";
import { AppearanceItem } from "@/components";
import { SKINS } from "@/data";
import { useAppearanceStore } from "@/stores";

export const SkinSelectorTab = () => {
  const { selectSkin, isSkinSelected } = useAppearanceStore();

  return (
    <div class="flex flex-row items-center justify-center gap-5 py-5">
      <For each={SKINS}>
        {(skin) => (
          <AppearanceItem
            item={skin}
            selected={isSkinSelected(skin.id)}
            onClick={() => selectSkin(skin.id)}
          />
        )}
      </For>
    </div>
  );
};
