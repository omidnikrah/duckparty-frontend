import { createSignal } from "solid-js";
import { CANVAS_CONFIG } from "../constants";
import type { IPanState } from "../DucksCanvas.types";

export function useCanvasZoom(
  pan: () => IPanState,
  setPan: (pan: IPanState) => void,
) {
  const [scale, setScale] = createSignal(1);

  const handleWheel = (e: WheelEvent, container: HTMLElement) => {
    e.preventDefault();

    const delta = -e.deltaY * CANVAS_CONFIG.zoomSensitivity;
    const oldScale = scale();
    const newScale = Math.min(
      CANVAS_CONFIG.maxScale,
      Math.max(CANVAS_CONFIG.minScale, oldScale * Math.exp(delta)),
    );

    if (Math.abs(newScale - oldScale) < 0.001) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const currentPan = pan();

    const canvasX = (mouseX - currentPan.x) / oldScale;
    const canvasY = (mouseY - currentPan.y) / oldScale;

    const newPanX = mouseX - canvasX * newScale;
    const newPanY = mouseY - canvasY * newScale;

    setScale(newScale);
    setPan({ x: newPanX, y: newPanY });
  };

  return {
    scale,
    setScale,
    handleWheel,
  };
}
