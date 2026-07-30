import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { Alert, EmptyDescription } from "../dist/index.js"

const source = async (name) =>
  readFile(new URL(`../src/components/ui/${name}.tsx`, import.meta.url), "utf8")

test("EmptyDescription renders paragraph semantics", () => {
  assert.equal(renderToStaticMarkup(React.createElement(EmptyDescription, null, "Nothing here")), '<p data-slot="empty-description" class="text-sm/relaxed text-muted-foreground [&amp;&gt;a]:underline [&amp;&gt;a]:underline-offset-4 [&amp;&gt;a:hover]:text-primary">Nothing here</p>')
})

test("Alert remains urgent by default and permits non-assertive semantics", () => {
  assert.match(renderToStaticMarkup(React.createElement(Alert)), /role="alert"/)
  assert.match(renderToStaticMarkup(React.createElement(Alert, { role: "status" })), /role="status"/)
})

test("loading state cannot be overridden by spread props", async () => {
  const button = await source("button")
  assert.ok(button.indexOf("{...props}") < button.indexOf("aria-busy={loading || undefined}"))
  assert.ok(button.indexOf("{...props}") < button.indexOf("disabled={disabled || loading}"))
})

test("skeleton output and hidden ellipses are deterministic", async () => {
  const [sidebar, pagination, breadcrumb] = await Promise.all([
    source("sidebar"),
    source("pagination"),
    source("breadcrumb"),
  ])
  assert.doesNotMatch(sidebar, /Math\.random/)
  assert.match(sidebar, /width = "70%"/)
  assert.doesNotMatch(pagination, /sr-only[^\n]*More/)
  assert.doesNotMatch(breadcrumb, /sr-only[^\n]*More/)
})

test("modal contracts include localization, scrolling, and safe areas", async () => {
  const [dialog, sheet] = await Promise.all([source("dialog"), source("sheet")])
  assert.match(dialog, /closeLabel = "Close"/)
  assert.match(dialog, /max-h-\[calc\(100dvh-env\(safe-area-inset-top\)/)
  assert.match(sheet, /closeLabel = "Close"/)
  assert.match(sheet, /overflow-y-auto/)
  assert.match(sheet, /safe-area-inset-bottom/)
  assert.match(sheet, /SheetOverlay,[\s\S]*SheetPortal,/)
})

test("normal targets are 44px while xs remains explicitly dense", async () => {
  const [button, tabs, sidebar] = await Promise.all([
    source("button"),
    source("tabs"),
    source("sidebar"),
  ])
  assert.match(button, /xs: "h-8/)
  assert.match(button, /"icon-xs":[\s\S]*"size-8/)
  assert.match(button, /"icon-sm":[\s\S]*"size-11/)
  assert.match(tabs, /min-h-11/)
  assert.match(sidebar, /default: "min-h-11/)
  assert.match(sidebar, /xs: "h-7/)
})

test("built-in navigation labels expose localization props", async () => {
  const [pagination, breadcrumb, sidebar] = await Promise.all([
    source("pagination"),
    source("breadcrumb"),
    source("sidebar"),
  ])
  assert.match(pagination, /label = "Pagination"/)
  assert.match(pagination, /label = "Go to previous page"/)
  assert.match(breadcrumb, /label = "Breadcrumb"/)
  assert.match(sidebar, /mobileTitle = "Sidebar"/)
  assert.match(sidebar, /label = "Toggle sidebar"/)
})

test("the stable scrollbar gutter does not offset both viewport edges", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8")
  assert.match(styles, /scrollbar-gutter: stable;/)
  assert.doesNotMatch(styles, /scrollbar-gutter: stable both-edges/)
})
