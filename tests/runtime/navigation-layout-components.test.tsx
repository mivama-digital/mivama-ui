import * as React from "react"
import { render, screen } from "@testing-library/react"
import axe from "axe-core"
import { describe, expect, it } from "vitest"

import { BentoGrid, BentoGridItem } from "../../src/components/ui/bento-grid.js"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../src/components/ui/breadcrumb.js"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card.js"
import { Container } from "../../src/components/ui/container.js"
import { EditorialGrid } from "../../src/components/ui/editorial-grid.js"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../src/components/ui/pagination.js"
import {
  ScrollLayer,
  ScrollScene,
} from "../../src/components/ui/scroll-scene.js"
import { Section } from "../../src/components/ui/section.js"
import { Eyebrow, Heading, Text } from "../../src/components/ui/typography.js"

describe("navigation and layout components", () => {
  it("composes breadcrumb navigation with a localized label and current page", async () => {
    const { container } = render(
      <Breadcrumb label="Project trail">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Design system</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    expect(
      screen.getByRole("navigation", { name: "Project trail" })
    ).toBeVisible()
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/projects"
    )
    expect(screen.getByRole("link", { name: "Design system" })).toHaveAttribute(
      "aria-current",
      "page"
    )

    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it("marks the active pagination link and keeps localized navigation controls", async () => {
    const { container } = render(
      <Pagination label="Result pages">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="/results?page=1"
              label="Previous results"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/results?page=2" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/results?page=3" label="Next results" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )

    expect(
      screen.getByRole("navigation", { name: "Result pages" })
    ).toBeVisible()
    expect(
      screen.getByRole("link", { name: "Previous results" })
    ).toHaveAttribute("href", "/results?page=1")
    const active = screen.getByRole("link", { name: "2" })
    expect(active).toHaveAttribute("aria-current", "page")
    expect(active).toHaveAttribute("data-active", "true")
    expect(screen.getByRole("link", { name: "Next results" })).toHaveAttribute(
      "href",
      "/results?page=3"
    )

    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it("preserves polymorphic container and section semantics", async () => {
    const { container } = render(
      <Container
        size="reading"
        gutter={false}
        render={<main aria-label="Article shell" />}
      >
        <Section
          density="hero"
          tone="brand"
          bordered={false}
          render={<article aria-label="Lead story" />}
        >
          Story
        </Section>
      </Container>
    )

    const shell = screen.getByRole("main", { name: "Article shell" })
    expect(shell).toHaveAttribute("data-slot", "container")
    expect(shell).toHaveClass("max-w-(--container-reading)")
    expect(shell).not.toHaveClass("px-(--page-gutter)")

    const section = screen.getByRole("article", { name: "Lead story" })
    expect(section).toHaveAttribute("data-slot", "section")
    expect(section).toHaveClass("py-(--section-hero)")
    expect(section).toHaveClass("bg-brand")
    expect(section).not.toHaveClass("border-b")

    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it("exposes card size and visual variant without replacing heading semantics", async () => {
    const { container } = render(
      <Card variant="instrument" size="lg">
        <CardHeader>
          <CardTitle render={<h2 />}>System status</CardTitle>
        </CardHeader>
        <CardContent>All services operational.</CardContent>
        <CardFooter>Updated now</CardFooter>
      </Card>
    )

    const card = container.querySelector('[data-slot="card"]')
    expect(card).toHaveAttribute("data-variant", "instrument")
    expect(card).toHaveAttribute("data-size", "lg")
    expect(card).toHaveClass("bg-instrument")
    expect(
      screen.getByRole("heading", { level: 2, name: "System status" })
    ).toBeVisible()

    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it("publishes deterministic grid and scroll metadata", () => {
    const { container } = render(
      <>
        <BentoGrid>
          <BentoGridItem span={2}>Wide card</BentoGridItem>
        </BentoGrid>
        <EditorialGrid>Editorial tracks</EditorialGrid>
        <ScrollScene>
          <ScrollLayer effect="parallax" direction="down" distance={48}>
            Moving layer
          </ScrollLayer>
          <ScrollLayer>Static fallback layer</ScrollLayer>
        </ScrollScene>
      </>
    )

    expect(container.querySelector('[data-slot="bento-grid"]')).toHaveClass(
      "mivama-bento-grid"
    )
    expect(
      container.querySelector('[data-slot="bento-grid-item"]')
    ).toHaveAttribute("data-span", "2")
    expect(container.querySelector('[data-slot="editorial-grid"]')).toHaveClass(
      "mivama-editorial-grid"
    )

    const layers = container.querySelectorAll('[data-slot="scroll-layer"]')
    expect(layers[0]).toHaveAttribute("data-effect", "parallax")
    expect(layers[0]).toHaveAttribute("data-direction", "down")
    expect(layers[0]).toHaveAttribute("data-distance", "48")
    expect(layers[1]).toHaveAttribute("data-effect", "reveal")
    expect(layers[1]).toHaveAttribute("data-direction", "up")
    expect(layers[1]).toHaveAttribute("data-distance", "16")
  })

  it("keeps typography role, element, and tone independent", async () => {
    const { container } = render(
      <>
        <Heading render={<h1 />} variant="display" tone="inherit">
          Product heading
        </Heading>
        <Text render={<span />} variant="signal">
          Signal 01
        </Text>
        <Eyebrow>Metadata</Eyebrow>
      </>
    )

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Product heading",
    })
    expect(heading).toHaveClass("mivama-heading-display")
    expect(heading).toHaveClass("mivama-tone-inherit")
    expect(screen.getByText("Signal 01").tagName).toBe("SPAN")
    expect(screen.getByText("Signal 01")).toHaveClass("mivama-text-signal")
    expect(screen.getByText("Metadata")).toHaveClass("mivama-text-eyebrow")

    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })
})
