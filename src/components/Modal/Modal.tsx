import clsx from "clsx";
import { createEffect, type JSX, onCleanup, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { Button } from "@/components/Button";

interface IModalProps {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
  ariaLabel?: string;
  overlayClass?: string;
  contentClass?: string;
  headerActions?: JSX.Element;
}

export const Modal = (props: IModalProps): JSX.Element => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      props.onClose();
    }
  };

  createEffect(() => {
    if (props.open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    }
  });

  onCleanup(() => {
    document.body.style.overflow = "";
    window.removeEventListener("keydown", handleKeyDown);
  });

  const handleOverlayClick = () => {
    props.onClose();
  };

  return (
    <Show when={props.open}>
      <Portal>
        <div
          role="presentation"
          aria-label={props.ariaLabel}
          class={clsx(
            "fixed inset-0 z-600 grid select-text place-items-center",
          )}
        >
          <div
            role="dialog"
            aria-label="Overlay"
            class={clsx(
              "fixed inset-0 bg-primary/80 backdrop-blur-xs",
              props.overlayClass,
            )}
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          />
          <div
            class={clsx(
              "relative flex min-w-[550px] max-w-[min(800px,70vw)] flex-col gap-10 rounded-3xl bg-white p-5 text-black",
              props.contentClass,
            )}
          >
            <div class="absolute top-[-70px] right-0 flex items-center justify-center gap-4">
              {props.headerActions}
              <button
                type="button"
                class={clsx(
                  "flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-white transition-transform hover:rotate-12 hover:scale-110",
                )}
                onClick={props.onClose}
              >
                <img src="/close.svg" alt="Close" class="w-[80%]" />
              </button>
            </div>
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
};
