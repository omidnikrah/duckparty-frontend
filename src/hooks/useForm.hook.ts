import { createMemo, createSignal } from "solid-js";

type Validator<T> = (value: T) => string | undefined;
type FieldConfig<T extends Record<string, any>> = {
  [K in keyof T]?: {
    validator?: Validator<T[K]>;
    shouldValidate?: (data: T) => boolean;
  };
};

interface UseFormOptions<T extends Record<string, any>> {
  initialData: T;
  fieldConfig: FieldConfig<T>;
  isValidFn?: (
    data: T,
    errors: Partial<Record<keyof T, string | undefined>>,
  ) => boolean;
}

export const useForm = <T extends Record<string, any>>(
  options: UseFormOptions<T>,
) => {
  const { initialData, fieldConfig, isValidFn } = options;

  const [formData, setFormData] = createSignal<T>(initialData);
  const [touchedFields, setTouchedFields] = createSignal<Set<keyof T>>(
    new Set(),
  );

  const errors = createMemo<Partial<Record<keyof T, string | undefined>>>(
    () => {
      const data = formData();
      const touched = touchedFields();
      const result: Partial<Record<keyof T, string | undefined>> = {};

      for (const field in fieldConfig) {
        const config = fieldConfig[field];
        if (!config) continue;

        const validator = config.validator;
        if (!validator) continue;

        if (!touched.has(field)) continue;

        const conditionMet = config.shouldValidate
          ? config.shouldValidate(data)
          : true;

        if (conditionMet) {
          result[field] = validator(data[field]);
        }
      }

      return result;
    },
  );

  const isValid = createMemo(() => {
    if (isValidFn) {
      return isValidFn(formData(), errors());
    }

    return Object.values(errors()).every((error) => !error);
  });

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getFieldError = (field: keyof T): string | undefined => {
    return errors()[field];
  };

  const markFieldAsTouched = (field: keyof T) => {
    setTouchedFields((prev) => new Set([...prev, field]));
  };

  const resetForm = () => {
    setFormData(() => ({ ...initialData }) as T);
    setTouchedFields(new Set<keyof T>());
  };

  return {
    formData,
    errors,
    isValid,
    updateField,
    getFieldError,
    markFieldAsTouched,
    resetForm,
  };
};
