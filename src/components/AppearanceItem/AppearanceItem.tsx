import clsx from "clsx";
import type { TAppearanceItem } from "@/types/appearance";

interface AppearanceItemProps {
  item: TAppearanceItem;
  selected?: boolean;
  onClick?: () => void;
}

export const AppearanceItem = (props: AppearanceItemProps) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      class={clsx(
        "box-content flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-10 border-gray bg-gray-100 p-5 transition-all duration-200",
        {
          "border-primary": props.selected,
        },
      )}
      aria-pressed={props.selected}
      aria-label={`Select ${props.item.name}`}
    >
      <img
        src={props.item.previewImage ?? props.item.originalImage}
        alt={props.item.name}
        loading="lazy"
      />
    </button>
  );
};
