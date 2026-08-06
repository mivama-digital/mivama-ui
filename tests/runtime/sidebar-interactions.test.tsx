import * as React from "react"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  SidebarProvider,
  SidebarTrigger,
} from "../../src/components/ui/sidebar.js"

describe("sidebar interactions", () => {
  it("toggles through the accessible trigger and exposes expanded state", async () => {
    const user = userEvent.setup()

    render(
      <SidebarProvider defaultOpen>
        <SidebarTrigger label="Toggle navigation" />
      </SidebarProvider>
    )

    const trigger = screen.getByRole("button", { name: "Toggle navigation" })
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(trigger).toHaveAttribute("aria-controls")

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("toggles with Ctrl+B and prevents the browser shortcut", async () => {
    render(
      <SidebarProvider defaultOpen>
        <SidebarTrigger label="Toggle navigation" />
      </SidebarProvider>
    )

    const trigger = screen.getByRole("button", { name: "Toggle navigation" })
    const event = new KeyboardEvent("keydown", {
      key: "b",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })

    act(() => {
      document.body.dispatchEvent(event)
    })

    expect(event.defaultPrevented).toBe(true)
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "false")
    )
  })

  it("does not toggle while typing in editable elements", async () => {
    const user = userEvent.setup()

    render(
      <SidebarProvider defaultOpen>
        <SidebarTrigger label="Toggle navigation" />
        <input aria-label="Search" />
        <div contentEditable role="textbox" aria-label="Notes">
          <span>Editable text</span>
        </div>
      </SidebarProvider>
    )

    const trigger = screen.getByRole("button", { name: "Toggle navigation" })
    const search = screen.getByRole("textbox", { name: "Search" })
    const notes = screen.getByText("Editable text")

    await user.click(search)
    await user.keyboard("{Control>}b{/Control}")
    expect(trigger).toHaveAttribute("aria-expanded", "true")

    await user.click(notes)
    await user.keyboard("{Control>}b{/Control}")
    expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  it("reports requested state changes in controlled mode", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <SidebarProvider open onOpenChange={onOpenChange}>
        <SidebarTrigger label="Toggle navigation" />
      </SidebarProvider>
    )

    await user.click(screen.getByRole("button", { name: "Toggle navigation" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
