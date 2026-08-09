import assert from "node:assert/strict"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import {
  Alert,
  EmptyDescription,
  badgeVariants,
  buttonVariants,
} from "../dist/index.js"
import { readRoot, readUiSource } from "./lib/source.mjs"

test("EmptyDescription renders paragraph semantics", () => {
  assert.equal(
    renderToStaticMarkup(
      React.createElement(EmptyDescription, null, "Nothing here")
    ),
    '<p data-slot="empty-description" class="text-sm/relaxed text-muted-foreground [&amp;&gt;a]:underline [&amp;&gt;a]:underline-offset-4 [&amp;&gt;a:hover]:text-primary">Nothing here</p>'
  )
})

test("Alert remains urgent by default and permits non-assertive semantics", () => {
  assert.match(renderToStaticMarkup(React.createElement(Alert)), /role="alert"/)
  assert.match(
    renderToStaticMarkup(React.createElement(Alert, { role: "status" })),
    /role="status"/
  )
})

test("loading state cannot be overridden by spread props", async () => {
  const button = await readUiSource("button")
  assert.ok(
    button.indexOf("{...props}") <
      button.indexOf("aria-busy={loading || undefined}")
  )
  assert.ok(
    button.indexOf("{...props}") <
      button.indexOf("disabled={disabled || loading}")
  )
})

test("shared buttons default to type button unless overridden", async () => {
  const button = await readUiSource("button")
  assert.ok(button.indexOf('type="button"') < button.indexOf("{...props}"))
  assert.ok(
    button.indexOf("{...props}") <
      button.indexOf("aria-busy={loading || undefined}")
  )
})

