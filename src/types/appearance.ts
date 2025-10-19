export type AppearanceCategory = "skin" | "accessory";

export interface TAppearanceItem {
  id: string;
  name: string;
  image: string;
  category: AppearanceCategory;
}

export interface TAppearanceState {
  selectedSkin: string | null;
  selectedAccessories: string[];
}

export interface TAppearanceStore {
  state: TAppearanceState;
  selectSkin: (skinId: string) => void;
  toggleAccessory: (accessoryId: string) => void;
  isSkinSelected: (skinId: string) => boolean;
  isAccessorySelected: (accessoryId: string) => boolean;
}
