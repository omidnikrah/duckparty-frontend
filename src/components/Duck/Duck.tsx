import { createMemo, For } from "solid-js";
import { getAppearanceItemById } from "@/data";
import { useAppearanceStore } from "@/stores/appearanceStore";

export const Duck = () => {
  const store = useAppearanceStore();
  const selectedSkin = createMemo(() => store.state().selectedSkin);
  const selectedAccessories = createMemo(
    () => store.state().selectedAccessories,
  );

  return (
    <div class="pointer-events-none fixed top-[-10dvh] top-layer z-12 w-[80dvh]">
      <img
        src={
          selectedSkin()
            ? getAppearanceItemById(selectedSkin()!)?.originalImage
            : "/body.png"
        }
        alt="body"
      />
      <For each={selectedAccessories()}>
        {(accessory) => (
          <img
            src={getAppearanceItemById(accessory)?.originalImage}
            alt={getAppearanceItemById(accessory)?.name}
            class="absolute top-0"
            style={{
              "z-index": getAppearanceItemById(accessory)?.order ?? "unset",
            }}
          />
        )}
      </For>
    </div>
  );
};
