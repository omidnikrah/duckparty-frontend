import type { ICanvasConfig } from "./DucksCanvas.types";

export const CANVAS_CONFIG: ICanvasConfig = {
  chunkSize: 50,
  padding: 200,
  minScale: 0.3,
  maxScale: 2,
  zoomSensitivity: 0.0015,
  momentumFriction: 0.95,
  momentumThreshold: 0.5,
  momentumStopThreshold: 0.1,
  velocityScale: 16,
  dragThreshold: 5,
  defaultItemSize: {
    width: 250,
    height: 250,
  },
  defaultItemGap: 30,
  defaultItemsPerRow: 25,
  duckAnimationTypes: [
    "float",
    "dance",
    // "spin",
    "wiggle",
    "bounce",
    "swim",
    "waddle",
  ],
} as const;

export const RANDOMIZATION_CONFIG = {
  randomScale: 230,
  offsetRange: 0.3,
  seedXMultiplier: 7919,
  seedYMultiplier: 3571,
  seedYOffset: 1237,
} as const;
