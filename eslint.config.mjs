import babelParser from "@babel/eslint-parser"
import js from "@eslint/js"
import importX from "eslint-plugin-import-x"
import reactHooks from "eslint-plugin-react-hooks"
import unusedImports from "eslint-plugin-unused-imports"
import globals from "globals"

const sharedRules = {
  "no-unused-vars": "off",
  "unused-imports/no-unused-imports": "error",
  "unused-imports/no-unused-vars": [
    "error",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
  ],
  "import-x/first": "error",
  "import-x/newline-after-import": "error",
  "import-x/no-duplicates": "error",
}

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      ".artifacts/**",
      ".next/**",
      ".vite/**",
      "out/**",
      "playwright-report/**",
      "storybook-static/**",
      "test-results/**",
    ],
  },
  {
    files: ["scripts/**/*.mjs", "tests/**/*.mjs"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    plugins: {
      "import-x": importX,
      "unused-imports": unusedImports,
    },
    rules: {
      ...sharedRules,
      "no-console": "off",
    },
  },
  {
    files: [
      "src/**/*.{ts,tsx}",
      "tests/runtime/**/*.{ts,tsx}",
      "tests/setup.ts",
      "vitest.config.ts",
    ],
    ...js.configs.recommended,
    languageOptions: {
      parser: babelParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: [
            ["@babel/preset-typescript", { allExtensions: true, isTSX: true }],
          ],
        },
      },
    },
    plugins: {
      "import-x": importX,
      "react-hooks": reactHooks,
      "unused-imports": unusedImports,
    },
    rules: {
      ...sharedRules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
]
