import clsx from "clsx";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  onCleanup,
  onMount,
} from "solid-js";
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

export const DucksCanvas = (): JSX.Element => {
  let container!: HTMLDivElement;

  const [activeId, setActiveId] = createSignal<string | null>(null);
  const [containerReady, setContainerReady] = createSignal(false);
  const { isAnimating } = useAnimationControl();

  const { pan, setPan, isPanning, isMomentumActive, resetPan, eventHandlers } =
    useCanvasPan(activeId);

  const { scale, handleWheel } = useCanvasZoom(pan, setPan);

  const ducks: IDuckItem[] = Array.from({ length: 500 }, (_, i) => ({
    id: `n${i}`,
    x: (i % 25) * 280, // 250px width + 30px gap
    y: Math.floor(i / 25) * 280, // 250px height + 30px gap
    w: 250,
    h: 250,
    label: `Duck ${i + 1}`,
    image: "/body.png",
  }));

  const { visibleItems } = useCanvasVirtualization(ducks, pan, scale, () =>
    containerReady() ? container : undefined,
  );

  createEffect(() => {
    const currentId = activeId();
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
        "fixed top-0 z-500 h-full w-full touch-none select-none overflow-hidden bg-purple-700",
        {
          "cursor-grab": !activeId() && !isPanning(),
          "cursor-grabbing": isPanning(),
          "cursor-default": activeId(),
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
              onClick={setActiveId}
              isAnimating={isAnimating()}
            />
          )}
        </For>
      </div>

      <DuckInfoModal
        open={activeId() !== null}
        onClose={() => setActiveId(null)}
        duckName="SuperVespa"
        creator="GoodWay"
        birthday="11 October 2015"
        likes={100}
        dislikes={10}
        rank={1}
      />

      <div class="fixed bottom-2 left-2 rounded-md bg-black/40 px-1.5 py-1 font-mono text-xs opacity-60">
        <DebugOverlay
          pan={pan()}
          scale={scale()}
          visibleCount={visibleItems().length}
          totalCount={ducks.length}
          isMomentumActive={isMomentumActive()}
          activeId={activeId()}
        />
      </div>
    </div>
  );
};
