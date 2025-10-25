import { createMemo } from "solid-js";
import { CANVAS_CONFIG } from "../constants";
import type { IDuckItem, IPanState } from "../DucksCanvas.types";

export function useCanvasVirtualization(
  items: IDuckItem[],
  pan: () => IPanState,
  scale: () => number,
  container: () => HTMLElement | undefined,
) {
  const visibleItems = createMemo(() => {
    const containerElement = container();
    if (!containerElement) {
      return items;
    }

    const rect = containerElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return items;
    }
    const currentScale = scale();
    const currentPan = pan();

    if (currentScale < CANVAS_CONFIG.minScale) return [];

    const canvasLeft = (-currentPan.x - CANVAS_CONFIG.padding) / currentScale;
    const canvasTop = (-currentPan.y - CANVAS_CONFIG.padding) / currentScale;
    const canvasRight =
      (rect.width - currentPan.x + CANVAS_CONFIG.padding) / currentScale;
    const canvasBottom =
      (rect.height - currentPan.y + CANVAS_CONFIG.padding) / currentScale;

    const visibleItems: IDuckItem[] = [];

    for (let i = 0; i < items.length; i += CANVAS_CONFIG.chunkSize) {
      const chunk = items.slice(i, i + CANVAS_CONFIG.chunkSize);
      const visibleChunk = chunk.filter((item) => {
        const itemRight = item.x + item.w;
        const itemBottom = item.y + item.h;

        return (
          item.x < canvasRight &&
          itemRight > canvasLeft &&
          item.y < canvasBottom &&
          itemBottom > canvasTop
        );
      });
      visibleItems.push(...visibleChunk);
    }

    return visibleItems;
  });

  return { visibleItems };
}
