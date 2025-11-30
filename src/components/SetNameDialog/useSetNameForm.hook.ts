import { createMemo, createSignal } from "solid-js";

const NAME_MIN_LENGTH = 3;
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

export const useSetNameForm = () => {
  const [name, setName] = createSignal("");
  const [isTouched, setIsTouched] = createSignal(false);

  const error = createMemo(() => {
    return isTouched() ? validateName(name()) : undefined;
  });

  const isValid = createMemo(() => {
    return !validateName(name());
  });

  const updateName = (value: string) => {
    setName(value);
  };

  const markAsTouched = () => {
    setIsTouched(true);
  };

  const resetForm = () => {
    setName("");
    setIsTouched(false);
  };

  return {
    name,
    error,
    isValid,
    updateName,
    markAsTouched,
    resetForm,
  };
};
