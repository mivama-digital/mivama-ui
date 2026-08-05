import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("MivamaProvider scopes theme, density, and portal container", async () => {
  const provider = await read("src/components/mivama-provider.tsx")

  assert.match(provider, /portalContainer: portalContainer === undefined \? shellRef : portalContainer/)
  assert.match(provider, /useMivamaPortalContainer/)
  assert.ok(provider.indexOf("{...props}") < provider.indexOf("data-mivama-theme={theme}"))
  assert.ok(provider.indexOf("{...props}") < provider.indexOf("data-density={density}"))
  assert.ok(provider.indexOf("{...props}") < provider.indexOf('className={cn("isolate", className)}'))
})

test("dialog, sheet, and tooltip use the provider portal container", async () => {
  const [dialog, sheet, tooltip] = await Promise.all([
    read("src/components/ui/dialog.tsx"),
    read("src/components/ui/sheet.tsx"),
    read("src/components/ui/tooltip.tsx"),
  ])

  assert.match(dialog, /container=\{container \?\? providerContainer\}/)
  assert.match(sheet, /container=\{container \?\? providerContainer\}/)
  assert.match(tooltip, /<TooltipPrimitive\.Portal container=\{portalContainer\}>/)

  for (const source of [dialog, sheet, tooltip]) {
    assert.match(source, /=== undefined/)
  }
})

test("legacy portal synchronization is disabled inside a provider", async () => {
  const shellAttributes = await read("src/lib/shell-attributes.ts")

  assert.match(shellAttributes, /useShellAttributes\(portalSelector: string, enabled = true\)/)
  assert.match(shellAttributes, /if \(!enabled\) return/)
  assert.match(shellAttributes, /\[enabled, portalSelector\]/)
})

test("provider and scoped overlays have public package exports", async () => {
  const packageJson = JSON.parse(await read("package.json"))
  const index = await read("src/index.ts")

  for (const subpath of ["./provider", "./dialog", "./sheet", "./tooltip"]) {
    assert.ok(packageJson.exports[subpath], `missing ${subpath} export`)
  }
  assert.match(index, /export \{ MivamaProvider, useMivamaContext, useMivamaPortalContainer \}/)
})
