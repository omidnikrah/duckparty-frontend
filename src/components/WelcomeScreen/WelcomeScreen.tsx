import { Show } from "solid-js";

interface IWelcomeScreenProps {
  onCreateClick: () => void;
}

export const WelcomeScreen = (props: IWelcomeScreenProps) => {
  return (
    <div class="spring-transition absolute inset-0 z-10 flex h-fit flex-col items-center justify-center">
      <img src="/logo.svg" alt="logo" class="w-11/12" />
      <button
        class="mt-10 rounded-full bg-primary px-8 py-4 text-3xl text-white transition-transform hover:scale-105"
        onClick={props.onCreateClick}
        type="button"
      >
        Create your own
      </button>
    </div>
  );
};
