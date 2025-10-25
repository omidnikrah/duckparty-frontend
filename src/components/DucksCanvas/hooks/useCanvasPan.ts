import { createSignal } from "solid-js";
import { CANVAS_CONFIG } from "../constants";
import type {
  IButtonDragState,
  IPanState,
  IVelocity,
} from "../DucksCanvas.types";

export function useCanvasPan(activeId?: () => string | null) {
  const [pan, setPan] = createSignal<IPanState>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = createSignal(false);
  const [isMomentumActive, setIsMomentumActive] = createSignal(false);

  let animationFrameId: number | null = null;

  const velocity: IVelocity = { x: 0, y: 0 };
  let lastMoveTime = performance.now();
  let momentumActive = false;

  const buttonDragState: IButtonDragState = {
    start: { x: 0, y: 0 },
    hasMoved: false,
    isDragging: false,
  };

  let lastPan = { x: 0, y: 0 };

  const startPan = (_clientX: number, _clientY: number) => {
    momentumActive = false;
    setIsMomentumActive(false);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    buttonDragState.start = { x: 0, y: 0 };
    buttonDragState.isDragging = false;

    setIsPanning(true);
    lastMoveTime = performance.now();
  };

  const updatePan = (
    clientX: number,
    clientY: number,
    lastPos: { x: number; y: number },
  ) => {
    const now = performance.now();
    const dt = now - lastMoveTime;
    lastMoveTime = now;

    const dx = clientX - lastPos.x;
    const dy = clientY - lastPos.y;

    if (dt > 0 && (Math.abs(dx) > 1 || Math.abs(dy) > 1)) {
      velocity.x = (dx / dt) * CANVAS_CONFIG.velocityScale;
      velocity.y = (dy / dt) * CANVAS_CONFIG.velocityScale;
    }

    momentumActive = false;
    setIsMomentumActive(false);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  };

  const endPan = () => {
    setIsPanning(false);

    if (
      Math.abs(velocity.x) > CANVAS_CONFIG.momentumThreshold ||
      Math.abs(velocity.y) > CANVAS_CONFIG.momentumThreshold
    ) {
      momentumActive = true;
      setIsMomentumActive(true);

      const applyMomentum = () => {
        if (
          !momentumActive ||
          (Math.abs(velocity.x) < CANVAS_CONFIG.momentumStopThreshold &&
            Math.abs(velocity.y) < CANVAS_CONFIG.momentumStopThreshold)
        ) {
          momentumActive = false;
          setIsMomentumActive(false);
          return;
        }

        setPan((p) => ({
          x: p.x + velocity.x,
          y: p.y + velocity.y,
        }));

        velocity.x *= CANVAS_CONFIG.momentumFriction;
        velocity.y *= CANVAS_CONFIG.momentumFriction;

        if (momentumActive) {
          animationFrameId = requestAnimationFrame(applyMomentum);
        }
      };

      animationFrameId = requestAnimationFrame(applyMomentum);
    }
  };

  const resetPan = () => {
    setIsPanning(false);
    setIsMomentumActive(false);
    buttonDragState.isDragging = false;
    buttonDragState.hasMoved = false;
    buttonDragState.start = { x: 0, y: 0 };

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  const handleButtonDrag = (clientX: number, clientY: number): boolean => {
    if (buttonDragState.start.x !== 0 || buttonDragState.start.y !== 0) {
      const dx = Math.abs(clientX - buttonDragState.start.x);
      const dy = Math.abs(clientY - buttonDragState.start.y);

      if (
        dx > CANVAS_CONFIG.dragThreshold ||
        dy > CANVAS_CONFIG.dragThreshold
      ) {
        buttonDragState.hasMoved = true;
        buttonDragState.isDragging = true;

        return true;
      }
    }
    return false;
  };

  const setButtonDragStart = (clientX: number, clientY: number) => {
    buttonDragState.start = { x: clientX, y: clientY };
    buttonDragState.hasMoved = false;
    buttonDragState.isDragging = false;
  };

  const onPointerDown = (event: PointerEvent) => {
    try {
      if (activeId?.()) return;

      const target = event.target as HTMLElement;
      if (target.tagName === "BUTTON") {
        setButtonDragStart(event.clientX, event.clientY);
        return;
      }

      startPan(event.clientX, event.clientY);
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      lastPan = { x: event.clientX, y: event.clientY };
    } catch (error) {
      console.error("Error in onPointerDown:", error);
    }
  };

  const onPointerMove = (event: PointerEvent) => {
    try {
      if (!isPanning()) {
        if (handleButtonDrag(event.clientX, event.clientY)) {
          onPointerDown(event);
          return;
        }
        return;
      }

      updatePan(event.clientX, event.clientY, lastPan);
      lastPan = { x: event.clientX, y: event.clientY };
    } catch (error) {
      console.error("Error in onPointerMove:", error);
    }
  };

  const onPointerUp = (event?: PointerEvent) => {
    try {
      if (event)
        (event.currentTarget as HTMLElement).releasePointerCapture(
          event.pointerId,
        );
    } catch (error) {
      console.error("Error releasing pointer capture:", error);
    }
    endPan();
  };

  return {
    pan,
    setPan,
    isPanning,
    isMomentumActive,
    resetPan,
    eventHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
  };
}
