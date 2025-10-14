import { Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";

interface IWelcomeScreenProps {
  visible: boolean;
  onCreateClick: () => void;
}

export function WelcomeScreen(props: IWelcomeScreenProps) {
  return (
    <div class="relative z-10 flex flex-col items-center justify-center">
      <Presence>
        <Show when={props.visible}>
          <Motion.img
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            src="/logo.svg"
            alt="logo"
            class="w-11/12 translate-y-[-14dvh]"
          />
        </Show>
      </Presence>
      <Presence>
        <Show when={props.visible}>
          <Motion.button
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            class="translate-y-[-8dvh] rounded-full bg-primary px-8 py-4 text-3xl text-white transition-transform hover:scale-105"
            onClick={props.onCreateClick}
            type="button"
          >
            Create your own
          </Motion.button>
        </Show>
      </Presence>
    </div>
  );
}
