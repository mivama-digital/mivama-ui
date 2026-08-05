import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  MivamaProvider,
  useMivamaPortalContainer,
} from "../../src/components/mivama-provider.js"

function PortalProbe() {
  const portalContainer = useMivamaPortalContainer()
  const resolved =
    portalContainer && "current" in portalContainer
      ? portalContainer.current
      : portalContainer

  return (
    <output data-testid="portal-probe">
      {resolved instanceof HTMLElement ? resolved.dataset.mivamaTheme : "none"}
    </output>
  )
}

describe("MivamaProvider", () => {
  it("applies default theme and density attributes", () => {
    render(
      <MivamaProvider data-testid="shell">
        <PortalProbe />
      </MivamaProvider>
    )

    const shell = screen.getByTestId("shell")
    expect(shell).toHaveAttribute("data-mivama-theme", "product")
    expect(shell).toHaveAttribute("data-density", "comfortable")
  })

  it("supports custom theme, density, className, and forwarded refs", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <MivamaProvider
        ref={ref}
        theme="dashboard"
        density="compact"
        className="custom-shell"
      />
    )

    expect(ref.current).toHaveAttribute("data-mivama-theme", "dashboard")
    expect(ref.current).toHaveAttribute("data-density", "compact")
    expect(ref.current).toHaveClass("isolate", "custom-shell")
  })

  it("uses an explicit portal container", () => {
    const portal = document.createElement("div")
    portal.dataset.mivamaTheme = "external"
    render(
      <MivamaProvider portalContainer={portal}>
        <PortalProbe />
      </MivamaProvider>
    )

    expect(screen.getByTestId("portal-probe")).toHaveTextContent("external")
  })
})
