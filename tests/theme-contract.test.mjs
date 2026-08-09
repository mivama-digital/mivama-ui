import assert from "node:assert/strict"
import test from "node:test"

import {
  BUILT_IN_DENSITIES,
  BUILT_IN_THEMES,
} from "../dist/lib/shell-contract.js"
import { readRoot } from "./lib/source.mjs"

test("compact density controls fit their documented 32px height", async () => {
  const tokens = await readRoot("src/tokens.css")
  const compact = tokens.slice(
    tokens.indexOf('[data-density="compact"] {'),
    tokens.indexOf("@media (min-width: 40rem)")
  )
  assert.match(compact, /--control-height: 32px;/)
  assert.match(
    compact,
    /\[data-density="compact"\] \[data-slot="button"\][\s\S]*padding-block: 0\.25rem;/
  )
  assert.match(
    compact,
    /\[data-density="compact"\] \[data-slot="tabs-trigger"\][\s\S]*padding-block: 0\.25rem;/
  )
  assert.match(
    compact,
    /\[data-density="compact"\] \[data-slot="sidebar-menu-button"\][\s\S]*padding-block: 0\.25rem;/
  )
})

test("semantic surface, focus, shadow, overlay, and motion tokens are reusable", async () => {
  const [tokens, themes] = await Promise.all([
    readRoot("src/tokens.css"),
    readRoot("src/themes.css"),
  ])
  for (const token of [
    "surface",
    "surface-elevated",
    "border-strong",
    "overlay",
    "shadow-subtle",
    "shadow-elevated",
    "focus-ring",
    "motion-duration-fast",
    "motion-duration-default",
    "motion-easing-standard",
  ]) {
    assert.match(`${tokens}\n${themes}`, new RegExp(`--${token}:`))
  }
  assert.match(tokens, /--color-surface: var\(--surface\);/)
  assert.match(tokens, /--color-surface-elevated: var\(--surface-elevated\);/)
  assert.match(tokens, /--color-border-strong: var\(--border-strong\);/)
  assert.match(tokens, /--color-overlay: var\(--overlay\);/)
  assert.match(themes, /--focus-ring: #0c62ed;/)
  assert.match(themes, /--primary: #0c62ed;/)

  const light = themes.slice(themes.indexOf(":root,"), themes.indexOf(".dark,"))
  const dark = themes.slice(
    themes.indexOf(".dark,"),
    themes.indexOf("@media (pointer: coarse)")
  )
  const value = (block, token) =>
    block.match(new RegExp(`--${token}: ([^;]+);`))?.[1]
  for (const theme of [light, dark]) {
    assert.notEqual(value(theme, "background"), value(theme, "surface"))
    assert.notEqual(value(theme, "surface"), value(theme, "surface-elevated"))
  }
})

test("editorial theme is opt-in and carries the verified light and dark palette", async () => {
  const themes = await readRoot("src/themes.css")
  const editorial = themes.slice(
    themes.indexOf('[data-mivama-theme="editorial"],'),
    themes.indexOf(".dark,")
  )
  const editorialDark = themes.slice(
    themes.indexOf('.dark [data-mivama-theme="editorial"],'),
    themes.indexOf("@media (pointer: coarse)")
  )
  assert.match(editorial, /--editorial-paper: #f3f4ef;/)
  assert.match(editorial, /--editorial-cobalt: #1649ff;/)
  assert.match(editorial, /--editorial-lime: #c9ff45;/)
  assert.match(editorial, /--editorial-instrument: #0b1018;/)
  assert.match(editorialDark, /--editorial-paper: #080b10;/)
  assert.match(editorialDark, /--editorial-cobalt: #7792ff;/)
  assert.doesNotMatch(
    themes.slice(
      themes.indexOf(":root,"),
      themes.indexOf('[data-mivama-theme="editorial"],')
    ),
    /--editorial-paper:/
  )
})

test("built-in themes and densities map to explicit CSS selectors", async () => {
  const [tokens, themes, styles] = await Promise.all([
    readRoot("src/tokens.css"),
    readRoot("src/themes.css"),
    readRoot("src/styles.css"),
  ])
  assert.match(styles, /@import "\.\/tokens\.css";/)
  assert.match(styles, /@import "\.\/themes\.css";/)

  for (const theme of BUILT_IN_THEMES) {
    assert.match(themes, new RegExp(`\\[data-mivama-theme="${theme}"\\]`))
    assert.doesNotMatch(
      styles,
      new RegExp(`\\[data-mivama-theme="${theme}"\\]`)
    )
  }
  for (const density of BUILT_IN_DENSITIES) {
    assert.match(tokens, new RegExp(`\\[data-density="${density}"\\]`))
  }
  for (const token of [
    "shape-panel",
    "space-4",
    "surface-elevated",
    "type-body-size",
    "motion-duration-default",
    "panel-padding",
    "control-height",
    "sidebar-row-height",
  ]) {
    assert.match(`${tokens}\n${themes}`, new RegExp(`--${token}:`))
  }

  assert.match(themes, /\.mivama-editorial-theme/)
  assert.match(
    themes,
    /\[data-mivama-theme="portal"\]\[data-density="compact"\][\s\S]*--panel-padding: 16px;[\s\S]*--sidebar-row-height: 32px;/
  )
  assert.match(
    themes,
    /@media \(pointer: coarse\)[\s\S]*--sidebar-row-height: 44px;/
  )
})
