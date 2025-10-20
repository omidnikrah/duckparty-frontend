import { Tab } from "@/components";
import { AccessoriesSelectorTab } from "./AccessoriesSelectorTab";
import { SkinSelectorTab } from "./SkinSelectorTab";

export const AppearanceSelectorScreen = () => {
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
    </div>
  );
};
