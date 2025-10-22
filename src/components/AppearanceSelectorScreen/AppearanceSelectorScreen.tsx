import { Tab } from "@/components";
import { ChooseNameButton } from "@/components/AppearanceSelectorScreen/ChooseNameButton";
import { AccessoriesSelectorTab } from "./AccessoriesSelectorTab";
import { SkinSelectorTab } from "./SkinSelectorTab";

interface IAppearanceSelectorScreenProps {
  onChooseNameClick: () => void;
}

export const AppearanceSelectorScreen = (
  props: IAppearanceSelectorScreenProps,
) => {
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
          },
        ]}
      />
      <ChooseNameButton onChooseNameClick={props.onChooseNameClick} />
    </div>
  );
};
