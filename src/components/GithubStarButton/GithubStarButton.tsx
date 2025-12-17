import axios from "axios";
import clsx from "clsx";
import { createSignal, onMount, Show } from "solid-js";
import { twMerge } from "tailwind-merge";
import GithubIcon from "@/assets/github.svg";

type GithubStarButtonProps = {
  class?: string;
};

const REPO_URL = "https://github.com/omidnikrah/duckparty-frontend";
const API_URL = "https://api.github.com/repos/omidnikrah/duckparty-frontend";
const CACHE_KEY = "duckparty:github-stars";
const CACHE_MAX_AGE_SECONDS = 60 * 60; // 1 hour

type GithubRepoResponse = {
  stargazers_count?: number;
};

export const GithubStarButton = (props: GithubStarButtonProps) => {
  const [stars, setStars] = createSignal<number | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  const readCache = async (): Promise<number | null> => {
    if (!cookieStore) return null;
    try {
      const cookie = await cookieStore.get(CACHE_KEY);
      const value = Number(cookie?.value);
      return Number.isFinite(value) ? value : null;
    } catch {
      return null;
    }
  };

  const writeCache = async (value: number) => {
    if (!cookieStore) return;
    try {
      const val = String(value);
      await cookieStore.set({
        name: CACHE_KEY,
        value: val,
        expires: Date.now() + CACHE_MAX_AGE_SECONDS * 1000,
        path: "/",
        sameSite: "lax",
      });
    } catch (error) {
      console.error("Failed to write cache", error);
    }
  };

  const fetchStars = async () => {
    try {
      const data = await axios.get<GithubRepoResponse>(API_URL);
      return data?.data?.stargazers_count ?? 0;
    } catch (error) {
      console.error("Failed to fetch stars", error);
      return 0;
    }
  };

  onMount(() => {
    const init = async () => {
      const cached = await readCache();
      if (cached !== null) {
        setStars(cached);
        return;
      }

      setIsLoading(true);
      fetchStars()
        .then((count) => {
          setStars(count);
          return writeCache(count);
        })
        .catch(() => {
          console.warn(
            "failed to fetch stars; falling back to cached value if present",
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    init();
  });

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      class={twMerge(
        clsx(
          "hover:-translate-y-0.5 cubic-transition flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-purple-700 opacity-30 transition hover:scale-105 hover:opacity-100 [&>svg]:h-5 [&>svg]:w-5",
          props.class,
        ),
      )}
    >
      <GithubIcon />
      <Show
        when={!isLoading()}
        fallback={
          <span class="h-6 w-20 animate-pulse rounded-full bg-primary/20" />
        }
      >
        <span class="tabular-nums">
          {stars() !== null && (
            <span class="mr-1 text-primary">{stars()?.toLocaleString()}</span>
          )}
          {stars() !== null ? `Stars` : "Star us"}
        </span>
      </Show>
    </a>
  );
};
