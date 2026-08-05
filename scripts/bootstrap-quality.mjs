import { readFile, writeFile } from "node:fs/promises"

const packageJson = JSON.parse(await readFile("package.json", "utf8"))
Object.assign(packageJson.scripts, {
  lint: 'eslint "scripts/**/*.mjs" "tests/**/*.mjs"',
  format: "prettier --write .",
  "format:check":
    'prettier --check package.json package-lock.json eslint.config.mjs vitest.config.ts tests/setup.ts "tests/runtime/**/*.{ts,tsx}"',
  "test:runtime": "vitest run",
  "test:runtime:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:contracts": "node --test tests/*.test.mjs",
  test: "npm run test:runtime && npm run test:contracts",
  verify:
    "npm run lint && npm run format:check && npm run audit:source && npm run typecheck && npm run build && npm run bundle:check && npm test && npm run pack:check",
})
await writeFile("package.json", `${JSON.stringify(packageJson, null, 2)}\n`)

const files = {
  "eslint.config.mjs": `import js from "@eslint/js"
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
`,
  ".prettierrc.json": `{
  "semi": false,
  "singleQuote": false,
  "trailingComma": "es5"
}
`,
  ".prettierignore": `dist
node_modules
coverage
src/fonts
`,
  ".editorconfig": `root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
`,
  "vitest.config.ts": `import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/runtime/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: ["src/components/**/*.{ts,tsx}", "src/hooks/**/*.{ts,tsx}"],
    },
  },
})
`,
  "tests/setup.ts": `import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

afterEach(() => cleanup())

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock
`,
  "tests/runtime/provider.test.tsx": `import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  MivamaProvider,
  useMivamaPortalContainer,
} from "../../src/components/mivama-provider.js"

function PortalProbe() {
  const portalContainer = useMivamaPortalContainer()
  const resolved =
    portalContainer && "current" in portalContainer
      ? portalContainer.current
      : portalContainer

  return (
    <output data-testid="portal-probe">
      {resolved instanceof HTMLElement
        ? resolved.dataset.mivamaTheme
        : "none"}
    </output>
  )
}

describe("MivamaProvider", () => {
  it("applies default theme and density attributes", () => {
    render(
      <MivamaProvider data-testid="shell">
        <PortalProbe />
      </MivamaProvider>
    )

    const shell = screen.getByTestId("shell")
    expect(shell).toHaveAttribute("data-mivama-theme", "product")
    expect(shell).toHaveAttribute("data-density", "comfortable")
  })

  it("supports custom theme, density, className, and forwarded refs", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <MivamaProvider
        ref={ref}
        theme="dashboard"
        density="compact"
        className="custom-shell"
      />
    )

    expect(ref.current).toHaveAttribute("data-mivama-theme", "dashboard")
    expect(ref.current).toHaveAttribute("data-density", "compact")
    expect(ref.current).toHaveClass("isolate", "custom-shell")
  })

  it("uses an explicit portal container", () => {
    const portal = document.createElement("div")
    portal.dataset.mivamaTheme = "external"
    render(
      <MivamaProvider portalContainer={portal}>
        <PortalProbe />
      </MivamaProvider>
    )

    expect(screen.getByTestId("portal-probe")).toHaveTextContent("external")
  })
})
`,
  "tests/runtime/button-accessibility.test.tsx": `import axe from "axe-core"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Button } from "../../src/components/ui/button.js"

describe("Button", () => {
  it("supports activation and loading semantics", async () => {
    const user = userEvent.setup()
    let activations = 0
    const { rerender } = render(
      <Button onClick={() => activations++}>Save</Button>
    )

    await user.click(screen.getByRole("button", { name: "Save" }))
    expect(activations).toBe(1)

    rerender(<Button loading>Save</Button>)
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
  })

  it("has no automated accessibility violations", async () => {
    const { container } = render(<Button>Continue</Button>)
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })
})
`,
}

for (const [path, content] of Object.entries(files)) {
  await writeFile(path, content)
}
