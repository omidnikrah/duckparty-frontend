export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NAME_MIN_LENGTH = 5;
export const NAME_MAX_LENGTH = 25;

export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return "Email is required";
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return "Please enter a valid email address";
  }
  return undefined;
};

export const validateVerificationCode = (
  verificationCode: string,
): string | undefined => {
  if (!verificationCode.trim()) {
    return "Verification code is required";
  }
  return undefined;
};

export const validateName = (
  name: string,
  minLength: number = NAME_MIN_LENGTH,
  maxLength: number = NAME_MAX_LENGTH,
): string | undefined => {
  if (!name.trim()) {
    return "Duck name is required";
  }
  if (name.trim().length < minLength) {
    return `Duck name must be at least ${minLength} characters`;
  }
  if (name.trim().length > maxLength) {
    return `Duck name must be no more than ${maxLength} characters`;
  }
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(name.trim())) {
    return "Duck name can only contain letters, numbers, spaces, hyphens, and underscores";
  }
  return undefined;
};

export const validateCreatorName = (
  creatorName: string,
  minLength: number = NAME_MIN_LENGTH,
  maxLength: number = NAME_MAX_LENGTH,
): string | undefined => {
  if (!creatorName.trim()) {
    return "Creator name is required";
  }
  if (creatorName.trim().length < minLength) {
    return `Creator name must be at least ${minLength} characters`;
  }
  if (creatorName.trim().length > maxLength) {
    return `Creator name must be no more than ${maxLength} characters`;
  }
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(creatorName.trim())) {
    return "Creator name can only contain letters, numbers, spaces, hyphens, and underscores";
  }
  return undefined;
};
