import clsx from "clsx";
import { createSignal, For, type JSX, onCleanup, onMount } from "solid-js";
import { twMerge } from "tailwind-merge";

export interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  items: DropdownItem[];
  class?: string;
  buttonClass?: string;
}

export const Dropdown = (props: DropdownProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [backgroundStyle, setBackgroundStyle] = createSignal<JSX.CSSProperties>(
    {
      transform: "translateY(0)",
      opacity: 0,
    },
  );
  let dropdownRef!: HTMLDivElement;
  let buttonRef!: HTMLButtonElement;
  const itemRefs: HTMLButtonElement[] = [];

  const toggleDropdown = () => {
    setIsOpen(!isOpen());
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setBackgroundStyle({
      transform: "translateY(0)",
      opacity: 0,
    });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      isOpen() &&
      dropdownRef &&
      buttonRef &&
      !dropdownRef.contains(event.target as Node) &&
      !buttonRef.contains(event.target as Node)
    ) {
      closeDropdown();
    }
  };

  onMount(() => {
    document.addEventListener("mousedown", handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener("mousedown", handleClickOutside);
  });

  const updateBackgroundPosition = (index: number | null) => {
    if (index === null) {
      setBackgroundStyle({
        transform: "translateY(0)",
        opacity: 0,
      });
      return;
    }

    const item = itemRefs[index];
    if (!item || !dropdownRef) return;

    const dropdownRect = dropdownRef.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const offsetY = itemRect.top - dropdownRect.top - 8;

    setBackgroundStyle({
      transform: `translateY(${offsetY}px)`,
      opacity: 1,
      height: `${itemRect.height}px`,
    });
  };

  const handleItemMouseEnter = (index: number) => {
    updateBackgroundPosition(index);
  };

  const handleItemMouseLeave = () => {
    updateBackgroundPosition(null);
  };

  const HamburgerIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="transition-transform duration-300"
      classList={{
        "rotate-90": isOpen(),
      }}
    >
      <title>Menu</title>
      <path
        d="M4 6H20M4 12H20M4 18H20"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  return (
    <div class={twMerge("relative", props.class)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        class={twMerge(
          clsx(
            "flex h-14 w-14 items-center justify-center rounded-full bg-white text-purple-700 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl",
            {
              "scale-110 bg-primary text-white shadow-xl ring-2 ring-white":
                isOpen(),
            },
          ),
          props.buttonClass,
        )}
        aria-expanded={isOpen()}
        aria-haspopup="true"
        aria-label="Toggle menu"
      >
        <HamburgerIcon />
      </button>

      <div
        ref={dropdownRef}
        class={clsx(
          "absolute top-[calc(100%+0.75rem)] left-0 z-50 min-w-[200px] rounded-4xl bg-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out",
          {
            "pointer-events-none translate-y-[-10px] scale-95 opacity-0":
              !isOpen(),
            "pointer-events-auto translate-y-0 scale-100 opacity-100": isOpen(),
          },
        )}
        role="menu"
        aria-orientation="vertical"
        aria-hidden={!isOpen()}
      >
        <div
          class="absolute right-2 left-2 rounded-2xl bg-primary transition-all duration-300 ease-out"
          style={backgroundStyle()}
        />
        <For each={props.items}>
          {(item, index) => (
            <button
              ref={(el) => {
                itemRefs[index()] = el;
              }}
              type="button"
              onClick={() => {
                item.onClick();
                closeDropdown();
              }}
              onMouseEnter={() => handleItemMouseEnter(index())}
              onMouseLeave={handleItemMouseLeave}
              class="relative z-10 w-full rounded-2xl px-4 py-3 text-left text-base text-purple-700 transition-colors duration-300 ease-out hover:text-white focus:text-white focus:outline-none"
              role="menuitem"
            >
              {item.label}
            </button>
          )}
        </For>
      </div>
    </div>
  );
};
