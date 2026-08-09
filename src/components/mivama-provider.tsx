"use client"

import * as React from "react"

import { DEFAULT_DENSITY, DEFAULT_THEME } from "../lib/shell-contract.js"
import type { MivamaDensity, MivamaTheme } from "../lib/shell-contract.js"
import { cn } from "../lib/utils.js"

type MivamaPortalContainer =
  | HTMLElement
  | ShadowRoot
  | React.RefObject<HTMLElement | ShadowRoot | null>
  | null

type MivamaContextValue = {
  theme: MivamaTheme
  density: MivamaDensity
  portalContainer: MivamaPortalContainer
  shellRef: React.RefObject<HTMLDivElement | null>
}

const MivamaContext = React.createContext<MivamaContextValue | null>(null)

type MivamaProviderProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> & {
  children?: React.ReactNode
  theme?: MivamaTheme
  density?: MivamaDensity
  portalContainer?: MivamaPortalContainer
}

const MivamaProvider = React.forwardRef<HTMLDivElement, MivamaProviderProps>(
  function MivamaProvider(
    {
      theme = DEFAULT_THEME,
      density = DEFAULT_DENSITY,
      portalContainer,
      className,
      children,
      ...props
    },
    forwardedRef
  ) {
    const shellRef = React.useRef<HTMLDivElement>(null)
    const setShellRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        shellRef.current = node
        if (typeof forwardedRef === "function") {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
      },
      [forwardedRef]
    )
    const contextValue = React.useMemo<MivamaContextValue>(
      () => ({
        theme,
        density,
        portalContainer:
          portalContainer === undefined ? shellRef : portalContainer,
        shellRef,
      }),
      [theme, density, portalContainer]
    )

    return (
      <MivamaContext.Provider value={contextValue}>
        <div
          {...props}
          ref={setShellRef}
          data-mivama-theme={theme}
          data-density={density}
          className={cn("isolate", className)}
        >
          {children}
        </div>
      </MivamaContext.Provider>
    )
  }
)

function useOptionalMivamaContext() {
  return React.useContext(MivamaContext)
}

function useMivamaContext() {
  return useOptionalMivamaContext()
}

function useMivamaPortalContainer() {
  return useOptionalMivamaContext()?.portalContainer
}

export {
  MivamaProvider,
  useMivamaContext,
  useMivamaPortalContainer,
  useOptionalMivamaContext,
}
export type { MivamaDensity, MivamaTheme }
export type {
  MivamaContextValue,
  MivamaPortalContainer,
  MivamaProviderProps,
}
