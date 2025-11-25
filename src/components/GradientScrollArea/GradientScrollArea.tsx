import { createSignal, type JSXElement } from "solid-js";

interface GradientScrollAreaProps {
  children: JSXElement;
  class?: string;
}

const GRADIENT_HEIGHT = "80px";
const SCROLL_THRESHOLD = 10;

export const GradientScrollArea = (props: GradientScrollAreaProps) => {
  const [showTopGradient, setShowTopGradient] = createSignal(false);

  const checkScroll = (target: HTMLDivElement) => {
    const { scrollTop } = target;
    setShowTopGradient(scrollTop > SCROLL_THRESHOLD);
  };

  const handleScroll = (e: Event) => {
    checkScroll(e.target as HTMLDivElement);
  };

  return (
    <div class="relative h-full">
      <div
        class="pointer-events-none absolute top-0 right-0 left-0 z-10 transition-opacity duration-300"
        style={{
          height: GRADIENT_HEIGHT,
          "background-image": "linear-gradient(to bottom, white, transparent)",
          opacity: showTopGradient() ? 1 : 0,
        }}
      />

      <div class={props.class} onScroll={handleScroll}>
        {props.children}
      </div>

      <div
        class="pointer-events-none absolute right-0 bottom-0 left-0 z-10"
        style={{
          height: GRADIENT_HEIGHT,
          "background-image": "linear-gradient(to top, white, transparent)",
        }}
      />
    </div>
  );
};
