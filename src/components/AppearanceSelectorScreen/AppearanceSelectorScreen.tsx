import { Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { Tab } from "@/components";
import { AccessoriesSelectorTab } from "./AccessoriesSelectorTab";
import { SkinSelectorTab } from "./SkinSelectorTab";

interface IAppearanceSelectorScreenProps {
  visible: boolean;
}

export const AppearanceSelectorScreen = (
  props: IAppearanceSelectorScreenProps,
) => {
  return (
    <Presence>
      <Show when={props.visible}>
        <Motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
          class="absolute inset-0 z-10 flex h-fit flex-row items-center justify-center"
        >
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
        </Motion.div>
      </Show>
    </Presence>
  );
};
