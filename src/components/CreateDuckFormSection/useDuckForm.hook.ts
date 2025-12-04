import { createMemo, createSignal } from "solid-js";
import type {
  TDuckFormData,
  TFormErrors,
  TFormState,
} from "./CreateDuckFormSection.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN_LENGTH = 5;
const NAME_MAX_LENGTH = 25;

const validateName = (name: string): string | undefined => {
  if (!name.trim()) {
    return "Duck name is required";
  }
  if (name.trim().length < NAME_MIN_LENGTH) {
    return `Duck name must be at least ${NAME_MIN_LENGTH} characters`;
  }
  if (name.trim().length > NAME_MAX_LENGTH) {
    return `Duck name must be no more than ${NAME_MAX_LENGTH} characters`;
  }
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(name.trim())) {
    return "Duck name can only contain letters, numbers, spaces, hyphens, and underscores";
  }
  return undefined;
};

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return "Email is required";
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return "Please enter a valid email address";
  }
  return undefined;
};

const validateVerificationCode = (
  verificationCode: string,
): string | undefined => {
  if (!verificationCode.trim()) {
    return "Verification code is required";
  }
  return undefined;
};

export const useDuckForm = (isLoggedIn: boolean = false) => {
  const [formData, setFormData] = createSignal<TDuckFormData>({
    name: "",
    email: "",
    verificationCode: "",
  });

  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [touchedFields, setTouchedFields] = createSignal<
    Set<keyof TDuckFormData>
  >(new Set());

  const errors = createMemo<TFormErrors>(() => {
    const data = formData();
    const touched = touchedFields();
    return {
      name: touched.has("name") ? validateName(data.name) : undefined,
      email:
        !isLoggedIn && touched.has("email")
          ? validateEmail(data.email)
          : undefined,
      verificationCode:
        !isLoggedIn && touched.has("verificationCode")
          ? validateVerificationCode(data.verificationCode)
          : undefined,
    };
  });

  const isValid = createMemo(() => {
    const data = formData();
    if (isLoggedIn) {
      return !validateName(data.name);
    }
    return !validateName(data.name) && !validateEmail(data.email);
  });

  const formState = createMemo<TFormState>(() => ({
    data: formData(),
    errors: errors(),
    isSubmitting: isSubmitting(),
    isValid: isValid(),
  }));

  const updateField = (field: keyof TDuckFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const getFieldError = (field: keyof TDuckFormData): string | undefined => {
    return errors()[field];
  };

  const markFieldAsTouched = (field: keyof TDuckFormData) => {
    setTouchedFields((prev) => new Set([...prev, field]));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      verificationCode: "",
    });
    setTouchedFields(new Set<keyof TDuckFormData>());
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
