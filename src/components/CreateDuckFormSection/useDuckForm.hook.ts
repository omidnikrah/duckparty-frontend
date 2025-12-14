import { createMemo, createSignal } from "solid-js";
import { validateCreatorName, validateName } from "@/helpers";
import { useForm } from "@/hooks";
import type {
  TDuckFormData,
  TFormErrors,
  TFormState,
} from "./CreateDuckFormSection.types";

export const useDuckForm = (isLoggedIn: boolean = false) => {
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
      creatorName: "",
    },
    fieldConfig: {
      name: {
        validator: validateName,
      },
      creatorName: {
        validator: validateName,
      },
    },
    isValidFn: (data) => {
      if (isLoggedIn) {
        return !validateName(data.name);
      }
      return !validateName(data.name) && !validateCreatorName(data.creatorName);
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
      case "creatorName":
        return validateName(data.creatorName);
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
