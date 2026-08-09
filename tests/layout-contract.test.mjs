import assert from "node:assert/strict"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import {
  BentoGrid,
  BentoGridItem,
  Card,
  Container,
  EditorialGrid,
  Section,
  buttonVariants,
  cardVariants,
  containerVariants,
  headingVariants,
  sectionVariants,
  textVariants,
} from "../dist/index.js"
import { readRoot, readUiSource } from "./lib/source.mjs"

test("the stable scrollbar gutter does not offset both viewport edges", async () => {
  const styles = await readRoot("src/styles.css")
  assert.match(styles, /scrollbar-gutter: stable;/)
  assert.doesNotMatch(styles, /scrollbar-gutter: stable both-edges/)
})

test("layout primitives centralize width and rhythm without fixing document semantics", async () => {
  const index = await readRoot("src/index.ts")
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
        {
          render: React.createElement("article"),
          density: "hero",
          bordered: false,
        },
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
  const tokens = await readRoot("src/tokens.css")
  assert.match(tokens, /--page-gutter: 20px;/)
  assert.match(tokens, /--container-reading: 44rem;/)
  assert.match(tokens, /--container-standard: 80rem;/)
  assert.match(tokens, /--container-wide: 90rem;/)
  assert.match(tokens, /--section-compact: 40px;/)
  assert.match(tokens, /--section-default: 56px;/)
  assert.match(tokens, /--section-hero: 72px;/)
  assert.match(tokens, /--layout-gap: 32px;/)
  assert.match(tokens, /--content-stack: 24px;/)
  assert.match(tokens, /--card-grid-gap: 20px;/)
  assert.match(tokens, /--card-grid-gap-compact: 16px;/)
  assert.match(
    tokens,
    /@media \(min-width: 40rem\)[\s\S]*?--page-gutter: 24px;[\s\S]*?--section-compact: 56px;[\s\S]*?--section-default: 80px;[\s\S]*?--section-hero: 96px;[\s\S]*?--layout-gap: 48px;[\s\S]*?--content-stack: 32px;/
  )
  assert.match(
    tokens,
    /@media \(min-width: 64rem\)[\s\S]*?--page-gutter: 32px;[\s\S]*?--section-default: 96px;[\s\S]*?--section-hero: 112px;[\s\S]*?--layout-gap: 64px;[\s\S]*?--content-stack: 40px;/
  )
  assert.match(
    tokens,
    /@media \(min-width: 96rem\)[\s\S]*?--page-gutter: 40px;/
  )
})

test("editorial motion and typography contracts are reusable and inheritable", async () => {
  const tokens = await readRoot("src/tokens.css")
  for (const token of [
    "motion-duration-slow",
    "motion-easing-emphasized",
    "motion-distance-8",
    "motion-distance-16",
    "motion-distance-24",
  ]) {
    assert.match(tokens, new RegExp(`--${token}:`))
  }
  assert.match(headingVariants({ variant: "hero" }), /mivama-heading-hero/)
  assert.match(
    headingVariants({ variant: "statement" }),
    /mivama-heading-statement/
  )
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
    readRoot("src/styles.css"),
    readUiSource("bento-grid"),
  ])
  assert.doesNotMatch(bento, /["']use client["']/)
  assert.match(
    styles,
    /\.mivama-bento-grid \{[\s\S]*grid-template-columns: minmax\(0, 1fr\);/
  )
  assert.match(
    styles,
    /@media \(min-width: 40rem\)[\s\S]*\.mivama-bento-grid-item\[data-span="2"\] \{[\s\S]*grid-column: span 2;/
  )
  assert.match(
    renderToStaticMarkup(React.createElement(BentoGrid)),
    /data-slot="bento-grid"/
  )
  assert.match(
    renderToStaticMarkup(React.createElement(BentoGridItem, { span: 2 })),
    /data-span="2"/
  )
})

test("large cards stay compact on phones and expand from sm upward", async () => {
  const card = await readUiSource("card")
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
  assert.match(
    cardVariants({ variant: "instrument" }),
    /text-instrument-foreground/
  )
  assert.match(
    cardVariants({ variant: "instrument" }),
    /ring-instrument-border/
  )

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
