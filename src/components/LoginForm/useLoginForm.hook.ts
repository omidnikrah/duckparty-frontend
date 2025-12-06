import { createMemo } from "solid-js";
import {
  validateEmail,
  validateVerificationCode,
} from "@/helpers/form-validation.helper";
import { useForm } from "@/hooks/useForm.hook";

interface TLoginFormData {
  email: string;
  verificationCode: string;
}

interface TLoginFormErrors {
  email?: string;
  verificationCode?: string;
}

interface TLoginFormState {
  data: TLoginFormData;
  errors: TLoginFormErrors;
  isValid: boolean;
}

export const useLoginForm = () => {
  const {
    formData,
    errors,
    isValid,
    updateField,
    getFieldError,
    markFieldAsTouched,
    resetForm,
  } = useForm<TLoginFormData>({
    initialData: {
      email: "",
      verificationCode: "",
    },
    fieldConfig: {
      email: {
        validator: validateEmail,
      },
      verificationCode: {
        validator: validateVerificationCode,
      },
    },
    isValidFn: (data) => !validateEmail(data.email),
  });

  const isValidForVerification = createMemo(() => {
    const data = formData();
    return (
      !validateEmail(data.email) &&
      !validateVerificationCode(data.verificationCode)
    );
  });

  const formState = createMemo<TLoginFormState>(() => ({
    data: formData(),
    errors: errors() as TLoginFormErrors,
    isValid: isValid(),
  }));

  return {
    formState,
    updateField,
    resetForm,
    getFieldError,
    markFieldAsTouched,
    isValidForVerification,
  };
};
