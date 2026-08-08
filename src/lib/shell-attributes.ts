"use client"

import * as React from "react"

import { useMivamaPortalContainer } from "../components/mivama-provider.js"

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
 * v3 compatibility fallback for applications that do not use MivamaProvider.
 * Copies theme and density attributes from the active application shell onto
 * matching portaled elements. New code must use the provider-owned portal
 * container path. Remove this fallback in v4; tracked by issue #60.
 */
export function useShellAttributes(portalSelector: string) {
  const providerContainer = useMivamaPortalContainer()
  const enabled = providerContainer === undefined

  React.useEffect(() => {
    if (!enabled) return

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
  }, [enabled, portalSelector])
}
