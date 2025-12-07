import {
  getGetUserQueryKey,
  usePutUserChangeName,
} from "@/api/generated/endpoints";
import { queryClient } from "@/api/query-client";
import { Button, FormInput } from "@/components";
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
            queryClient.invalidateQueries({
              queryKey: getGetUserQueryKey(),
            });
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
        <Button
          type="submit"
          class="w-auto shrink-0 p-[19px_20px] text-base leading-none"
          disabled={!isValid() && error() !== undefined}
          isLoading={updateNameMutation.isPending}
        >
          quack quack
        </Button>
      </form>
    </div>
  );
};
