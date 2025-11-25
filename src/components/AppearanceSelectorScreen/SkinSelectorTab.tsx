import { For } from "solid-js";
import { AppearanceItem } from "@/components";
import { SKINS } from "@/data";
import { useAppearanceStore } from "@/stores";

export const SkinSelectorTab = () => {
  const { selectSkin, isSkinSelected } = useAppearanceStore();

  return (
    <div class="transparent-scrollbar flex h-[45dvh] flex-row flex-wrap items-center justify-center gap-5 overflow-y-auto py-5 pb-30">
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
