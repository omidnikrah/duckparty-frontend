import { createMemo, createSignal } from "solid-js";
import {
  validateEmail,
  validateName,
  validateVerificationCode,
} from "@/helpers";
import { useForm } from "@/hooks";
import type {
  TDuckFormData,
  TFormErrors,
  TFormState,
} from "./CreateDuckFormSection.types";

export const useDuckForm = (
  isLoggedIn: boolean = false,
  isVerification: boolean = false,
) => {
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const {
    formData,
    errors,
    isValid,
    updateField,
    getFieldError,
    markFieldAsTouched,
    resetForm,
  } = useForm<TDuckFormData>({
    initialData: {
      name: "",
      email: "",
      verificationCode: "",
    },
    fieldConfig: {
      name: {
        validator: validateName,
      },
      email: {
        validator: validateEmail,
        shouldValidate: () => !isLoggedIn,
      },
      verificationCode: {
        validator: validateVerificationCode,
        shouldValidate: () => !isLoggedIn,
      },
    },
    isValidFn: (data) => {
      if (isLoggedIn) {
        return !validateName(data.name);
      }
      return (
        !validateName(data.name) &&
        !validateEmail(data.email) &&
        (isVerification
          ? !validateVerificationCode(data.verificationCode)
          : true)
      );
    },
  });

  const formState = createMemo<TFormState>(() => ({
    data: formData(),
    errors: errors() as TFormErrors,
    isSubmitting: isSubmitting(),
    isValid: isValid(),
  }));

  const validateField = (field: keyof TDuckFormData): string | undefined => {
    const data = formData();
    switch (field) {
      case "name":
        return validateName(data.name);
      case "email":
        return validateEmail(data.email);
      default:
        return undefined;
    }
  };

  const hasFieldError = (field: keyof TDuckFormData): boolean => {
    return !!errors()[field];
  };

  return {
    formState,
    updateField,
    resetForm,
    validateField,
    hasFieldError,
    getFieldError,
    markFieldAsTouched,
    setIsSubmitting,
  };
};
