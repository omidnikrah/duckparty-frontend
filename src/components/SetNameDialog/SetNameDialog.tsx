import {
  getGetUserQueryKey,
  usePutUserChangeName,
} from "@/api/generated/endpoints";
import { queryClient } from "@/api/query-client";
import { FormInput } from "@/components";
import { useSetNameForm } from "./useSetNameForm.hook";

export const SetNameDialog = () => {
  const { name, error, isValid, updateName, markAsTouched } = useSetNameForm();
  const updateNameMutation = usePutUserChangeName();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    markAsTouched();

    if (isValid()) {
      updateNameMutation.mutate(
        {
          data: {
            name: name(),
          },
        },
        {
          onSuccess: () => {
            if (document.startViewTransition) {
              document.startViewTransition(() => {
                queryClient.invalidateQueries({
                  queryKey: getGetUserQueryKey(),
                });
              });
            } else {
              queryClient.invalidateQueries({
                queryKey: getGetUserQueryKey(),
              });
            }
          },
        },
      );
    }
  };

  return (
    <div class="set-name-dialog fixed top-6 z-500 flex flex-col items-center justify-center gap-5 justify-self-center rounded-3xl bg-white p-5 shadow-[0_0_20px_15px_rgba(0,0,0,0.1)]">
      <span class="text-primary text-xl">
        quack quack… wait, what do I call you? I don't talk to strangers.
      </span>
      <form
        class="flex w-full flex-row items-start gap-4"
        onSubmit={handleSubmit}
      >
        <FormInput
          id="duck-name"
          name="name"
          type="text"
          wrapperClass="w-full items-start"
          placeholder="Enter your name"
          size="small"
          value={name()}
          error={error()}
          required
          onInput={(value) => updateName(value)}
          onBlur={() => markAsTouched()}
        />
        <button
          type="submit"
          class="shrink-0 rounded-full bg-primary px-8 py-[15px] text-white"
          disabled={!isValid() && error() !== undefined}
        >
          quack quack
        </button>
      </form>
    </div>
  );
};
