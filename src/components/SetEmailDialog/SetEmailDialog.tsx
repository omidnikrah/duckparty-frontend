import { useNavigate } from "@solidjs/router";
import { Button } from "@/components";

export const SetEmailDialog = () => {
  const navigate = useNavigate();

  const handleSaveMyDuck = () => {
    navigate("/set-email");
  };

  return (
    <div class="set-email-dialog fixed right-6 bottom-6 z-500 flex flex-row items-center justify-center gap-5 justify-self-center rounded-3xl bg-white p-5 shadow-[0_0_20px_15px_rgba(0,0,0,0.1)]">
      <span class="text-primary text-xl">
        quack quack… wanna save this duck with your email?
      </span>
      <Button
        type="button"
        class="w-auto shrink-0 p-[19px_20px] text-base leading-none"
        onClick={handleSaveMyDuck}
      >
        Save my duck
      </Button>
    </div>
  );
};
