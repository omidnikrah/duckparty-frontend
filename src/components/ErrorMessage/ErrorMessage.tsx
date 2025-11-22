import type { JSX } from "solid-js/jsx-runtime";

interface ErrorMessageProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
}

export const ErrorMessage = (props: ErrorMessageProps) => {
  return (
    <div
      {...props}
      class="text-center text-red-500 text-sm"
      role="alert"
      aria-live="polite"
    >
      {props.children}
    </div>
  );
};
