import { createSignal } from "solid-js";
import type { TAppearanceState, TAppearanceStore } from "@/types/appearance";

const DEFAULT_STATE: TAppearanceState = {
  selectedSkin: null,
  selectedAccessories: [],
};

const [appearanceState, setAppearanceState] =
  createSignal<TAppearanceState>(DEFAULT_STATE);

export const useAppearanceStore = (): TAppearanceStore => {
  const selectSkin = (skinId: string): void => {
    setAppearanceState((prev) => ({
      ...prev,
      selectedSkin: skinId,
    }));
  };

  const toggleAccessory = (accessoryId: string): void => {
    setAppearanceState((prev) => {
      const isSelected = prev.selectedAccessories.includes(accessoryId);
      return {
        ...prev,
        selectedAccessories: isSelected
          ? prev.selectedAccessories.filter((id) => id !== accessoryId)
          : [...prev.selectedAccessories, accessoryId],
      };
    });
  };

  const isSkinSelected = (skinId: string): boolean => {
    return appearanceState().selectedSkin === skinId;
  };

  const isAccessorySelected = (accessoryId: string): boolean => {
    return appearanceState().selectedAccessories.includes(accessoryId);
  };

  return {
    state: appearanceState(),
    selectSkin,
    toggleAccessory,
    isSkinSelected,
    isAccessorySelected,
  };
};
