import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axe from "axe-core"
import { describe, expect, it, vi } from "vitest"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  Fieldset,
} from "../../src/components/ui/field.js"
import { Input } from "../../src/components/ui/input.js"
import { Switch } from "../../src/components/ui/switch.js"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../src/components/ui/tabs.js"

describe("tabs, switch, and form primitives", () => {
  it("supports keyboard tab selection and exposes the active panel", async () => {
    const user = userEvent.setup()

    render(
      <Tabs defaultValue="account">
        <TabsList aria-label="Settings sections">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account settings</TabsContent>
        <TabsContent value="security">Security settings</TabsContent>
      </Tabs>
    )

    const accountTab = screen.getByRole("tab", { name: "Account" })
    const securityTab = screen.getByRole("tab", { name: "Security" })

    expect(accountTab).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account settings")

    accountTab.focus()
    await user.keyboard("{ArrowRight}")
    expect(securityTab).toHaveFocus()
    expect(securityTab).toHaveAttribute("aria-selected", "false")

    await user.keyboard("{Enter}")
    expect(securityTab).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Security settings")

    const results = await axe.run(screen.getByRole("tablist").parentElement!)
    expect(results.violations).toEqual([])
  })

  it("toggles a switch and reports checked and disabled state", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()

    const { rerender } = render(
      <Switch aria-label="Enable alerts" onCheckedChange={onCheckedChange} />
    )

    const toggle = screen.getByRole("switch", { name: "Enable alerts" })
    expect(toggle).not.toBeChecked()

    await user.click(toggle)
    expect(toggle).toBeChecked()
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())

    rerender(<Switch aria-label="Enable alerts" disabled defaultChecked />)
    expect(toggle).toBeDisabled()

    const results = await axe.run(toggle)
    expect(results.violations).toEqual([])
  })

  it("connects labels, descriptions, errors, and disabled fieldsets", async () => {
    render(
      <Fieldset disabled>
        <FieldLegend>Profile</FieldLegend>
        <Field>
          <FieldLabel htmlFor="display-name">Display name</FieldLabel>
          <Input
            id="display-name"
            aria-describedby="display-name-description display-name-error"
            aria-invalid="true"
          />
          <FieldDescription id="display-name-description">
            Shown to other team members.
          </FieldDescription>
          <FieldError id="display-name-error">A display name is required.</FieldError>
        </Field>
      </Fieldset>
    )

    const input = screen.getByRole("textbox", { name: "Display name" })
    expect(input).toBeDisabled()
    expect(input).toHaveAccessibleDescription(
      "Shown to other team members. A display name is required."
    )
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByRole("group", { name: "Profile" })).toBeDisabled()

    const results = await axe.run(screen.getByRole("group", { name: "Profile" }))
    expect(results.violations).toEqual([])
  })
})
