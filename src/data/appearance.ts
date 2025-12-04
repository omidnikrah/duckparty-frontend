import type { AppearanceCategory, TAppearanceItem } from "@/types/appearance";
import { AccessoryGroup } from "@/types/appearance";

const createAppearanceItem = (
  id: string,
  name: string,
  category: AppearanceCategory,
  originalImage: string,
  previewImage?: string,
  order?: number,
  group?: AccessoryGroup,
): TAppearanceItem => ({
  id,
  name,
  category,
  originalImage,
  previewImage,
  order,
  group,
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
  createAppearanceItem(
    "artiste",
    "Artiste",
    "skin",
    "/skins/original/artiste.png",
    "/skins/preview/artiste.png",
  ),
  createAppearanceItem(
    "astronaut",
    "Astronaut",
    "skin",
    "/skins/original/astronaut.png",
    "/skins/preview/astronaut.png",
  ),
  createAppearanceItem(
    "barbie",
    "Barbie",
    "skin",
    "/skins/original/barbie.png",
    "/skins/preview/barbie.png",
  ),
  createAppearanceItem(
    "batman",
    "Batman",
    "skin",
    "/skins/original/batman.png",
    "/skins/preview/batman.png",
  ),
  createAppearanceItem(
    "beach",
    "Beach",
    "skin",
    "/skins/original/beach.png",
    "/skins/preview/beach.png",
  ),
  createAppearanceItem(
    "chef",
    "Chef",
    "skin",
    "/skins/original/chef.png",
    "/skins/preview/chef.png",
  ),
  createAppearanceItem(
    "doctor",
    "Doctor",
    "skin",
    "/skins/original/doctor.png",
    "/skins/preview/doctor.png",
  ),
  createAppearanceItem(
    "pirate",
    "Pirate",
    "skin",
    "/skins/original/pirate.png",
    "/skins/preview/pirate.png",
  ),
  createAppearanceItem(
    "spiderman",
    "Spiderman",
    "skin",
    "/skins/original/spiderman.png",
    "/skins/preview/spiderman.png",
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
    AccessoryGroup.Other,
  ),
  createAppearanceItem(
    "king-crown",
    "King Crown",
    "accessory",
    "/accessories/original/king-crown.png",
    "/accessories/preview/king-crown.png",
    4,
    AccessoryGroup.Hat,
  ),
  createAppearanceItem(
    "superman-cape",
    "Superman Cape",
    "accessory",
    "/accessories/original/superman-cape.png",
    "/accessories/preview/superman-cape.png",
    3,
    AccessoryGroup.Cape,
  ),
  createAppearanceItem(
    "vespa-helmet",
    "Vespa Helmet",
    "accessory",
    "/accessories/original/vespa-helmet.png",
    "/accessories/preview/vespa-helmet.png",
    5,
    AccessoryGroup.Hat,
  ),
  createAppearanceItem(
    "artiste-hat",
    "Artiste Hat",
    "accessory",
    "/accessories/original/artiste-hat.png",
    "/accessories/preview/artiste-hat.png",
    5,
    AccessoryGroup.Hat,
  ),
  createAppearanceItem(
    "astronaut-helmet",
    "Astronaut Helmet",
    "accessory",
    "/accessories/original/astronaut-helmet.png",
    "/accessories/preview/astronaut-helmet.png",
    5,
    AccessoryGroup.Hat,
  ),
  createAppearanceItem(
    "barbie-earmuffs",
    "Barbie Earmuffs",
    "accessory",
    "/accessories/original/barbie-earmuffs.png",
    "/accessories/preview/barbie-earmuffs.png",
    5,
    AccessoryGroup.Other,
  ),
  createAppearanceItem(
    "batman-cape",
    "Batman Cape",
    "accessory",
    "/accessories/original/batman-cape.png",
    "/accessories/preview/batman-cape.png",
    3,
    AccessoryGroup.Cape,
  ),
  createAppearanceItem(
    "blue-winter-hat",
    "Blue Winter Hat",
    "accessory",
    "/accessories/original/blue-winter-hat.png",
    "/accessories/preview/blue-winter-hat.png",
    5,
    AccessoryGroup.Hat,
  ),
  createAppearanceItem(
    "blue-winter-scarf",
    "Blue Winter Scarf",
    "accessory",
    "/accessories/original/blue-winter-scarf.png",
    "/accessories/preview/blue-winter-scarf.png",
    5,
    AccessoryGroup.Other,
  ),
  createAppearanceItem(
    "chef-hat",
    "Chef Hat",
    "accessory",
    "/accessories/original/chef-hat.png",
    "/accessories/preview/chef-hat.png",
    5,
    AccessoryGroup.Hat,
  ),
  createAppearanceItem(
    "doctor-stethoscope",
    "Doctor Stethoscope",
    "accessory",
    "/accessories/original/doctor-stethoscope.png",
    "/accessories/preview/doctor-stethoscope.png",
    5,
    AccessoryGroup.Other,
  ),
  createAppearanceItem(
    "pirate-eye-patch",
    "Pirate Eye Patch",
    "accessory",
    "/accessories/original/pirate-eye-patch.png",
    "/accessories/preview/pirate-eye-patch.png",
    5,
    AccessoryGroup.Eyewear,
  ),
  createAppearanceItem(
    "pirate-hat",
    "Pirate Hat",
    "accessory",
    "/accessories/original/pirate-hat.png",
    "/accessories/preview/pirate-hat.png",
    5,
    AccessoryGroup.Hat,
  ),
  createAppearanceItem(
    "sunglass",
    "Sunglass",
    "accessory",
    "/accessories/original/sunglass.png",
    "/accessories/preview/sunglass.png",
    5,
    AccessoryGroup.Eyewear,
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

export const getAccessoryGroup = (
  accessoryId: string,
): AccessoryGroup | undefined => getAppearanceItemById(accessoryId)?.group;

export const getAccessoriesInSameGroup = (accessoryId: string): string[] => {
  const group = getAccessoryGroup(accessoryId);
  if (!group) return [];

  return ACCESSORIES.filter((item) => item.group === group).map(
    (item) => item.id,
  );
};
