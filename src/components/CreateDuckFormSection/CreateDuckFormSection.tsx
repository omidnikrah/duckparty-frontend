import { createMemo, createSignal, Show } from "solid-js";
import { usePostAuthAnonymous, usePostDuck } from "@/api/generated/endpoints";
import { Button, ErrorMessage, FormInput } from "@/components";
import {
  getUserData,
  isUserLoggedIn,
  mergeImagesFromPaths,
  setAuthToken,
  setUserData,
} from "@/helpers";
import { useAppearanceStore } from "@/stores/appearanceStore";
import type { TAppearanceState } from "@/types/appearance";
import { useDuckForm } from "./useDuckForm.hook";

interface CreateDuckFormSectionProps {
  onChangeStyleClick?: () => void;
  onDuckCreated?: (duckData: {
    name: string;
    email?: string;
    ownerName: string;
    appearance: TAppearanceState;
  }) => void;
}

export const CreateDuckFormSection = (props: CreateDuckFormSectionProps) => {
  const isLoggedIn = isUserLoggedIn();

  const appearanceStore = useAppearanceStore();
  const [isCreatingDuck, setIsCreatingDuck] = createSignal(false);
  const { formState, updateField, getFieldError, markFieldAsTouched } =
    useDuckForm(isLoggedIn);

  const duckMutation = usePostDuck();
  const anonymousUserMutation = usePostAuthAnonymous();

  const isLoading = createMemo(() => {
    return (!isLoggedIn && anonymousUserMutation.isPending) || isCreatingDuck();
  });

  const getCreatorName = () => formState().data.creatorName.trim();
  const getDuckName = () => formState().data.name.trim();

  const handleCreateAnonymousUser = async () => {
    const response = await anonymousUserMutation.mutateAsync({
      data: {
        name: getCreatorName(),
      },
    });

    if (response?.token && response?.user) {
      setAuthToken(response.token);
      setUserData(response.user);
    }
  };

  const handleCreateDuck = async () => {
    const appearance = appearanceStore.state();
    const duckImage = await mergeImagesFromPaths([
      `/skins/original/${appearance.selectedSkin}.png`,
      ...appearance.selectedAccessories.map(
        (accessory) => `/accessories/original/${accessory}.png`,
      ),
    ]);

    await duckMutation.mutateAsync({
      data: {
        name: getDuckName(),
        appearance: JSON.stringify(appearance),
        image: duckImage,
      },
    });

    setIsCreatingDuck(false);

    const userData = getUserData();
    props.onDuckCreated?.({
      name: getDuckName(),
      email: isLoggedIn ? userData?.email : undefined,
      ownerName: getCreatorName(),
      appearance,
    });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!formState().isValid) {
      return;
    }

    try {
      setIsCreatingDuck(true);
      if (!isLoggedIn) {
        await handleCreateAnonymousUser();
      }
      await handleCreateDuck();
    } catch (error) {
      console.error("Failed to create duck:", error);
    } finally {
      setIsCreatingDuck(false);
    }
  };

  const handleShowAppearanceSelector = () => {
    props.onChangeStyleClick?.();
  };

  return (
    <div class="spring-transition absolute inset-0 z-10 flex h-fit w-[500px] flex-col items-center justify-center gap-20 justify-self-center font-family-carter">
      <form class="flex w-full flex-col gap-10" onSubmit={handleSubmit}>
        <FormInput
          id="duck-name"
          name="name"
          type="text"
          placeholder="Duck name"
          value={formState().data.name}
          error={getFieldError("name")}
          required
          onInput={(value) => updateField("name", value)}
          onBlur={() => markFieldAsTouched("name")}
        />

        <Show when={!isLoggedIn}>
          <FormInput
            id="owner-name"
            name="ownerName"
            type="text"
            placeholder="Creator name"
            value={formState().data.creatorName}
            error={getFieldError("creatorName")}
            required
            onInput={(value) => updateField("creatorName", value)}
            onBlur={() => markFieldAsTouched("creatorName")}
          />
        </Show>

        <Show when={anonymousUserMutation.isError}>
          <ErrorMessage>
            {anonymousUserMutation.error?.response?.data?.error}
          </ErrorMessage>
        </Show>
        <Show when={duckMutation.isError}>
          <ErrorMessage>
            {duckMutation.error?.response?.data?.error}
          </ErrorMessage>
        </Show>
      </form>

      <div class="flex w-full flex-row gap-4">
        <button
          class="w-full rounded-full bg-gray-200 p-5 text-gray-400 text-xl transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={handleShowAppearanceSelector}
        >
          Change Style
        </button>

        <Button
          type="submit"
          disabled={!formState().isValid || isLoading()}
          isLoading={isLoading()}
          onClick={handleSubmit}
        >
          Jump into the party
        </Button>
      </div>
    </div>
  );
};
