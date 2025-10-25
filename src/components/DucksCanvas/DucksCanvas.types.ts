export interface IDuckItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  image: string;
}

export interface IPanState {
  x: number;
  y: number;
}

export interface IVelocity {
  x: number;
  y: number;
}

export interface IButtonDragState {
  start: { x: number; y: number };
  hasMoved: boolean;
  isDragging: boolean;
}

export interface ICanvasConfig {
  chunkSize: number;
  padding: number;
  minScale: number;
  maxScale: number;
  zoomSensitivity: number;
  momentumFriction: number;
  momentumThreshold: number;
  momentumStopThreshold: number;
  velocityScale: number;
  dragThreshold: number;
  duckAnimationTypes: string[];
}
