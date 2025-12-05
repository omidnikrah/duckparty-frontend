import { createEffect, createSignal, type JSX, Show } from "solid-js";
import type { DuckResponse } from "@/api/generated/schemas";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { blobToDataURL, blobToObjectURL, generateSocialCard } from "@/helpers";

interface IShareDuckModalProps {
  open: boolean;
  onClose: () => void;
  data: DuckResponse;
}

export const ShareDuckModal = (props: IShareDuckModalProps): JSX.Element => {
  const [socialCardUrl, setSocialCardUrl] = createSignal<string | null>(null);
  const [socialCardBlob, setSocialCardBlob] = createSignal<Blob | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);
  const [hasError, setHasError] = createSignal(false);

  const generateCard = async () => {
    if (
      !props.data.image ||
      !props.data.name ||
      !props.data.owner?.display_name
    ) {
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setSocialCardUrl(null);
    setSocialCardBlob(null);

    try {
      const blob = await generateSocialCard(
        props.data.image,
        props.data.name,
        props.data.owner?.display_name,
      );
      const dataUrl = await blobToDataURL(blob);
      setSocialCardUrl(dataUrl);
      setSocialCardBlob(blob);
    } catch (error) {
      console.error("Failed to generate social card:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = socialCardBlob();
    if (!blob) return;

    const url = blobToObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `duck-social-card-${props.data.name ?? "duck"}.jpg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  createEffect(() => {
    if (
      props.open &&
      props.data.image &&
      props.data.name &&
      props.data.owner?.display_name
    ) {
      generateCard();
    } else if (!props.open) {
      setSocialCardUrl(null);
      setSocialCardBlob(null);
      setIsLoading(false);
      setHasError(false);
    }
  });

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      ariaLabel="Share your duck"
      contentClass="items-center p-10"
    >
      <p class="text-center text-2xl text-purple-700">
        Share your duck and farm some Quacks, climb the Duckboard and secure
        your spot.
      </p>

      <div class="relative aspect-square w-full max-w-[50dvh] rounded-3xl bg-gray-100">
        <Show
          when={!isLoading() && socialCardUrl()}
          fallback={
            <div class="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
              <Show
                when={hasError()}
                fallback={
                  <span class="text-lg text-purple-700">
                    Generating social card...
                  </span>
                }
              >
                <span class="text-center text-error text-lg">
                  Failed to generate social card
                </span>
                <Button onClick={generateCard} class="w-auto px-6 py-3">
                  Try Again
                </Button>
              </Show>
            </div>
          }
        >
          <img
            src={socialCardUrl() ?? ""}
            alt={`${props.data.name ?? "Duck"} by ${props.data.owner?.display_name ?? "Creator"}`}
            class="h-full w-full rounded-3xl object-contain shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
          />
        </Show>
      </div>

      <Button
        onClick={handleDownload}
        disabled={!socialCardUrl() || isLoading()}
        class="w-auto px-10 py-5"
      >
        Grab Your Duck
      </Button>
    </Modal>
  );
};