test("normal targets are 44px by default while xs remains explicitly dense", async () => {
  const [button, tabs, sidebarMenu, tokens] = await Promise.all([
    readUiSource("button"),
    readUiSource("tabs"),
    readUiSource("sidebar/menu"),
    readRoot("src/tokens.css"),
  ])
  assert.match(button, /xs: "min-h-8/)
  assert.match(button, /"icon-xs":[\s\S]*"size-8/)
  assert.match(button, /"icon-sm":[\s\S]*"size-\(--control-height\)/)
  assert.match(button, /default:\s*"min-h-\(--control-height\)/)
  assert.match(tabs, /min-h-\(--control-height\)/)
  assert.match(sidebarMenu, /default: "min-h-\(--sidebar-row-height\)/)
  assert.match(sidebarMenu, /xs: "h-7/)
  assert.match(
    tokens,
    /:root,\n\[data-density="comfortable"\] \{\s*--panel-padding: var\(--space-6\);\s*--control-height: 44px;/
  )
  assert.match(
    tokens,
    /\[data-density="compact"\] \{\s*--panel-padding: var\(--space-4\);\s*--control-height: 32px;/
  )
  assert.match(
    tokens,
    /@media \(pointer: coarse\)[\s\S]*\[data-density="compact"\] \{\s*--control-height: 44px;/
  )
})

test("built-in navigation labels expose localization props", async () => {
  const [pagination, breadcrumb, sidebarShell] = await Promise.all([
    readUiSource("pagination"),
    readUiSource("breadcrumb"),
    readUiSource("sidebar/shell"),
  ])
  assert.match(pagination, /label = "Pagination"/)
  assert.match(pagination, /label = "Go to previous page"/)
  assert.match(breadcrumb, /label = "Breadcrumb"/)
  assert.match(sidebarShell, /mobileTitle = "Sidebar"/)
  assert.match(sidebarShell, /label = "Toggle sidebar"/)
})

test("shared headings reflow only when a word cannot fit", async () => {
  const styles = await readRoot("src/styles.css")
  const headingRules = styles.slice(
    styles.indexOf(".mivama-heading-display,"),
    styles.indexOf(".mivama-heading-display {")
  )
  assert.match(headingRules, /min-width: 0;/)
  assert.match(headingRules, /hyphens: auto;/)
  assert.match(headingRules, /overflow-wrap: anywhere;/)
  assert.doesNotMatch(headingRules, /word-break: break-all/)
  assert.match(styles, /font-size: var\(--type-display-size\);/)
  assert.match(
    styles,
    /\.mivama-text-body,\s+\.mivama-text-small \{\s+color: var\(--foreground\);/
  )
  assert.match(
    styles,
    /\.mivama-text-lead,\s+\.mivama-text-meta,\s+\.mivama-text-eyebrow \{\s+color: var\(--muted-foreground\);/
  )
})

test("reduced motion is non-important and explicit on changed motion components", async () => {
  const [styles, button, card, sheet] = await Promise.all([
    readRoot("src/styles.css"),
    readUiSource("button"),
    readUiSource("card"),
    readUiSource("sheet"),
  ])
  assert.doesNotMatch(styles, /!important/)
  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation-duration: 0\.01ms;[\s\S]*animation-iteration-count: 1;[\s\S]*transition-duration: 0\.01ms;/
  )
  assert.match(button, /motion-reduce:transition-none/)
  assert.match(button, /motion-reduce:active:translate-y-0/)
  assert.match(button, /motion-reduce:animate-none/)
  assert.match(card, /motion-reduce:transition-none/)
  assert.match(sheet, /motion-reduce:transition-none/)
  assert.match(sheet, /motion-reduce:data-starting-style:translate-none/)
  assert.match(sheet, /motion-reduce:data-ending-style:translate-none/)
})

test("navigation buttons retain shared targets, wrapping, focus, and state semantics", () => {
  const navigation = buttonVariants({ variant: "navigation" })
  assert.match(navigation, /min-h-\(--control-height\)/)
  assert.match(navigation, /hover:bg-surface/)
  assert.match(navigation, /aria-expanded:bg-surface/)
  assert.match(navigation, /aria-\[current=page\]:bg-accent/)
  assert.match(navigation, /focus-visible:ring-3/)
  assert.match(buttonVariants(), /bg-primary/)
})

test("wrapping variants opt into shrinking and emergency label reflow", async () => {
  const [button, badge] = await Promise.all([
    readUiSource("button"),
    readUiSource("badge"),
  ])
  for (const variants of [buttonVariants, badgeVariants]) {
    const wrapped = variants({ wrap: true })
    assert.match(wrapped, /max-w-full/)
    assert.match(wrapped, /min-w-0/)
    assert.match(wrapped, /\bshrink\b/)
    assert.match(wrapped, /whitespace-normal/)
    assert.match(wrapped, /text-center/)
    assert.match(wrapped, /wrap-anywhere/)
    assert.doesNotMatch(wrapped, /whitespace-nowrap/)
    assert.match(variants(), /shrink-0 whitespace-nowrap/)
  }
  assert.match(button, /buttonVariants\(\{ variant, size, wrap, className \}\)/)
  assert.match(badge, /badgeVariants\(\{ variant, wrap \}\)/)
})

test("primary hover and keyboard focus remain opaque across themes", async () => {
  const [tokens, themes, button, badge] = await Promise.all([
    readRoot("src/tokens.css"),
    readRoot("src/themes.css"),
    readUiSource("button"),
    readUiSource("badge"),
  ])
  assert.match(tokens, /--color-primary-hover: var\(--primary-hover\);/)
  assert.equal((themes.match(/^\s+--primary-hover:/gm) ?? []).length, 4)
  assert.match(button, /hover:bg-primary-hover/)
  assert.doesNotMatch(button, /hover:bg-primary\/80/)
  assert.match(button, /focus-visible:ring-3 focus-visible:ring-ring /)
  assert.doesNotMatch(button, /focus-visible:ring-ring\/50/)
  assert.match(badge, /\[a\]:hover:bg-primary-hover/)
  assert.doesNotMatch(badge, /\[a\]:hover:bg-primary\/80/)
})

test("native controls inherit the active light or dark color scheme", async () => {
  const themes = await readRoot("src/themes.css")
  assert.match(
    themes,
    /:root,\n\[data-mivama-theme="product"\],[\s\S]*color-scheme: light;/
  )
  assert.match(
    themes,
    /\.dark,\n\.dark \[data-mivama-theme="product"\],[\s\S]*color-scheme: dark;/
  )
})

test("disabled inputs keep their cursor feedback and remain inspectable", async () => {
  const input = await readUiSource("input")
  assert.doesNotMatch(input, /@base-ui\/react\/input/)
  assert.match(input, /<input/)
  assert.match(input, /disabled:cursor-not-allowed/)
  assert.match(input, /disabled:bg-input\/50/)
  assert.match(input, /disabled:opacity-50/)
  assert.doesNotMatch(input, /disabled:pointer-events-none/)
})
