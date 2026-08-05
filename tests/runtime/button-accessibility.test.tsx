import axe from "axe-core"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Button } from "../../src/components/ui/button.js"

describe("Button", () => {
  it("supports activation and loading semantics", async () => {
    const user = userEvent.setup()
    let activations = 0
    const { rerender } = render(
      <Button onClick={() => activations++}>Save</Button>
    )

    await user.click(screen.getByRole("button", { name: "Save" }))
    expect(activations).toBe(1)

    rerender(<Button loading>Save</Button>)
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
  })

  it("has no automated accessibility violations", async () => {
    const { container } = render(<Button>Continue</Button>)
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })
})
