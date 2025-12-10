import { createSignal, onCleanup, onMount } from "solid-js";
import { SocketEvent } from "@/types/socket";

const MAX_RETRY_COUNT = 5;

export type SocketEventMap = Partial<Record<SocketEvent, unknown>>;

export interface UseSocketOptions<
  TEvents extends SocketEventMap = SocketEventMap,
> {
  events: SocketEvent[];
  handler: <K extends keyof TEvents>(event: K, payload: TEvents[K]) => void;
}

interface SocketMessage {
  type: SocketEvent;
  data: unknown;
}

export const useSocket = <TEvents extends SocketEventMap = SocketEventMap>(
  options: UseSocketOptions<TEvents>,
) => {
  const { events, handler } = options;
  const [socket, setSocket] = createSignal<WebSocket | null>(null);
  const [isConnected, setIsConnected] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);
  const [readyState, setReadyState] = createSignal<number>(
    WebSocket.CONNECTING,
  );

  let reconnectTimeoutId: number | null = null;
  let retryCount = 0;

  const eventsSet = new Set(events);

  const attemptReconnect = () => {
    if (reconnectTimeoutId !== null) {
      return;
    }

    if (retryCount >= MAX_RETRY_COUNT) {
      setError(
        new Error(
          `WebSocket connection failed after ${MAX_RETRY_COUNT} retry attempts`,
        ),
      );
      return;
    }

    retryCount += 1;
    reconnectTimeoutId = window.setTimeout(() => {
      reconnectTimeoutId = null;
      connect();
    }, 1000);
  };

  const handleMessage = (event: MessageEvent) => {
    try {
      let message: SocketMessage;
      const rawData = event.data;

      if (typeof rawData === "string") {
        try {
          message = JSON.parse(rawData) as SocketMessage;
        } catch {
          message = { type: SocketEvent.ERROR, data: rawData };
        }
      } else {
        message = { type: SocketEvent.ERROR, data: rawData };
      }

      const eventType = message.type;

      if (!eventsSet.has(eventType)) {
        return;
      }

      const eventPayload = message.data;

      try {
        handler(
          eventType as keyof TEvents,
          eventPayload as TEvents[keyof TEvents],
        );
      } catch (err) {
        console.error(`Error in socket event handler for "${eventType}":`, err);
      }
    } catch (err) {
      console.error("Error processing socket message:", err);
    }
  };

  const connect = () => {
    try {
      const url = import.meta.env.VITE_WS_URL;
      const newSocket = new WebSocket(url);

      newSocket.onopen = () => {
        setIsConnected(true);
        setReadyState(newSocket.readyState);
        setError(null);
        retryCount = 0;
      };

      newSocket.onclose = (event) => {
        setIsConnected(false);
        setReadyState(newSocket.readyState);

        if (event.code !== 1000) {
          setError(
            new Error(
              `WebSocket closed with code ${event.code}: ${event.reason || "Unknown reason"}`,
            ),
          );
        }

        attemptReconnect();
      };

      newSocket.onerror = () => {
        const error = new Error("WebSocket connection error");
        setError(error);
        setIsConnected(false);
        setReadyState(newSocket.readyState);
      };

      newSocket.onmessage = handleMessage;

      setSocket(newSocket);
      setReadyState(newSocket.readyState);
      return newSocket;
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to create WebSocket connection");
      setError(error);
      throw error;
    }
  };

  onMount(() => {
    connect();
  });

  onCleanup(() => {
    if (reconnectTimeoutId !== null) {
      clearTimeout(reconnectTimeoutId);
      reconnectTimeoutId = null;
    }

    const currentSocket = socket();
    if (currentSocket) {
      currentSocket.close();
      setSocket(null);
      setIsConnected(false);
      setReadyState(WebSocket.CLOSED);
    }
  });

  return {
    socket,
    isConnected,
    error,
    readyState,
  };
};
