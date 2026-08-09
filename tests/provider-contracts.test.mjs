import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import { components } from "../config/components.mjs"

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("MivamaProvider scopes theme, density, portal container, and refs", async () => {
  const provider = await read("src/components/mivama-provider.tsx")

  assert.match(
    provider,
    /portalContainer:\s*portalContainer === undefined \? shellRef : portalContainer/
  )
  assert.match(provider, /useMivamaPortalContainer/)
  assert.match(provider, /useOptionalMivamaContext/)
  assert.match(
    provider,
    /React\.forwardRef<HTMLDivElement, MivamaProviderProps>/
  )
  assert.match(provider, /type MivamaTheme = BuiltInMivamaTheme/)
  assert.match(provider, /type MivamaDensity = BuiltInMivamaDensity/)
  assert.match(provider, /theme = DEFAULT_THEME/)
  assert.match(provider, /density = DEFAULT_DENSITY/)
  assert.doesNotMatch(provider, /"marketing"|"dashboard"|"spacious"/)
  assert.ok(
    provider.indexOf("{...props}") <
      provider.indexOf("data-mivama-theme={theme}")
  )
  assert.ok(
    provider.indexOf("{...props}") < provider.indexOf("data-density={density}")
  )
  assert.ok(
    provider.indexOf("{...props}") <
      provider.indexOf('className={cn("isolate", className)}')
  )
})

test("built-in shell vocabulary has one source of truth", async () => {
  const [contract, preview] = await Promise.all([
    read("src/lib/shell-contract.ts"),
    read(".storybook/preview.tsx"),
  ])

  assert.match(
    contract,
    /BUILT_IN_THEMES = \["product", "editorial", "portal"\] as const/
  )
  assert.match(
    contract,
    /BUILT_IN_DENSITIES = \["comfortable", "compact"\] as const/
  )
  assert.match(contract, /DEFAULT_THEME.*= "product"/)
  assert.match(contract, /DEFAULT_DENSITY.*= "comfortable"/)
  assert.doesNotMatch(contract, /marketing|dashboard|spacious/)
  assert.match(preview, /items: \[\.\.\.BUILT_IN_THEMES\]/)
  assert.match(preview, /items: \[\.\.\.BUILT_IN_DENSITIES\]/)
  assert.match(preview, /theme: DEFAULT_THEME/)
  assert.match(preview, /density: DEFAULT_DENSITY/)
})

test("dialog, sheet, and tooltip use the provider portal container", async () => {
  const [dialog, sheet, tooltip] = await Promise.all([
    read("src/components/ui/dialog.tsx"),
    read("src/components/ui/sheet.tsx"),
    read("src/components/ui/tooltip.tsx"),
  ])

  assert.match(dialog, /container=\{container \?\? providerContainer\}/)
  assert.match(sheet, /container=\{container \?\? providerContainer\}/)
  assert.match(
    tooltip,
    /<TooltipPrimitive\.Portal container=\{portalContainer\}>/
  )
})

test("provider-less portal compatibility remains bounded to portaled content", async () => {
  const [dialog, sheet, tooltip, shellAttributes] = await Promise.all([
    read("src/components/ui/dialog.tsx"),
    read("src/components/ui/sheet.tsx"),
    read("src/components/ui/tooltip.tsx"),
    read("src/lib/shell-attributes.ts"),
  ])

  assert.match(
    shellAttributes,
    /const providerContainer = useMivamaPortalContainer\(\)/
  )
  assert.match(
    shellAttributes,
    /const enabled = providerContainer === undefined/
  )
  assert.match(shellAttributes, /if \(!enabled\) return/)
  assert.match(shellAttributes, /\[enabled, portalSelector\]/)
  assert.match(dialog, /useShellAttributes\("\[data-slot=dialog-content\]"\)/)
  assert.match(sheet, /useShellAttributes\("\[data-slot=sheet-content\]"\)/)
  assert.match(sheet, /useShellAttributes\("\[data-slot=sheet-overlay\]"\)/)
  assert.match(tooltip, /useShellAttributes\("\[data-slot=tooltip-content\]"\)/)
})

test("all registry components have package subpath exports", async () => {
  const packageJson = JSON.parse(await read("package.json"))

  for (const { slug } of components) {
    const subpath = `./${slug}`
    assert.ok(packageJson.exports[subpath], `missing ${subpath} export`)
    assert.equal(typeof packageJson.exports[subpath].types, "string")
    assert.equal(typeof packageJson.exports[subpath].import, "string")
  }
})

test("provider public API includes typed theme, density, and optional context", async () => {
  const index = await read("src/index.ts")

  assert.match(index, /useOptionalMivamaContext/)
  assert.match(index, /MivamaDensity/)
  assert.match(index, /MivamaTheme/)
  assert.match(index, /MivamaContextValue/)
})

test("verification scripts share one canonical core pipeline", async () => {
  const packageJson = JSON.parse(await read("package.json"))
  const scripts = packageJson.scripts

  assert.match(scripts.verify, /npm run lint && npm run verify:core/)
  assert.match(scripts.verify, /npm run api:check/)
  assert.match(scripts.verify, /npm run test:coverage/)
  assert.equal(scripts["verify:package"], undefined)
  assert.equal(scripts["lint:node"], undefined)

  for (const check of [
    "format:check",
    "audit:source",
    "registry:check",
    "storybook:check",
    "typecheck",
    "build",
    "bundle:check",
    "test:contracts",
    "pack:check",
    "package:lint",
  ]) {
    assert.match(
      scripts["verify:core"],
      new RegExp(`npm run ${check.replace(":", "\\:")}`)
    )
  }
})
