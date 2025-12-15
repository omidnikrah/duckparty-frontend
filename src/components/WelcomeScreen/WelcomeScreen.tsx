import { useNavigate } from "@solidjs/router";
import { startViewTransition } from "@/helpers";

interface IWelcomeScreenProps {
  onCreateClick: () => void;
  onManageClick: () => void;
}

export const WelcomeScreen = (props: IWelcomeScreenProps) => {
  const navigate = useNavigate();

  return (
    <div class="spring-transition absolute inset-0 z-10 flex h-fit flex-col items-center justify-center">
      <button
        type="button"
        class="cubic-transition origin-right translate-x-[-3vh] translate-y-4 scale-80 self-end text-primary opacity-0 delay-200 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:delay-500"
        onClick={() => {
          startViewTransition(() => {
            navigate("/party");
          });
        }}
      >
        what's the party<span class="animate-pulse">?</span>
      </button>
      <img src="/logo.svg" alt="logo" class="w-11/12" />
      <button
        class="mt-10 rounded-full bg-primary px-8 py-4 text-3xl text-white transition-transform hover:scale-105"
        onClick={props.onCreateClick}
        type="button"
      >
        Create your Duck
      </button>
      <span class="cubic-transition h-0 translate-y-2 text-primary opacity-0 transition-all delay-75 group-hover:opacity-20">
        or
      </span>
      <button
        type="button"
        class="cubic-transition mt-10 translate-y-10 rounded-full border-5 border-primary px-3 py-1 text-primary opacity-0 transition-all hover:scale-105 hover:opacity-100 group-hover:translate-y-0 group-hover:opacity-40"
        onClick={props.onManageClick}
      >
        Manage ur ducks
      </button>
    </div>
  );
};
