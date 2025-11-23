import type { JSX } from "solid-js";
import { CANVAS_CONFIG } from "../constants";
import type { IDuckItem } from "../DucksCanvas.types";

interface IDuckItemProps {
  data: IDuckItem;
  index: number;
  onClick: (data: IDuckItem) => void;
  isAnimating: boolean;
}

const RANDOM_SEED = 2654435761;
const DURATION_MULTIPLIER = 17;
const DELAY_MULTIPLIER = 23;
const MAX_DURATION_OFFSET = 4000;
const MAX_DELAY = 3000;
const BASE_DURATION = 1500;

export const DuckItem = (props: IDuckItemProps): JSX.Element => {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    props.onClick(props.data);
  };

  const animationIndex = Math.abs(
    (props.index * RANDOM_SEED) % CANVAS_CONFIG.duckAnimationTypes.length,
  );
  const animationType =
    CANVAS_CONFIG.duckAnimationTypes[animationIndex] ||
    CANVAS_CONFIG.duckAnimationTypes[0];
  const duration =
    BASE_DURATION + ((props.index * DURATION_MULTIPLIER) % MAX_DURATION_OFFSET);
  const delay = (props.index * DELAY_MULTIPLIER) % MAX_DELAY;

  return (
    <button
      type="button"
      class="item-card pointer-events-auto absolute will-change-transform"
      onClick={handleClick}
      style={{
        left: `${props.data.x}px`,
        top: `${props.data.y}px`,
        width: `${props.data.w}px`,
        height: `${props.data.h}px`,
        animation: `duck-${animationType} ${duration}ms ease-in-out infinite`,
        "animation-play-state": props.isAnimating ? "running" : "paused",
        "animation-delay": `${delay}ms`,
        contain: "layout style",
      }}
    >
      <img
        src={props.data.image}
        alt={props.data.label}
        class="pointer-events-none w-[150px]"
      />
    </button>
  );
};
