import type { AxiosError } from "axios";
import { createEffect, createMemo, createSignal, Show } from "solid-js";
import {
  usePostAuth,
  usePostAuthVerify,
  usePostDuck,
} from "@/api/generated/endpoints";
import type { PostAuth400 } from "@/api/generated/schemas";
import { ErrorMessage } from "@/components/ErrorMessage";
import { FormInput } from "@/components/FormInput";
import { mergeImagesFromPaths, setAuthToken } from "@/helpers";
import { useAppearanceStore } from "@/stores/appearanceStore";
import type { TAppearanceState } from "@/types/appearance";
import { useDuckForm } from "./useDuckForm.hook";

interface CreateDuckFormSectionProps {
  onChangeStyleClick?: () => void;
  onDuckCreated?: (duckData: {
    name: string;
    email: string;
    appearance: TAppearanceState;
  }) => void;
}

enum AuthStep {
  EMAIL = "email",
  VERIFICATION = "verification",
}

export const CreateDuckFormSection = (props: CreateDuckFormSectionProps) => {
  const { formState, updateField, getFieldError, markFieldAsTouched } =
    useDuckForm();

  const appearanceStore = useAppearanceStore();
  const [authStep, setAuthStep] = createSignal<AuthStep>(AuthStep.EMAIL);

  const authMutation = usePostAuth();
  const verificationMutation = usePostAuthVerify();
  const duckMutation = usePostDuck();

  const isLoading = createMemo(() => {
    return (
      authMutation.isPending ||
      verificationMutation.isPending ||
      duckMutation.isPending
    );
  });

  const getButtonText = () => {
    if (authStep() === AuthStep.EMAIL) {
      return "Create Duck";
    }
    return "Jump into the party";
  };

  createEffect(() => {
    const token = verificationMutation.data?.token;
    if (token) {
      setAuthToken(token);
    }
  });

  const getEmail = () => formState().data.email.trim();
  const getDuckName = () => formState().data.name.trim();
  const getVerificationCode = () => formState().data.verificationCode.trim();

  const handleEmailAuth = async () => {
    await authMutation.mutateAsync({
      data: {
        email: getEmail(),
      },
    });
    setAuthStep(AuthStep.VERIFICATION);
  };

  const handleVerification = async () => {
    await verificationMutation.mutateAsync({
      data: {
        email: getEmail(),
        otp: getVerificationCode(),
      },
    });
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
        email: getEmail(),
        appearance: JSON.stringify(appearance),
        image: duckImage,
      },
    });

    props.onDuckCreated?.({
      name: getDuckName(),
      email: getEmail(),
      appearance,
    });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!formState().isValid) {
      return;
    }

    try {
      const currentStep = authStep();

      if (currentStep === AuthStep.EMAIL) {
        await handleEmailAuth();
      } else if (currentStep === AuthStep.VERIFICATION) {
        await handleVerification();
        await handleCreateDuck();
      }
    } catch (error) {
      console.error("Failed to create duck:", error);
    } finally {
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
          placeholder="Enter your cool duck name"
          value={formState().data.name}
          error={getFieldError("name")}
          required
          onInput={(value) => updateField("name", value)}
          onBlur={() => markFieldAsTouched("name")}
        />

        <Show when={!authMutation.data}>
          <FormInput
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formState().data.email}
            error={getFieldError("email")}
            required
            onInput={(value) => updateField("email", value)}
            onBlur={() => markFieldAsTouched("email")}
          />
        </Show>

        <Show when={!!authMutation.data && !authMutation.isPending}>
          <FormInput
            id="verification-code"
            name="verificationCode"
            type="text"
            placeholder="Enter your verification code"
            value={formState().data.verificationCode}
            error={getFieldError("verificationCode")}
            required
            onInput={(value) => updateField("verificationCode", value)}
            onBlur={() => markFieldAsTouched("verificationCode")}
          />
        </Show>

        <Show when={authMutation.isError}>
          <ErrorMessage>
            {authMutation.error?.response?.data?.error}
          </ErrorMessage>
        </Show>
        <Show when={verificationMutation.isError}>
          <ErrorMessage>
            {verificationMutation.error?.response?.data?.error}
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

        <button
          class="w-full rounded-full bg-primary p-5 text-white text-xl transition-transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={!formState().isValid || isLoading()}
          onClick={handleSubmit}
        >
          {isLoading() ? "Creating..." : getButtonText()}
        </button>
      </div>
    </div>
  );
};
