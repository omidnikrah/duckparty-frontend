import { createEffect, createSignal } from "solid-js";
import { Tab } from "@/components";
import { ChooseNameButton } from "@/components/AppearanceSelectorScreen/ChooseNameButton";
import { useAppearanceStore } from "@/stores";
import { AccessoriesSelectorTab } from "./AccessoriesSelectorTab";
import { SkinSelectorTab } from "./SkinSelectorTab";

interface IAppearanceSelectorScreenProps {
  onChooseNameClick: () => void;
}

export const AppearanceSelectorScreen = (
  props: IAppearanceSelectorScreenProps,
) => {
  const { state } = useAppearanceStore();

  const [shouldAnimateAccessoriesTab, setShouldAnimateAccessoriesTab] =
    createSignal(false);
  createEffect(() => {
    if (state().selectedSkin && !state().selectedAccessories.length) {
      setShouldAnimateAccessoriesTab(true);

      setTimeout(() => {
        setShouldAnimateAccessoriesTab(false);
      }, 400);
    }
  });

  return (
    <div class="spring-transition absolute inset-0 z-10 flex h-fit flex-row items-center justify-center">
      <Tab
        items={[
          {
            id: "skin",
            label: "Skin",
            content: <SkinSelectorTab />,
          },
          {
            id: "accessories",
            label: "Accessories",
            content: <AccessoriesSelectorTab />,
            shouldAnimate: shouldAnimateAccessoriesTab(),
          },
        ]}
      />
      <ChooseNameButton onChooseNameClick={props.onChooseNameClick} />
    </div>
  );
};
