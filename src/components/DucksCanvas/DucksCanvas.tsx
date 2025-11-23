import clsx from "clsx";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import type { DuckResponse } from "@/api/generated/schemas/duckResponse";
import {
  DebugOverlay,
  DuckInfoModal,
  DuckItem,
  type IDuckItem,
  useAnimationControl,
  useCanvasPan,
  useCanvasVirtualization,
  useCanvasZoom,
} from ".";
import { CANVAS_CONFIG } from "./constants";

interface DucksCanvasProps {
  ducks?: DuckResponse[];
  duckWidth?: number;
  duckHeight?: number;
  duckGap?: number;
  ducksPerRow?: number;
  debug?: boolean;
}

export const DucksCanvas = (props: DucksCanvasProps = {}): JSX.Element => {
  let container!: HTMLDivElement;

  const [selectedDuckId, setSelectedDuckId] = createSignal<string | null>(null);
  const [containerReady, setContainerReady] = createSignal(false);
  const { isAnimating } = useAnimationControl();

  const { pan, setPan, isPanning, isMomentumActive, resetPan, eventHandlers } =
    useCanvasPan(() => selectedDuckId());

  const { scale, handleWheel } = useCanvasZoom(pan, setPan);

  const duckWidth = props.duckWidth ?? CANVAS_CONFIG.defaultItemSize.width;
  const duckHeight = props.duckHeight ?? CANVAS_CONFIG.defaultItemSize.height;
  const duckGap = props.duckGap ?? CANVAS_CONFIG.defaultItemGap;
  const ducksPerRow = props.ducksPerRow ?? CANVAS_CONFIG.defaultItemsPerRow;

  const ducks = createMemo<IDuckItem[]>(() => {
    const data = props.ducks;
    if (!data || data.length === 0) {
      return [];
    }

    return data.map((duck, index) => {
      const x = (index % ducksPerRow) * (duckWidth + duckGap);
      const y = Math.floor(index / ducksPerRow) * (duckHeight + duckGap);

      return {
        id: duck.id?.toString() ?? `duck-${index}`,
        x,
        y,
        w: duckWidth,
        h: duckHeight,
        label: duck.name ?? "",
        image: duck.image ?? "",
        creator: duck.owner?.display_name ?? "Unknown",
        birthday: duck.created_at ?? "",
        likes: duck.likes_count ?? 0,
        dislikes: duck.dislikes_count ?? 0,
        rank: duck.rank ?? 0,
      };
    });
  });

  const selectedDuck = createMemo<IDuckItem | null>(() => {
    const id = selectedDuckId();
    if (!id) return null;

    return ducks().find((duck) => duck.id === id) ?? null;
  });

  const { visibleItems } = useCanvasVirtualization(ducks(), pan, scale, () =>
    containerReady() ? container : undefined,
  );

  createEffect(() => {
    const currentId = selectedDuckId();
    const shouldOpen = currentId !== null;

    if (!shouldOpen) {
      resetPan();
    }
  });

  createEffect(() => {
    if (container) {
      setContainerReady(true);
    }
  });

  onMount(() => {
    const { signal, abort } = new AbortController();

    window.addEventListener("pointerup", eventHandlers.onPointerUp, {
      signal,
    });
    window.addEventListener("pointercancel", eventHandlers.onPointerUp, {
      signal,
    });

    onCleanup(() => {
      abort();
    });
  });

  const canvasTransform = createMemo(() => {
    const { x, y } = pan();
    const s = scale();
    return `translate(${Number.isFinite(x) ? x : 0}px, ${Number.isFinite(y) ? y : 0}px) scale(${Number.isFinite(s) ? s : 1})`;
  });

  return (
    <div
      ref={container}
      onPointerDown={eventHandlers.onPointerDown}
      onPointerMove={eventHandlers.onPointerMove}
      onPointerUp={eventHandlers.onPointerUp}
      onPointerCancel={eventHandlers.onPointerUp}
      onWheel={(e) => handleWheel(e, container)}
      class={clsx(
        "fixed top-0 z-500 h-full w-full touch-none select-none overflow-hidden bg-[url('/yard-pattern.jpg')] bg-center bg-repeat",
        {
          "cursor-grab": !selectedDuckId() && !isPanning(),
          "cursor-grabbing": isPanning(),
          "cursor-default": !!selectedDuckId(),
        },
      )}
    >
      <div
        class="backface-hidden pointer-events-none absolute isolate origin-top-left will-change-transform contain-style"
        style={{
          transform: canvasTransform(),
        }}
        data-panning={isPanning() ? "1" : "0"}
      >
        <For each={visibleItems()}>
          {(item, index) => (
            <DuckItem
              data={item}
              index={index()}
              onClick={(duck) => setSelectedDuckId(duck.id)}
              isAnimating={isAnimating()}
            />
          )}
        </For>
      </div>

      <DuckInfoModal
        open={!!selectedDuck()}
        onClose={() => setSelectedDuckId(null)}
        id={selectedDuck()?.id ?? ""}
        duckName={selectedDuck()?.label ?? ""}
        duckImage={selectedDuck()?.image ?? ""}
        creator={selectedDuck()?.creator ?? ""}
        birthday={selectedDuck()?.birthday ?? ""}
        likes={selectedDuck()?.likes ?? 0}
        dislikes={selectedDuck()?.dislikes ?? 0}
        rank={selectedDuck()?.rank ?? 0}
      />

      <Show when={props.debug}>
        <div class="fixed bottom-2 left-2 rounded-md bg-black/40 px-1.5 py-1 font-mono text-xs opacity-60">
          <DebugOverlay
            pan={pan()}
            scale={scale()}
            visibleCount={visibleItems().length}
            totalCount={ducks().length}
            isMomentumActive={isMomentumActive()}
            activeId={selectedDuckId()}
          />
        </div>
      </Show>
    </div>
  );
};
