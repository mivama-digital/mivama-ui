import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import {
  Alert,
  BentoGrid,
  BentoGridItem,
  Card,
  Choice,
  ChoiceGroup,
  Container,
  EditorialGrid,
  EmptyDescription,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  Fieldset,
  ScrollLayer,
  ScrollScene,
  Select,
  Section,
  badgeVariants,
  buttonVariants,
  cardVariants,
  containerVariants,
  headingVariants,
  sectionVariants,
  textVariants,
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

test("sheets expose reusable overlays and typed horizontal sizes", async () => {
  const [index, sheet] = await Promise.all([
    readFile(new URL("../src/index.ts", import.meta.url), "utf8"),
    source("sheet"),
  ])
  assert.match(sheet, /type SheetSize = "sm" \| "md" \| "full"/)
  assert.match(sheet, /overlayClassName\?: string/)
  assert.match(sheet, /side = "right"/)
  assert.match(sheet, /size = "sm"/)
  assert.match(sheet, /<SheetOverlay className=\{overlayClassName\} \/>/)
  assert.match(sheet, /sm: "[^"]*w-3\/4[^"]*sm:max-w-sm/)
  assert.match(sheet, /md: "[^"]*w-full[^"]*sm:max-w-lg/)
  assert.match(sheet, /full: "[^"]*w-full[^"]*max-w-none/)
  assert.match(index, /export type \{ SheetContentProps, SheetSize \}/)
  assert.doesNotMatch(sheet, /navigation/i)
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
  assert.doesNotMatch(sectionVariants(), /bg-(?:surface|accent)/)
  assert.match(sectionVariants({ tone: "muted" }), /bg-surface/)
  assert.match(sectionVariants({ tone: "accent" }), /bg-accent/)
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
  assert.match(index, /export type \{ CardProps \}/)
})

test("layout tokens preserve the approved responsive website rhythm", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8")
  assert.match(styles, /--page-gutter: 20px;/)
  assert.match(styles, /--container-reading: 44rem;/)
  assert.match(styles, /--container-standard: 80rem;/)
  assert.match(styles, /--container-wide: 90rem;/)
  assert.match(styles, /--section-compact: 40px;/)
  assert.match(styles, /--section-default: 56px;/)
  assert.match(styles, /--section-hero: 72px;/)
  assert.match(styles, /--layout-gap: 32px;/)
  assert.match(styles, /--content-stack: 24px;/)
  assert.match(styles, /--card-grid-gap: 20px;/)
  assert.match(styles, /--card-grid-gap-compact: 16px;/)
  assert.match(
    styles,
    /@media \(min-width: 40rem\)[\s\S]*?--page-gutter: 24px;[\s\S]*?--section-compact: 56px;[\s\S]*?--section-default: 80px;[\s\S]*?--section-hero: 96px;[\s\S]*?--layout-gap: 48px;[\s\S]*?--content-stack: 32px;/
  )
  assert.match(
    styles,
    /@media \(min-width: 64rem\)[\s\S]*?--page-gutter: 32px;[\s\S]*?--section-default: 96px;[\s\S]*?--section-hero: 112px;[\s\S]*?--layout-gap: 64px;[\s\S]*?--content-stack: 40px;/
  )
  assert.match(styles, /@media \(min-width: 96rem\)[\s\S]*?--page-gutter: 40px;/)
})

test("semantic surface, focus, shadow, overlay, and motion tokens are reusable", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8")
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
    assert.match(styles, new RegExp(`--${token}:`))
  }
  assert.match(styles, /--color-surface: var\(--surface\);/)
  assert.match(styles, /--color-surface-elevated: var\(--surface-elevated\);/)
  assert.match(styles, /--color-border-strong: var\(--border-strong\);/)
  assert.match(styles, /--color-overlay: var\(--overlay\);/)
  assert.match(styles, /--focus-ring: #0c62ed;/)
  assert.match(styles, /--primary: #0c62ed;/)

  const light = styles.slice(styles.indexOf(":root {"), styles.indexOf(".dark {"))
  const dark = styles.slice(styles.indexOf(".dark {"), styles.indexOf("@layer components"))
  const value = (block, token) =>
    block.match(new RegExp(`--${token}: ([^;]+);`))?.[1]
  for (const theme of [light, dark]) {
    assert.notEqual(value(theme, "background"), value(theme, "surface"))
    assert.notEqual(value(theme, "surface"), value(theme, "surface-elevated"))
  }
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
  assert.match(styles, /font-size: clamp\(3rem, 7vw, 5rem\);/)
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
    readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
    source("button"),
    source("card"),
    source("sheet"),
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
  assert.match(navigation, /min-h-11/)
  assert.match(navigation, /hover:bg-surface/)
  assert.match(navigation, /aria-expanded:bg-surface/)
  assert.match(navigation, /aria-\[current=page\]:bg-accent/)
  assert.match(navigation, /focus-visible:ring-3/)
  assert.match(buttonVariants(), /bg-primary/)
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
  assert.equal((styles.match(/^\s+--primary-hover:/gm) ?? []).length, 4)
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

test("editorial theme is opt-in and carries the verified light and dark palette", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8")
  const editorial = styles.slice(
    styles.indexOf(".mivama-editorial-theme {"),
    styles.indexOf(".dark {")
  )
  const editorialDark = styles.slice(
    styles.indexOf(".dark .mivama-editorial-theme,"),
    styles.indexOf("@layer components")
  )
  assert.match(editorial, /--editorial-paper: #f3f4ef;/)
  assert.match(editorial, /--editorial-cobalt: #1649ff;/)
  assert.match(editorial, /--editorial-lime: #c9ff45;/)
  assert.match(editorial, /--editorial-instrument: #0b1018;/)
  assert.match(editorialDark, /--editorial-paper: #080b10;/)
  assert.match(editorialDark, /--editorial-cobalt: #7792ff;/)
  assert.doesNotMatch(styles.slice(styles.indexOf(":root {"), styles.indexOf(".mivama-editorial-theme {")), /--editorial-paper:/)
})

test("editorial motion and typography contracts are reusable and inheritable", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8")
  for (const token of [
    "motion-duration-slow",
    "motion-easing-emphasized",
    "motion-distance-8",
    "motion-distance-16",
    "motion-distance-24",
  ]) {
    assert.match(styles, new RegExp(`--${token}:`))
  }
  assert.match(headingVariants({ variant: "hero" }), /mivama-heading-hero/)
  assert.match(headingVariants({ variant: "statement" }), /mivama-heading-statement/)
  assert.match(textVariants({ variant: "signal" }), /mivama-text-signal/)
  assert.match(textVariants({ tone: "inherit" }), /mivama-tone-inherit/)
})

test("editorial layout and section variants expose additive contracts", () => {
  assert.match(sectionVariants({ tone: "brand" }), /bg-brand/)
  assert.match(sectionVariants({ tone: "instrument" }), /bg-instrument/)
  assert.match(buttonVariants({ variant: "inverse" }), /bg-primary-foreground/)
  assert.match(
    renderToStaticMarkup(React.createElement(EditorialGrid, null, "Grid")),
    /data-slot="editorial-grid" class="mivama-editorial-grid"/
  )
})

test("bento grids stay server-compatible and expand spans only after mobile", async () => {
  const [styles, bento] = await Promise.all([
    readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
    source("bento-grid"),
  ])
  assert.doesNotMatch(bento, /["']use client["']/)
  assert.match(styles, /\.mivama-bento-grid \{[\s\S]*grid-template-columns: minmax\(0, 1fr\);/)
  assert.match(styles, /@media \(min-width: 40rem\)[\s\S]*\.mivama-bento-grid-item\[data-span="2"\] \{[\s\S]*grid-column: span 2;/)
  assert.match(renderToStaticMarkup(React.createElement(BentoGrid)), /data-slot="bento-grid"/)
  assert.match(renderToStaticMarkup(React.createElement(BentoGridItem, { span: 2 })), /data-span="2"/)
})

test("field, choice, and select primitives retain native server-rendered semantics", () => {
  assert.match(renderToStaticMarkup(React.createElement(FieldLabel, { htmlFor: "email" }, "Email")), /^<label/)
  assert.match(renderToStaticMarkup(React.createElement(FieldDescription, { id: "hint" }, "Hint")), /^<p/)
  assert.match(renderToStaticMarkup(React.createElement(FieldError, { id: "error" }, "Error")), /^<p/)
  assert.match(renderToStaticMarkup(React.createElement(Fieldset)), /^<fieldset/)
  assert.match(renderToStaticMarkup(React.createElement(FieldLegend, null, "Options")), /^<legend/)
  assert.match(renderToStaticMarkup(React.createElement(Choice, { type: "radio", name: "plan" })), /<input type="radio"/)
  assert.match(renderToStaticMarkup(React.createElement(ChoiceGroup)), /^<fieldset/)
  assert.match(renderToStaticMarkup(React.createElement(Select, { "aria-invalid": true })), /^<select/)
})

test("scroll scenes are server components with progressive transform-only motion", async () => {
  const [styles, scene] = await Promise.all([
    readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
    source("scroll-scene"),
  ])
  assert.doesNotMatch(scene, /["']use client["']/)
  assert.match(styles, /@supports \(animation-timeline: view\(\)\)/)
  assert.match(styles, /prefers-reduced-motion: no-preference/)
  assert.match(styles, /mivama-scroll-layer-parallax/)
  assert.match(styles, /data-effect="parallax"/)
  const keyframes = styles.slice(
    styles.indexOf("@keyframes mivama-scroll-layer-reveal"),
    styles.indexOf("@media (min-width: 48rem)")
  )
  assert.match(keyframes, /transform:/)
  assert.doesNotMatch(keyframes, /opacity|filter|top:|left:/)
  assert.match(renderToStaticMarkup(React.createElement(ScrollScene)), /data-slot="scroll-scene"/)
  assert.match(renderToStaticMarkup(React.createElement(ScrollLayer, { distance: 24 })), /data-distance="24"/)
  assert.match(renderToStaticMarkup(React.createElement(ScrollLayer, { effect: "parallax", distance: 48 })), /data-effect="parallax"[^>]*data-distance="48"|data-distance="48"[^>]*data-effect="parallax"/)
})

test("large cards stay compact on phones and expand from sm upward", async () => {
  const card = await source("card")
  assert.match(card, /data-\[size=lg\]:\[--card-spacing:--spacing\(6\)\]/)
  assert.match(card, /sm:data-\[size=lg\]:\[--card-spacing:--spacing\(8\)\]/)
  assert.match(card, /data-\[size=sm\]:\[--card-spacing:--spacing\(4\)\]/)
})

test("card variants preserve the surface default and pair hover with focus-within", () => {
  assert.match(cardVariants(), /bg-card/)
  assert.match(cardVariants(), /ring-1 ring-border/)
  assert.match(cardVariants({ variant: "subtle" }), /bg-surface/)
  assert.match(cardVariants({ variant: "outline" }), /bg-transparent/)
  assert.match(cardVariants({ variant: "outline" }), /ring-border-strong/)
  assert.match(cardVariants({ variant: "instrument" }), /bg-instrument/)
  assert.match(cardVariants({ variant: "instrument" }), /text-instrument-foreground/)
  assert.match(cardVariants({ variant: "instrument" }), /ring-instrument-border/)

  const interactive = cardVariants({ variant: "interactive" })
  for (const state of [
    "bg-surface-elevated",
    "ring-border-strong",
    "shadow-(--shadow-subtle)",
  ]) {
    assert.ok(interactive.includes(`hover:${state}`))
    assert.ok(interactive.includes(`focus-within:${state}`))
  }
  assert.doesNotMatch(interactive, /(?:hover|focus-within):border(?:-|\b)/)
  assert.match(interactive, /motion-reduce:transition-none/)
  assert.match(
    renderToStaticMarkup(React.createElement(Card)),
    /data-variant="surface"[^>]*class="[^"]*bg-card/
  )
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
  assert.doesNotMatch(input, /@base-ui\/react\/input/)
  assert.match(input, /<input/)
  assert.match(input, /disabled:cursor-not-allowed/)
  assert.match(input, /disabled:bg-input\/50/)
  assert.match(input, /disabled:opacity-50/)
  assert.doesNotMatch(input, /disabled:pointer-events-none/)
})

test("package metadata, subpaths, and consumer archive instructions target 2.3.0", async () => {
  const [packageJson, lockfile, readme] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../package-lock.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ])
  assert.equal(packageJson.version, "2.3.0")
  assert.equal(lockfile.version, "2.3.0")
  assert.equal(lockfile.packages[""].version, "2.3.0")
  for (const subpath of ["button", "sheet", "card", "scroll-scene", "bento-grid", "forms"]) {
    assert.ok(packageJson.exports[`./${subpath}`])
  }
  assert.match(readme, /npm run verify/)
  assert.match(readme, /npm pack --ignore-scripts --pack-destination/)
  assert.match(readme, /mivama-ui-2\.3\.0\.tgz/)
})
