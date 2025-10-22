import { FormInput } from "@/components/FormInput";
import { useAppearanceStore } from "@/stores/appearanceStore";
import type { TAppearanceState } from "@/types/appearance";
import { useDuckForm } from "./useDuckForm.hook";

interface CreateDuckFormSectionProps {
  onChangeStyleClick?: () => void;
  onDuckCreated?: (duckData: {
    name: string;
    email: string;
    appearance: TAppearanceState;
  }) => void;
}

export const CreateDuckFormSection = (props: CreateDuckFormSectionProps) => {
  const {
    formState,
    updateField,
    getFieldError,
    markFieldAsTouched,
    setIsSubmitting,
  } = useDuckForm();

  const appearanceStore = useAppearanceStore();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!formState().isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const duckData = {
        name: formState().data.name.trim(),
        email: formState().data.email.trim(),
        appearance: appearanceStore.state(),
      };

      props.onDuckCreated?.(duckData);
    } catch (error) {
      console.error("Failed to create duck:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowAppearanceSelector = () => {
    props.onChangeStyleClick?.();
  };

  return (
    <div class="spring-transition absolute inset-0 z-10 flex h-fit w-[500px] flex-col items-center justify-center gap-20 justify-self-center font-family-carter">
      <form class="flex w-full flex-col gap-10" onSubmit={handleSubmit}>
        <FormInput
          id="duck-name"
          name="name"
          type="text"
          placeholder="Enter your cool duck name"
          value={formState().data.name}
          error={getFieldError("name")}
          required
          onInput={(value) => updateField("name", value)}
          onBlur={() => markFieldAsTouched("name")}
        />

        <FormInput
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formState().data.email}
          error={getFieldError("email")}
          required
          onInput={(value) => updateField("email", value)}
          onBlur={() => markFieldAsTouched("email")}
        />
      </form>

      <div class="flex w-full flex-row gap-4">
        <button
          class="w-full rounded-full bg-gray-200 p-5 text-gray-400 text-xl transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={handleShowAppearanceSelector}
        >
          Change Style
        </button>

        <button
          class="w-full rounded-full bg-primary p-5 text-white text-xl transition-transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={!formState().isValid || formState().isSubmitting}
          onClick={handleSubmit}
        >
          {formState().isSubmitting ? "Creating..." : "Jump into the party"}
        </button>
      </div>
    </div>
  );
};
