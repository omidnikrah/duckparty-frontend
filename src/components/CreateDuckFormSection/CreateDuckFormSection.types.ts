export interface TDuckFormData {
  name: string;
  creatorName: string;
}

export interface TFormErrors {
  name?: string;
  creatorName?: string;
}

export interface TFormState {
  data: TDuckFormData;
  errors: TFormErrors;
  isSubmitting: boolean;
  isValid: boolean;
}
