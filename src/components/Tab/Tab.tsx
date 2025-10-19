import clsx from "clsx";
import type { JSX } from "solid-js";
import { createMemo, createSignal, For } from "solid-js";
import styles from "./Tab.module.css";

interface ITabItem {
  id: string;
  label: string;
  content: JSX.Element;
}

interface ITabProps {
  items: ITabItem[];
}

export const Tab = (props: ITabProps) => {
  const [activeTab, setActiveTab] = createSignal(props.items[0].id);

  const handleTabClick = (tabId: string) => {
    if (tabId !== activeTab()) {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          setActiveTab(tabId);
        });
      } else {
        setActiveTab(tabId);
      }
    }
  };

  const currentContent = createMemo(() => {
    return props.items.find((item) => item.id === activeTab())?.content;
  });

  return (
    <div class="flex flex-1 select-none flex-col items-center gap-3">
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
      <div class={styles["tab-content"]}>{currentContent()}</div>
    </div>
  );
};
