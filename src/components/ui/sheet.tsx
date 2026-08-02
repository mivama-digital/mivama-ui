"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

import { cn } from "../../lib/utils.js"
import { useShellAttributes } from "../../lib/shell-attributes.js"
import { Button } from "./button.js"
import { XIcon } from "lucide-react"

type SheetSize = "sm" | "md" | "full"

type SheetContentProps = SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  size?: SheetSize
  overlayClassName?: string
  showCloseButton?: boolean
  closeLabel?: string
}

const sheetSizeClasses: Record<SheetSize, string> = {
  sm: "data-[side=left]:w-3/4 data-[side=right]:w-3/4 data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
  md: "data-[side=left]:w-full data-[side=right]:w-full data-[side=left]:sm:max-w-lg data-[side=right]:sm:max-w-lg",
  full: "data-[side=left]:w-full data-[side=right]:w-full data-[side=left]:max-w-none data-[side=right]:max-w-none",
}

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  useShellAttributes("[data-slot=sheet-overlay]")

  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-overlay transition-opacity duration-(--motion-duration-fast) ease-(--motion-easing-standard) data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  size = "sm",
  overlayClassName,
  showCloseButton = true,
  closeLabel = "Close",
  ...props
}: SheetContentProps) {
  useShellAttributes("[data-slot=sheet-content]")

  return (
    <SheetPortal>
      <SheetOverlay className={overlayClassName} />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        data-size={size}
        className={cn(
          "fixed z-50 flex max-h-[100dvh] flex-col gap-4 overflow-y-auto overscroll-contain bg-popover bg-clip-padding text-sm text-popover-foreground shadow-(--shadow-elevated) transition duration-(--motion-duration-default) ease-(--motion-easing-standard) data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:max-h-[calc(100dvh-env(safe-area-inset-top))] data-[side=bottom]:border-t data-[side=bottom]:pb-[env(safe-area-inset-bottom)] data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:top-[env(safe-area-inset-top)] data-[side=left]:bottom-[env(safe-area-inset-bottom)] data-[side=left]:left-0 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:top-[env(safe-area-inset-top)] data-[side=right]:right-0 data-[side=right]:bottom-[env(safe-area-inset-bottom)] data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:max-h-[calc(100dvh-env(safe-area-inset-bottom))] data-[side=top]:border-b data-[side=top]:pt-[env(safe-area-inset-top)] data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] motion-reduce:transition-none motion-reduce:data-ending-style:translate-none motion-reduce:data-starting-style:translate-none",
          sheetSizeClasses[size],
          showCloseButton &&
            "[&>[data-slot=sheet-header]]:pr-16 [&>[data-slot=sheet-title]]:pr-16",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-3 right-3"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">{closeLabel}</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "font-heading text-base font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetOverlay,
  SheetPortal,
}
export type { SheetContentProps, SheetSize }
