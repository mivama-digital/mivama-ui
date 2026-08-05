"use client"

import * as React from "react"

const SHELL_ATTRIBUTES = ["data-mivama-theme", "data-density"] as const

function syncShellAttributes(shell: Element, portalSelector: string) {
  for (const element of document.querySelectorAll(portalSelector)) {
    for (const attribute of SHELL_ATTRIBUTES) {
      const value = shell.getAttribute(attribute)
      if (value === null) {
        element.removeAttribute(attribute)
      } else {
        element.setAttribute(attribute, value)
      }
    }
  }
}

/**
 * Copies theme and density attributes from the active application shell onto
 * every matching portaled element. The observer also reacts when the shell's
 * attributes change or when the overlay library remounts portal nodes.
 */
export function useShellAttributes(portalSelector: string) {
  React.useEffect(() => {
    const shell = document.querySelector("[data-mivama-theme]")
    if (!shell) return

    const apply = () => syncShellAttributes(shell, portalSelector)

    apply()

    const portalObserver = new MutationObserver(apply)
    portalObserver.observe(document.body, { childList: true, subtree: true })

    const shellObserver = new MutationObserver(apply)
    shellObserver.observe(shell, {
      attributes: true,
      attributeFilter: [...SHELL_ATTRIBUTES],
    })

    return () => {
      portalObserver.disconnect()
      shellObserver.disconnect()
    }
  }, [portalSelector])
}
