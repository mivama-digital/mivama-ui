"use client"

import * as React from "react"

import { cn } from "../lib/utils.js"

type MivamaPortalContainer =
  | HTMLElement
  | ShadowRoot
  | React.RefObject<HTMLElement | ShadowRoot | null>
  | null

type MivamaContextValue = {
  theme: string
  density: string
  portalContainer: MivamaPortalContainer
  shellRef: React.RefObject<HTMLDivElement | null>
}

const MivamaContext = React.createContext<MivamaContextValue | null>(null)

type MivamaProviderProps = Omit<React.ComponentProps<"div">, "children"> & {
  children?: React.ReactNode
  theme?: string
  density?: string
  portalContainer?: MivamaPortalContainer
}

function MivamaProvider({
  theme = "product",
  density = "comfortable",
  portalContainer,
  className,
  children,
  ...props
}: MivamaProviderProps) {
  const shellRef = React.useRef<HTMLDivElement>(null)
  const contextValue = React.useMemo<MivamaContextValue>(
    () => ({
      theme,
      density,
      portalContainer: portalContainer === undefined ? shellRef : portalContainer,
      shellRef,
    }),
    [theme, density, portalContainer]
  )

  return (
    <MivamaContext.Provider value={contextValue}>
      <div
        ref={shellRef}
        data-mivama-theme={theme}
        data-density={density}
        className={cn("isolate", className)}
        {...props}
      >
        {children}
      </div>
    </MivamaContext.Provider>
  )
}

function useMivamaContext() {
  return React.useContext(MivamaContext)
}

function useMivamaPortalContainer() {
  return useMivamaContext()?.portalContainer
}

export { MivamaProvider, useMivamaContext, useMivamaPortalContainer }
export type { MivamaPortalContainer, MivamaProviderProps }
