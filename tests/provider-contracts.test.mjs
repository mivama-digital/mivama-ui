import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("MivamaProvider scopes theme, density, portal container, and refs", async () => {
  const provider = await read("src/components/mivama-provider.tsx")

  assert.match(
    provider,
    /portalContainer: portalContainer === undefined \? shellRef : portalContainer/
  )
  assert.match(provider, /useMivamaPortalContainer/)
  assert.match(provider, /useOptionalMivamaContext/)
  assert.match(
    provider,
    /React\.forwardRef<HTMLDivElement, MivamaProviderProps>/
  )
  assert.match(provider, /type MivamaTheme =/)
  assert.match(provider, /type MivamaDensity =/)
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

test("legacy portal synchronization is disabled inside a provider", async () => {
  const shellAttributes = await read("src/lib/shell-attributes.ts")

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
})

test("all public components have package subpath exports", async () => {
  const packageJson = JSON.parse(await read("package.json"))
  const expectedSubpaths = [
    "provider",
    "alert",
    "attachment",
    "badge",
    "bento-grid",
    "breadcrumb",
    "button",
    "card",
    "choice",
    "container",
    "dialog",
    "editorial-grid",
    "empty",
    "field",
    "input",
    "message",
    "pagination",
    "progress",
    "scroll-scene",
    "section",
    "select",
    "separator",
    "sheet",
    "sidebar",
    "skeleton",
    "switch",
    "tabs",
    "textarea",
    "tooltip",
    "typography",
    "forms",
  ]

  for (const name of expectedSubpaths) {
    const subpath = `./${name}`
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

test("verify includes bundle budgets before package validation", async () => {
  const packageJson = JSON.parse(await read("package.json"))

  assert.match(
    packageJson.scripts.verify,
    /npm run build && npm run bundle:check/
  )
  assert.match(packageJson.scripts.verify, /npm run pack:check/)
})
