import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/runtime/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html", "lcov"],
      include: ["src/components/**/*.{ts,tsx}", "src/hooks/**/*.{ts,tsx}"],
      thresholds: {
        statements: 76,
        branches: 67,
        functions: 70,
        lines: 76,
      },
    },
  },
})
