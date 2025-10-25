import type { JSX } from "solid-js";
import type { IPanState } from "../DucksCanvas.types";

interface DebugOverlayProps {
  pan: IPanState;
  scale: number;
  visibleCount: number;
  totalCount: number;
  isMomentumActive: boolean;
  activeId: string | null;
}

export const DebugOverlay = (props: DebugOverlayProps): JSX.Element => {
  return (
    <div
      style={{ font: "12px ui-monospace, SFMono-Regular, Menlo, monospace" }}
    >
      pan {JSON.stringify(props.pan)} · scale {props.scale.toFixed(2)} · visible{" "}
      {props.visibleCount}/{props.totalCount} · momentum{" "}
      {props.isMomentumActive ? "pan" : "off"} · active {String(props.activeId)}
    </div>
  );
};
