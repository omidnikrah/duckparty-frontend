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
