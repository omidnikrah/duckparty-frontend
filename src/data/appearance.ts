import type { AppearanceCategory, TAppearanceItem } from "@/types/appearance";

const createAppearanceItem = (
  id: string,
  name: string,
  category: AppearanceCategory,
  originalImage: string,
  previewImage?: string,
  order?: number,
): TAppearanceItem => ({
  id,
  name,
  category,
  originalImage,
  previewImage,
  order,
});

export const SKINS: TAppearanceItem[] = [
  createAppearanceItem(
    "giraffe",
    "Giraffe",
    "skin",
    "/skins/original/giraffe.png",
    "/skins/preview/giraffe.png",
  ),
  createAppearanceItem(
    "lgbt",
    "Rainbow",
    "skin",
    "/skins/original/lgbt.png",
    "/skins/preview/lgbt.png",
  ),
  createAppearanceItem(
    "superman",
    "Superman",
    "skin",
    "/skins/original/superman.png",
    "/skins/preview/superman.png",
  ),
] as const;

export const ACCESSORIES: TAppearanceItem[] = [
  createAppearanceItem(
    "flower-crown",
    "Flower Crown",
    "accessory",
    "/accessories/original/flower-crown.png",
    "/accessories/preview/flower-crown.png",
    5,
  ),
  createAppearanceItem(
    "king-crown",
    "King Crown",
    "accessory",
    "/accessories/original/king-crown.png",
    "/accessories/preview/king-crown.png",
    4,
  ),
  createAppearanceItem(
    "superman-cape",
    "Superman Cape",
    "accessory",
    "/accessories/original/superman-cape.png",
    "/accessories/preview/superman-cape.png",
    5,
  ),
  createAppearanceItem(
    "vespa-helmet",
    "Vespa Helmet",
    "accessory",
    "/accessories/original/vespa-helmet.png",
    "/accessories/preview/vespa-helmet.png",
    5,
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
