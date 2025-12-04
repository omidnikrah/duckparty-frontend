export type AppearanceCategory = "skin" | "accessory";

export enum AccessoryGroup {
  Hat = "hat",
  Eyewear = "eyewear",
  Cape = "cape",
  Other = "other",
}

export interface TAppearanceItem {
  id: string;
  name: string;
  previewImage?: string;
  originalImage: string;
  category: AppearanceCategory;
  order?: number;
  group?: AccessoryGroup;
}

export interface TAppearanceState {
  selectedSkin: string | null;
  selectedAccessories: string[];
}

export interface TAppearanceStore {
  state: () => TAppearanceState;
  selectSkin: (skinId: string) => void;
  toggleAccessory: (accessoryId: string) => void;
  isSkinSelected: (skinId: string) => boolean;
  isAccessorySelected: (accessoryId: string) => boolean;
}
