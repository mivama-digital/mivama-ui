import * as React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  ScrollLayer,
  ScrollScene,
} from "../../src/components/ui/scroll-scene.js"

describe("ScrollScene", () => {
  it("publishes stable scene and layer metadata with safe defaults", () => {
    const { container } = render(
      <ScrollScene id="scene" className="custom-scene">
        <ScrollLayer id="layer" className="custom-layer">
          Content
        </ScrollLayer>
      </ScrollScene>
    )

    const scene = container.querySelector('[data-slot="scroll-scene"]')
    const layer = container.querySelector('[data-slot="scroll-layer"]')

    expect(scene).toHaveAttribute("id", "scene")
    expect(scene).toHaveClass("mivama-scroll-scene", "custom-scene")
    expect(layer).toHaveAttribute("id", "layer")
    expect(layer).toHaveClass("mivama-scroll-layer", "custom-layer")
    expect(layer).toHaveAttribute("data-effect", "reveal")
    expect(layer).toHaveAttribute("data-direction", "up")
    expect(layer).toHaveAttribute("data-distance", "16")
  })

  it("keeps multiple and nested scenes as independent composition boundaries", () => {
    const { container } = render(
      <>
        <ScrollScene data-testid="scene-a">
          <ScrollLayer effect="parallax" direction="down" distance={48}>
            A
          </ScrollLayer>
          <ScrollScene data-testid="scene-nested">
            <ScrollLayer distance={8}>Nested</ScrollLayer>
          </ScrollScene>
        </ScrollScene>
        <ScrollScene data-testid="scene-b">
          <ScrollLayer distance={24}>B</ScrollLayer>
        </ScrollScene>
      </>
    )

    const scenes = container.querySelectorAll('[data-slot="scroll-scene"]')
    const layers = container.querySelectorAll('[data-slot="scroll-layer"]')

    expect(scenes).toHaveLength(3)
    expect(layers).toHaveLength(3)
    expect(layers[0]).toHaveAttribute("data-effect", "parallax")
    expect(layers[0]).toHaveAttribute("data-direction", "down")
    expect(layers[0]).toHaveAttribute("data-distance", "48")
    expect(layers[1]).toHaveAttribute("data-distance", "8")
    expect(layers[2]).toHaveAttribute("data-distance", "24")
  })
})
