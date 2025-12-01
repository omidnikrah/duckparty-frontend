import clsx from "clsx";
import { type JSX, Show } from "solid-js";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: JSX.Element;
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      class={twMerge(
        clsx(
          "relative flex w-full items-center justify-center rounded-full bg-primary p-5 text-white text-xl transition-transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50",
          props.class,
        ),
      )}
      type={props.type || "button"}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      <Show when={props.isLoading} fallback={props.children}>
        <span class="inline-flex h-6 w-6 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </Show>
    </button>
  );
};
