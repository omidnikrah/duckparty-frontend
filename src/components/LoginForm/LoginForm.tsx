import { createEffect, createMemo, createSignal, Show } from "solid-js";
import {
  usePostAuth,
  usePostAuthVerify,
} from "@/api/generated/endpoints";
import { Button, ErrorMessage, FormInput } from "@/components";
import {
  setAuthToken,
  setUserData,
} from "@/helpers";
import { useLoginForm } from "./useLoginForm.hook";

enum AuthStep {
  EMAIL = "email",
  VERIFICATION = "verification",
}

interface LoginFormProps {
  onLoginSuccess?: (userData: { ID?: string | number }) => void;
}

export const LoginForm = (props: LoginFormProps) => {
  const { formState, updateField, getFieldError, markFieldAsTouched, isValidForVerification } =
    useLoginForm();

  const [authStep, setAuthStep] = createSignal<AuthStep>(AuthStep.EMAIL);

  const authMutation = usePostAuth();
  const verificationMutation = usePostAuthVerify();

  const isLoading = createMemo(() => {
    return authMutation.isPending || verificationMutation.isPending;
  });

  const getButtonText = () => {
    if (authStep() === AuthStep.EMAIL) {
      return "Send Code";
    }
    return "Verify";
  };

  createEffect(() => {
    const token = verificationMutation.data?.token;
    const user = verificationMutation.data?.user;
    if (token && user) {
      setAuthToken(token);
      setUserData(user);
      props.onLoginSuccess?.(user);
    }
  });

  const getEmail = () => formState().data.email.trim();
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
    <div class="spring-transition absolute inset-0 z-10 flex h-fit w-[500px] flex-col items-center justify-center gap-20 justify-self-center font-family-carter">
      <form class="flex w-full flex-col gap-10" onSubmit={handleSubmit}>
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

        <Show
          when={!!authMutation.data && !authMutation.isPending}
        >
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
    </div>
  );
};

