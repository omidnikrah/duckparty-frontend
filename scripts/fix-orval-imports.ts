import { readFileSync, writeFileSync } from "node:fs";

const ENDPOINTS_FILE = "src/api/generated/endpoints.ts";

const REPLACEMENTS = {
  reactQueryToSolidQuery: {
    from: "@tanstack/react-query",
    to: "@tanstack/solid-query",
  },
  useMutationOptions: {
    from: "): UseMutationOptions<",
    to: "): SolidMutationOptions<",
  },
  useMutationWrapper: {
    from: "return useMutation(mutationOptions);",
    to: "return useMutation(() => mutationOptions);",
  },
  useQueryWrapper: {
    from: "const query = useQuery(queryOptions)",
    to: "const query = useQuery(() => queryOptions)",
  },
} as const;

const SOLID_MUTATION_IMPORT =
  "import type { SolidMutationOptions } from '@tanstack/solid-query';";
const QUERY_KEY_EXTENSION = "& { queryKey: QueryKey }";

const greenLog = (text: string) => `\x1b[32m${text}\x1b[0m`;

function hasSolidMutationImport(content: string): boolean {
  return content.includes(SOLID_MUTATION_IMPORT);
}

function addSolidMutationImport(content: string): string {
  if (hasSolidMutationImport(content)) {
    return content;
  }
  return `${SOLID_MUTATION_IMPORT}\n${content}`;
}

function extendSolidQueryOptions(content: string): string {
  const regex =
    /(UseQueryOptions\s*<\s*Awaited<ReturnType<typeof\s+\w+>>.*?)(\s*>)/gs;

  return content.replace(regex, (match, optionsBlock, closingBracket) => {
    if (match.includes(QUERY_KEY_EXTENSION)) {
      return match;
    }
    return `${optionsBlock}${closingBracket} ${QUERY_KEY_EXTENSION}`;
  });
}

function removeUseQueryOptionsAssertions(content: string): string {
  return content.replaceAll(/as\s+UseQueryOptions[\s\S]*?;/g, ";");
}

function applyReplacements(content: string): string {
  let result = content;
  for (const { from, to } of Object.values(REPLACEMENTS)) {
    result = result.replaceAll(from, to);
  }
  return result;
}

function transformFileContent(content: string): string {
  let transformed = addSolidMutationImport(content);
  transformed = applyReplacements(transformed);
  transformed = extendSolidQueryOptions(transformed);
  transformed = removeUseQueryOptionsAssertions(transformed);
  return transformed;
}

function main(): void {
  const content = readFileSync(ENDPOINTS_FILE, "utf-8");
  const transformed = transformFileContent(content);
  writeFileSync(ENDPOINTS_FILE, transformed, "utf-8");
  console.log(
    greenLog("🛠  Fixed Solid Query imports and types in endpoints.ts"),
  );
}

main();
