import * as React from "react"

import { useIsMobile } from "../../../hooks/use-mobile.js"
import { cn } from "../../../lib/utils.js"
import {
  persistSidebarState,
  readSidebarState,
  type SidebarCookieOptions,
  type SidebarPersistence,
} from "../sidebar-persistence.js"
import {
  SIDEBAR_KEYBOARD_SHORTCUT,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
} from "./constants.js"

export type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  sidebarId: string
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    (target.matches("input, textarea, select") ||
      target.closest('[contenteditable]:not([contenteditable="false"])'))
  )
}

function useSidebarKeyboardShortcut(toggleSidebar: () => void) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== SIDEBAR_KEYBOARD_SHORTCUT ||
        (!event.metaKey && !event.ctrlKey) ||
        isEditableTarget(event.target)
      ) {
        return
      }

      event.preventDefault()
      toggleSidebar()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  persistence = "none",
  storageKey = "mivama-sidebar",
  cookieOptions,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  persistence?: SidebarPersistence
  storageKey?: string
  cookieOptions?: SidebarCookieOptions
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)
  const sidebarId = React.useId()
  const [_open, _setOpen] = React.useState(defaultOpen)
  const hasRestoredPersistence = React.useRef(false)
  const open = openProp ?? _open

  React.useEffect(() => {
    if (hasRestoredPersistence.current) return
    hasRestoredPersistence.current = true
    if (openProp !== undefined) return

    const persistedOpen = readSidebarState({
      persistence,
      storageKey,
      cookieOptions,
    })
    if (persistedOpen !== null) _setOpen(persistedOpen)
  }, [openProp, persistence, storageKey, cookieOptions])

  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      persistSidebarState(openState, {
        persistence,
        storageKey,
        cookieOptions,
      })
    },
    [setOpenProp, open, persistence, storageKey, cookieOptions]
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((value) => !value) : setOpen((value) => !value)
  }, [isMobile, setOpen, setOpenMobile])

  useSidebarKeyboardShortcut(toggleSidebar)

  const state = open ? "expanded" : "collapsed"
  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      sidebarId,
      toggleSidebar,
    }),
    [
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      sidebarId,
      toggleSidebar,
    ]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}
