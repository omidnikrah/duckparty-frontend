import { createSignal } from "solid-js";
import {
  getAccessoriesInSameGroup,
  getAccessoryGroup,
} from "@/data/appearance";
import type { TAppearanceState, TAppearanceStore } from "@/types/appearance";
import { AccessoryGroup } from "@/types/appearance";

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

      if (isSelected) {
        return {
          ...prev,
          selectedAccessories: prev.selectedAccessories.filter(
            (id) => id !== accessoryId,
          ),
        };
      }

      const group = getAccessoryGroup(accessoryId);

      if (group === AccessoryGroup.Other) {
        return {
          ...prev,
          selectedAccessories: [...prev.selectedAccessories, accessoryId],
        };
      }

      const sameGroupAccessories = getAccessoriesInSameGroup(accessoryId);
      const filtered = prev.selectedAccessories.filter(
        (id) => !sameGroupAccessories.includes(id),
      );

      return {
        ...prev,
        selectedAccessories: [...filtered, accessoryId],
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
    state: appearanceState,
    selectSkin,
    toggleAccessory,
    isSkinSelected,
    isAccessorySelected,
  };
};
