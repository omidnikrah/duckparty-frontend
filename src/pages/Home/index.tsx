export default function Home() {
  return (
    <div class="relative flex h-full w-full shrink-0 items-center justify-center bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-primary)_0%,var(--color-primary-700)_100%)] after:pointer-events-none after:absolute after:inset-0 after:bg-[length:60vh] after:bg-[url('/bg-pattern.png')] after:bg-center after:bg-repeat after:opacity-5 after:content-['']">
      <div class="relative z-10 flex h-[70dvh] w-[70dvh] flex-col items-center justify-center rounded-full bg-white shadow-[0_0_45px_20px_rgba(0,0,0,0.05)]">
        <img src="/body.png" alt="body" class="w-2/3 translate-y-[-14dvh]" />
        <img src="/logo.svg" alt="logo" class="w-11/12 translate-y-[-14dvh]" />
        <a
          href="/"
          class="translate-y-[-8dvh] rounded-full bg-primary px-8 py-4 text-3xl text-white transition-transform hover:scale-105"
        >
          Create your own
        </a>
      </div>
    </div>
  );
}
