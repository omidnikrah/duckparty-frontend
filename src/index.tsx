/* @refresh reload */

import { QueryClientProvider } from "@tanstack/solid-query";
import { render } from "solid-js/web";
import App from "./App.tsx";
import { queryClient } from "./api/query-client.ts";
import "./styles/global.css";

const root = document.getElementById("root");

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  ),
  root!,
);
