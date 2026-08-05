import { afterEach, describe, expect, it, vi } from "vitest"

import {
  parseSidebarState,
  persistSidebarState,
  readSidebarState,
} from "../../src/components/ui/sidebar-persistence.js"

afterEach(() => {
  window.localStorage.clear()
  document.cookie = "mivama-sidebar=; Max-Age=0; Path=/"
  vi.restoreAllMocks()
})

describe("sidebar persistence", () => {
  it("parses only valid boolean values", () => {
    expect(parseSidebarState("true")).toBe(true)
    expect(parseSidebarState("false")).toBe(false)
    expect(parseSidebarState("1")).toBeNull()
    expect(parseSidebarState(null)).toBeNull()
  })

  it("does nothing when persistence is disabled", () => {
    persistSidebarState(true, {
      persistence: "none",
      storageKey: "mivama-sidebar",
    })

    expect(window.localStorage.getItem("mivama-sidebar")).toBeNull()
    expect(document.cookie).not.toContain("mivama-sidebar=true")
  })

  it("writes and reads localStorage with an application-specific key", () => {
    const options = {
      persistence: "localStorage" as const,
      storageKey: "mivama-admin-sidebar",
    }

    persistSidebarState(false, options)

    expect(window.localStorage.getItem(options.storageKey)).toBe("false")
    expect(readSidebarState(options)).toBe(false)
  })

  it("writes a cookie with secure configurable attributes", () => {
    const cookieSetter = vi.spyOn(Document.prototype, "cookie", "set")

    persistSidebarState(true, {
      persistence: "cookie",
      storageKey: "mivama-sidebar",
      cookieOptions: {
        path: "/app",
        maxAge: 3600,
        sameSite: "Strict",
        secure: true,
      },
    })

    expect(cookieSetter).toHaveBeenCalledWith(
      "mivama-sidebar=true; Path=/app; Max-Age=3600; SameSite=Strict; Secure"
    )
  })

  it("ignores blocked storage instead of crashing the UI", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked")
    })

    expect(() =>
      persistSidebarState(true, {
        persistence: "localStorage",
        storageKey: "mivama-sidebar",
      })
    ).not.toThrow()
  })
})
