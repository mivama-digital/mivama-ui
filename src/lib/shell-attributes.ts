"use client"

import * as React from "react"

const SHELL_ATTRIBUTES = ["data-mivama-theme", "data-density"] as const

/**
 * Copies the theme and density attributes from the nearest application shell
 * (the first element with `data-mivama-theme`) onto portaled elements.
 *
 * Dialog, Sheet, and Tooltip render outside the themed subtree, so CSS
 * variables would otherwise fall back to the product root. Applying the same
 * attributes to the portal root restores token inheritance for all three
 * themes, both densities, and dark mode.
 *
 * A MutationObserver keeps the attributes applied even when the overlay
 * library swaps or remounts the portal node imperatively.
 */
export function useShellAttributes(portalSelector: string) {
  React.useEffect(() => {
    const shell = document.querySelector("[data-mivama-theme]")
    if (!shell) return

    const apply = () => {
      const element = document.querySelector(portalSelector)
      if (!element) return
      for (const attribute of SHELL_ATTRIBUTES) {
        const value = shell.getAttribute(attribute)
        if (value) element.setAttribute(attribute, value)
      }
    }

    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [portalSelector])
}
