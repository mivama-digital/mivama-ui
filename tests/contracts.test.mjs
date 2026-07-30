import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import {
  Alert,
  Container,
  EmptyDescription,
  Section,
  badgeVariants,
  buttonVariants,
  containerVariants,
  sectionVariants,
} from "../dist/index.js"

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
  assert.match(button, /xs: "min-h-8/)
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

test("layout primitives centralize width and rhythm without fixing document semantics", async () => {
  const index = await readFile(new URL("../src/index.ts", import.meta.url), "utf8")
  assert.match(containerVariants(), /max-w-\(--container-standard\)/)
  assert.match(containerVariants(), /px-\(--page-gutter\)/)
  assert.match(sectionVariants(), /py-\(--section-default\)/)
  assert.match(sectionVariants(), /border-b/)
  assert.match(
    renderToStaticMarkup(
      React.createElement(
        Container,
        { render: React.createElement("main"), size: "reading", gutter: false },
        "Content"
      )
    ),
    /^<main[^>]*class="[^"]*max-w-\(--container-reading\)/
  )
  assert.match(
    renderToStaticMarkup(
      React.createElement(
        Section,
        { render: React.createElement("article"), density: "hero", bordered: false },
        "Content"
      )
    ),
    /^<article[^>]*class="[^"]*py-\(--section-hero\)/
  )
  assert.match(index, /export type \{ ContainerProps \}/)
  assert.match(index, /export type \{ SectionProps \}/)
})

test("layout tokens preserve the approved responsive website rhythm", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8")
  assert.match(styles, /--page-gutter: 20px;/)
  assert.match(styles, /--container-reading: 44rem;/)
  assert.match(styles, /--container-standard: 80rem;/)
  assert.match(styles, /--container-wide: 90rem;/)
  assert.match(styles, /--section-compact: 40px;/)
  assert.match(styles, /--section-default: 56px;/)
  assert.match(styles, /--section-hero: 64px;/)
  assert.match(styles, /--card-grid-gap: 20px;/)
  assert.match(styles, /--card-grid-gap-compact: 16px;/)
  assert.match(
    styles,
    /@media \(min-width: 40rem\)[\s\S]*?--page-gutter: 24px;[\s\S]*?--section-compact: 56px;[\s\S]*?--section-default: 80px;[\s\S]*?--section-hero: 96px;/
  )
  assert.match(
    styles,
    /@media \(min-width: 64rem\)[\s\S]*?--page-gutter: 32px;[\s\S]*?--section-default: 96px;[\s\S]*?--section-hero: 112px;/
  )
  assert.match(styles, /@media \(min-width: 96rem\)[\s\S]*?--page-gutter: 40px;/)
})

test("shared headings reflow only when a word cannot fit", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8")
  const headingRules = styles.slice(
    styles.indexOf(".mivama-heading-display,"),
    styles.indexOf(".mivama-heading-display {")
  )
  assert.match(headingRules, /min-width: 0;/)
  assert.match(headingRules, /hyphens: auto;/)
  assert.match(headingRules, /overflow-wrap: anywhere;/)
  assert.doesNotMatch(headingRules, /word-break: break-all/)
  assert.equal((styles.match(/!important/g) ?? []).length, 4)
})

test("wrapping variants opt into shrinking and emergency label reflow", async () => {
  const [button, badge] = await Promise.all([source("button"), source("badge")])
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
  const [styles, button, badge] = await Promise.all([
    readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
    source("button"),
    source("badge"),
  ])
  assert.match(styles, /--color-primary-hover: var\(--primary-hover\);/)
  assert.equal((styles.match(/^\s+--primary-hover:/gm) ?? []).length, 2)
  assert.match(button, /hover:bg-primary-hover/)
  assert.doesNotMatch(button, /hover:bg-primary\/80/)
  assert.match(button, /focus-visible:ring-3 focus-visible:ring-ring /)
  assert.doesNotMatch(button, /focus-visible:ring-ring\/50/)
  assert.match(badge, /\[a\]:hover:bg-primary-hover/)
  assert.doesNotMatch(badge, /\[a\]:hover:bg-primary\/80/)
})

test("native controls inherit the active light or dark color scheme", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8")
  assert.match(styles, /:root \{\s+color-scheme: light;/)
  assert.match(styles, /\.dark \{\s+color-scheme: dark;/)
})

test("large cards stay compact on phones and expand from sm upward", async () => {
  const card = await source("card")
  assert.match(card, /data-\[size=lg\]:\[--card-spacing:--spacing\(6\)\]/)
  assert.match(card, /sm:data-\[size=lg\]:\[--card-spacing:--spacing\(8\)\]/)
  assert.match(card, /data-\[size=sm\]:\[--card-spacing:--spacing\(4\)\]/)
})

test("built-in modal closes reserve title space without taxing custom composition", async () => {
  const [dialog, sheet] = await Promise.all([source("dialog"), source("sheet")])
  assert.match(
    dialog,
    /showCloseButton &&\s+"\[&>\[data-slot=dialog-header\]\]:pr-12 \[&>\[data-slot=dialog-title\]\]:pr-12"/
  )
  assert.match(
    sheet,
    /showCloseButton &&\s+"\[&>\[data-slot=sheet-header\]\]:pr-16 \[&>\[data-slot=sheet-title\]\]:pr-16"/
  )
  const dialogHeader = dialog.slice(
    dialog.indexOf("function DialogHeader"),
    dialog.indexOf("function DialogFooter")
  )
  const sheetHeader = sheet.slice(
    sheet.indexOf("function SheetHeader"),
    sheet.indexOf("function SheetFooter")
  )
  assert.doesNotMatch(dialogHeader, /\bpr-\d/)
  assert.doesNotMatch(sheetHeader, /\bpr-\d/)
})

test("disabled inputs keep their cursor feedback and remain inspectable", async () => {
  const input = await source("input")
  assert.match(input, /disabled:cursor-not-allowed/)
  assert.match(input, /disabled:bg-input\/50/)
  assert.match(input, /disabled:opacity-50/)
  assert.doesNotMatch(input, /disabled:pointer-events-none/)
})
