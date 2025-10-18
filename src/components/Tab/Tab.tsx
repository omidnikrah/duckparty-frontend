import clsx from "clsx";
import type { JSX } from "solid-js";
import { createMemo, createSignal, For, Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";

interface ITabItem {
  id: string;
  label: string;
  content: JSX.Element;
}

interface ITabProps {
  items: ITabItem[];
}

export const Tab = (props: ITabProps) => {
  // Track previous tab to trigger exit/enter animations
  const [previousActiveTab, setPreviousActiveTab] = createSignal();
  const [activeTab, setActiveTab] = createSignal(props.items[0].id);

  const handleTabClick = (tabId: string) => {
    if (tabId !== activeTab()) {
      setPreviousActiveTab(activeTab());
      setActiveTab(tabId);
    }
  };

  const currentContent = createMemo(() => {
    return props.items.find((item) => item.id === activeTab())?.content;
  });

  return (
    <div class="flex flex-1 flex-col items-center gap-3">
      <div class="flex flex-row gap-2">
        <For each={props.items}>
          {(item) => (
            <button
              type="button"
              class={clsx(
                "inline-flex rounded-full bg-gray px-4 py-2 text-gray-700 text-lg transition-colors duration-300",
                {
                  "bg-primary text-white": activeTab() === item.id,
                },
              )}
              onClick={() => handleTabClick(item.id)}
            >
              {item.label}
            </button>
          )}
        </For>
      </div>
      <div class="flex">
        <Presence exitBeforeEnter>
          <Show when={activeTab() !== previousActiveTab()}>
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {currentContent()}
            </Motion.div>
          </Show>
        </Presence>
      </div>
    </div>
  );
};
