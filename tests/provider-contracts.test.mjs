import assert from "node:assert/strict"
import test from "node:test"

import { readRoot } from "./lib/source.mjs"

test("MivamaProvider scopes theme, density, portal container, and refs", async () => {
  const provider = await readRoot("src/components/mivama-provider.tsx")

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
  assert.match(provider, /import type \{ MivamaDensity, MivamaTheme \}/)
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

test("built-in shell vocabulary and public shell types have one module owner", async () => {
  const [contract, preview, provider] = await Promise.all([
    readRoot("src/lib/shell-contract.ts"),
    readRoot(".storybook/preview.tsx"),
    readRoot("src/components/mivama-provider.tsx"),
  ])

  assert.match(
    contract,
    /MivamaTheme = "product" \| "editorial" \| "portal" \| \(string & \{\}\)/
  )
  assert.match(
    contract,
    /MivamaDensity = "comfortable" \| "compact" \| \(string & \{\}\)/
  )
  assert.match(
    contract,
    /BUILT_IN_THEMES = \["product", "editorial", "portal"\] as const/
  )
  assert.match(
    contract,
    /BUILT_IN_DENSITIES = \["comfortable", "compact"\] as const/
  )
  assert.match(contract, /DEFAULT_THEME = "product" satisfies MivamaTheme/)
  assert.match(
    contract,
    /DEFAULT_DENSITY = "comfortable" satisfies MivamaDensity/
  )
  assert.doesNotMatch(contract, /marketing|dashboard|spacious/)
  assert.match(preview, /items: \[\.\.\.BUILT_IN_THEMES\]/)
  assert.match(preview, /items: \[\.\.\.BUILT_IN_DENSITIES\]/)
  assert.match(preview, /theme: DEFAULT_THEME/)
  assert.match(preview, /density: DEFAULT_DENSITY/)
  assert.doesNotMatch(provider, /type MivamaTheme =|type MivamaDensity =/)
})

test("dialog, sheet, and tooltip use the provider portal container", async () => {
  const [dialog, sheet, tooltip] = await Promise.all([
    readRoot("src/components/ui/dialog.tsx"),
    readRoot("src/components/ui/sheet.tsx"),
    readRoot("src/components/ui/tooltip.tsx"),
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
    readRoot("src/components/ui/dialog.tsx"),
    readRoot("src/components/ui/sheet.tsx"),
    readRoot("src/components/ui/tooltip.tsx"),
    readRoot("src/lib/shell-attributes.ts"),
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
  assert.match(shellAttributes, /document\.querySelectorAll\(portalSelector\)/)
  assert.match(shellAttributes, /element\.removeAttribute\(attribute\)/)
  assert.match(
    shellAttributes,
    /shellObserver\.observe\(shell,[\s\S]*attributes: true/
  )
  assert.match(shellAttributes, /attributeFilter: \[\.\.\.SHELL_ATTRIBUTES\]/)
  assert.match(shellAttributes, /portalObserver\.disconnect\(\)/)
  assert.match(shellAttributes, /shellObserver\.disconnect\(\)/)
  assert.match(dialog, /useShellAttributes\("\[data-slot=dialog-content\]"\)/)
  assert.match(sheet, /useShellAttributes\("\[data-slot=sheet-content\]"\)/)
  assert.match(sheet, /useShellAttributes\("\[data-slot=sheet-overlay\]"\)/)
  assert.match(tooltip, /useShellAttributes\("\[data-slot=tooltip-content\]"\)/)
})

test("provider public API includes typed theme, density, and optional context", async () => {
  const index = await readRoot("src/index.ts")

  assert.match(index, /useOptionalMivamaContext/)
  assert.match(index, /MivamaDensity/)
  assert.match(index, /MivamaTheme/)
  assert.match(index, /MivamaContextValue/)
})
