import clsx from "clsx";
import { createEffect, createMemo, createSignal, Show } from "solid-js";
import { twMerge } from "tailwind-merge";
import {
  usePostAuth,
  usePostAuthVerify,
  usePostUserSetEmail,
  usePostUserVerifySetEmail,
} from "@/api/generated/endpoints";
import { Button, ErrorMessage, FormInput } from "@/components";
import { setAuthToken, setUserData } from "@/helpers";
import { useLoginForm } from "./useLoginForm.hook";

enum AuthStep {
  EMAIL = "email",
  VERIFICATION = "verification",
}

interface LoginFormProps {
  onLoginSuccess?: (userData: { ID?: string | number }) => void;
  mode?: "login" | "set-email";
  class?: string;
}

export const LoginForm = (props: LoginFormProps) => {
  const {
    formState,
    updateField,
    getFieldError,
    markFieldAsTouched,
    isValidForVerification,
  } = useLoginForm();

  const [authStep, setAuthStep] = createSignal<AuthStep>(AuthStep.EMAIL);
  const isSetEmailMode = createMemo(() => props.mode === "set-email");

  // Select mutations based on mode
  const loginEmailMutation = usePostAuth();
  const loginVerifyMutation = usePostAuthVerify();
  const setEmailMutation = usePostUserSetEmail();
  const setEmailVerifyMutation = usePostUserVerifySetEmail();

  const emailMutation = createMemo(() =>
    isSetEmailMode() ? setEmailMutation : loginEmailMutation,
  );
  const verificationMutation = createMemo(() =>
    isSetEmailMode() ? setEmailVerifyMutation : loginVerifyMutation,
  );

  const isLoading = createMemo(() => {
    return emailMutation().isPending || verificationMutation().isPending;
  });

  const getButtonText = () => {
    if (authStep() === AuthStep.EMAIL) {
      return "Send Code";
    }
    return "Verify";
  };

  createEffect(() => {
    const { data } = verificationMutation();
    if (data?.token && data?.user) {
      setAuthToken(data.token);
      setUserData(data.user);
      props.onLoginSuccess?.(data.user);
    }
  });

  const getEmail = () => formState().data.email.trim();
  const getVerificationCode = () => formState().data.verificationCode.trim();

  const handleEmailAuth = async () => {
    await emailMutation().mutateAsync({
      data: {
        email: getEmail(),
      },
    });
    setAuthStep(AuthStep.VERIFICATION);
  };

  const handleVerification = async () => {
    await verificationMutation().mutateAsync({
      data: {
        email: getEmail(),
        otp: getVerificationCode(),
      },
    });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const currentStep = authStep();

    try {
      if (currentStep === AuthStep.EMAIL) {
        if (!formState().isValid) {
          return;
        }
        await handleEmailAuth();
      } else if (
        currentStep === AuthStep.VERIFICATION &&
        getVerificationCode()
      ) {
        if (!isValidForVerification()) {
          return;
        }
        await handleVerification();
      }
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  return (
    <div
      class={twMerge(
        clsx(
          "spring-transition absolute inset-0 z-10 flex h-fit w-[500px] flex-col items-center justify-center gap-20 justify-self-center",
          props.class,
        ),
      )}
    >
      <form
        class="flex w-full flex-col gap-10 font-family-carter"
        onSubmit={handleSubmit}
      >
        <Show when={!emailMutation().data}>
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

        <Show when={!!emailMutation().data && !emailMutation().isPending}>
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

        <Show when={emailMutation().isError}>
          <ErrorMessage>
            {emailMutation().error?.response?.data?.error}
          </ErrorMessage>
        </Show>
        <Show when={verificationMutation().isError}>
          <ErrorMessage>
            {verificationMutation().error?.response?.data?.error}
          </ErrorMessage>
        </Show>
      </form>

      <Button
        type="submit"
        disabled={
          (authStep() === AuthStep.EMAIL && !formState().isValid) ||
          (authStep() === AuthStep.VERIFICATION && !isValidForVerification()) ||
          isLoading()
        }
        isLoading={isLoading()}
        onClick={handleSubmit}
      >
        {getButtonText()}
      </Button>

      <Show when={authStep() === AuthStep.VERIFICATION}>
        <p class="text-center font-family-modak text-purple-700 text-xl">
          We sent a code to your email to confirm it’s yours.
        </p>
      </Show>
    </div>
  );
};
