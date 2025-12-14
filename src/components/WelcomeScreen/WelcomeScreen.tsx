interface IWelcomeScreenProps {
  onCreateClick: () => void;
  onManageClick: () => void;
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
