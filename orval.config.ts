import { config } from "dotenv";
import { defineConfig } from "orval";

config();

export default defineConfig({
  api: {
    input: {
      target: `${process.env.VITE_API_BASE_URL}/swagger/doc.json`,
    },
    output: {
      mode: "split",
      target: "./src/api/generated/endpoints.ts",
      schemas: "./src/api/generated/schemas",
      client: "react-query", // There is no solid-query client yet :()
      mock: false,
      biome: true,
      override: {
        mutator: {
          path: "./src/api/axios-instance.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
