import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axe from "axe-core"
import { describe, expect, it } from "vitest"

import { MivamaProvider } from "../../src/components/mivama-provider.js"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/ui/dialog.js"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../../src/components/ui/sheet.js"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../src/components/ui/tooltip.js"

function DialogFixture({ portal }: { portal?: HTMLElement }) {
  return (
    <MivamaProvider portalContainer={portal}>
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent closeLabel="Close settings">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure the application.</DialogDescription>
          <button type="button">Save</button>
        </DialogContent>
      </Dialog>
    </MivamaProvider>
  )
}

function SheetFixture() {
  return (
    <MivamaProvider>
      <Sheet>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent side="left" size="md" closeLabel="Close navigation">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Choose a destination.</SheetDescription>
          <a href="#dashboard">Dashboard</a>
        </SheetContent>
      </Sheet>
    </MivamaProvider>
  )
}

describe("overlay components", () => {
  it("opens and closes a dialog, restores focus, and uses the provider portal", async () => {
    const user = userEvent.setup()
    const portal = document.createElement("div")
    portal.dataset.testid = "portal"
    document.body.append(portal)

    render(<DialogFixture portal={portal} />)

    const trigger = screen.getByRole("button", { name: "Open dialog" })
    await user.click(trigger)

    const dialog = await screen.findByRole("dialog", { name: "Settings" })
    expect(portal).toContainElement(dialog)
    expect(
      screen.getByRole("button", { name: "Close settings" })
    ).toBeInTheDocument()

    const results = await axe.run(dialog)
    expect(results.violations).toEqual([])

    await user.keyboard("{Escape}")
    await waitFor(() => expect(dialog).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()

    portal.remove()
  })

  it("exposes sheet side, size, accessible naming, and close behavior", async () => {
    const user = userEvent.setup()
    render(<SheetFixture />)

    const trigger = screen.getByRole("button", { name: "Open sheet" })
    await user.click(trigger)

    const sheet = await screen.findByRole("dialog", { name: "Navigation" })
    expect(sheet).toHaveAttribute("data-side", "left")
    expect(sheet).toHaveAttribute("data-size", "md")
    expect(
      screen.getByRole("button", { name: "Close navigation" })
    ).toBeInTheDocument()

    const results = await axe.run(sheet)
    expect(results.violations).toEqual([])

    await user.click(screen.getByRole("button", { name: "Close navigation" }))
    await waitFor(() => expect(sheet).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it("shows a tooltip for keyboard focus and dismisses it with Escape", async () => {
    const user = userEvent.setup()
    render(
      <MivamaProvider>
        <TooltipProvider delay={0}>
          <Tooltip>
            <TooltipTrigger>Help</TooltipTrigger>
            <TooltipContent>Helpful information</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </MivamaProvider>
    )

    const trigger = screen.getByRole("button", { name: "Help" })
    await user.tab()
    expect(trigger).toHaveFocus()

    const tooltip = await screen.findByRole("tooltip")
    expect(tooltip).toHaveTextContent("Helpful information")
    expect(trigger).toHaveAccessibleDescription("Helpful information")

    const results = await axe.run(document.body)
    expect(results.violations).toEqual([])

    await user.keyboard("{Escape}")
    await waitFor(() => expect(tooltip).not.toBeInTheDocument())
  })
})
