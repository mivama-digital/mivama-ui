import js from "@eslint/js"
import importX from "eslint-plugin-import-x"
import unusedImports from "eslint-plugin-unused-imports"
import globals from "globals"

export default [
  { ignores: ["dist/**", "node_modules/**", "coverage/**"] },
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
      "no-console": "off",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "import-x/first": "error",
      "import-x/newline-after-import": "error",
      "import-x/no-duplicates": "error",
    },
  },
]
