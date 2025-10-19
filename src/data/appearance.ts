import type { AppearanceCategory, TAppearanceItem } from "@/types/appearance";

const createAppearanceItem = (
  id: string,
  name: string,
  image: string,
  category: AppearanceCategory,
): TAppearanceItem => ({
  id,
  name,
  image,
  category,
});

export const SKINS: TAppearanceItem[] = [
  createAppearanceItem("giraffe", "Giraffe", "/skins/giraffe.png", "skin"),
  createAppearanceItem("lgbt", "Rainbow", "/skins/lgbt.png", "skin"),
  createAppearanceItem("superman", "Superman", "/skins/superman.png", "skin"),
] as const;

export const ACCESSORIES: TAppearanceItem[] = [
  createAppearanceItem(
    "flower-crown",
    "Flower Crown",
    "/accessories/flower-crown.png",
    "accessory",
  ),
  createAppearanceItem(
    "king-crown",
    "King Crown",
    "/accessories/king-crown.png",
    "accessory",
  ),
  createAppearanceItem(
    "superman-cape",
    "Superman Cape",
    "/accessories/superman-cape.png",
    "accessory",
  ),
  createAppearanceItem(
    "vespa-helmet",
    "Vespa Helmet",
    "/accessories/vespa-helmet.png",
    "accessory",
  ),
] as const;

export const APPEARANCE_ITEMS = {
  skins: SKINS,
  accessories: ACCESSORIES,
} as const;

export const getAppearanceItemById = (
  id: string,
): TAppearanceItem | undefined => {
  return [...SKINS, ...ACCESSORIES].find((item) => item.id === id);
};

export const getAppearanceItemsByCategory = (
  category: AppearanceCategory,
): TAppearanceItem[] => {
  return category === "skin" ? SKINS : ACCESSORIES;
};
