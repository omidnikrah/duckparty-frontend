export interface TDuckFormData {
  name: string;
  email: string;
}

export interface TFormErrors {
  name?: string;
  email?: string;
}

export interface TFormState {
  data: TDuckFormData;
  errors: TFormErrors;
  isSubmitting: boolean;
  isValid: boolean;
}
