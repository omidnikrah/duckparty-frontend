import { ErrorMessage } from "@/components";

interface FormInputProps {
  id: string;
  name: string;
  type?: "text" | "email" | "password";
  placeholder: string;
  value: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onInput: (value: string) => void;
  onBlur?: () => void;
  class?: string;
}

export const FormInput = (props: FormInputProps) => {
  const hasError = () => !!props.error;

  const baseClasses =
    "w-full rounded-full border-5 bg-gray-100 p-5 text-center text-2xl transition-colors placeholder:text-gray-400 focus:outline-none not-placeholder-shown:text-primary autofill:[-webkit-text-fill-color:theme(colors.primary)]";
  const errorClasses =
    "border-red-500 text-red-500 focus:border-red-500 focus:text-red-500 not-placeholder-shown:text-red-500";
  const normalClasses =
    "border-gray text-gray-400 focus:border-primary focus:text-primary not-placeholder-shown:text-primary";

  const inputClasses = () => {
    const classes = [baseClasses];
    if (hasError()) {
      classes.push(errorClasses);
    } else {
      classes.push(normalClasses);
    }
    if (props.class) {
      classes.push(props.class);
    }
    return classes.join(" ");
  };

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    props.onInput(target.value);
  };

  return (
    <div class="flex flex-col gap-2">
      <input
        id={props.id}
        name={props.name}
        type={props.type || "text"}
        placeholder={props.placeholder}
        value={props.value}
        disabled={props.disabled}
        required={props.required}
        class={inputClasses()}
        onInput={handleInput}
        onBlur={props.onBlur}
        aria-invalid={hasError()}
        aria-describedby={hasError() ? `${props.id}-error` : undefined}
      />
      {hasError() && (
        <ErrorMessage id={`${props.id}-error`}>{props.error}</ErrorMessage>
      )}
    </div>
  );
};
