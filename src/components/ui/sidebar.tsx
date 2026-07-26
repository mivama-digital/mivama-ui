"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

const SIDEBAR_WIDTH = "18rem"

function SidebarProvider({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-provider"
      style={{ "--sidebar-width": SIDEBAR_WIDTH, ...style } as React.CSSProperties}
      className={cn("flex min-h-screen w-full", className)}
      {...props}
    />
  )
}

function Sidebar({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "hidden border-r bg-card text-card-foreground lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[--sidebar-width] lg:shrink-0 lg:flex-col",
        className
      )}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-header" className={cn("border-b p-5", className)} {...props} />
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-content" className={cn("flex-1 overflow-y-auto p-3", className)} {...props} />
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-footer" className={cn("mt-auto border-t p-3", className)} {...props} />
}

function SidebarInset({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-inset" className={cn("min-w-0 flex-1", className)} {...props} />
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group" className={cn("grid gap-1", className)} {...props} />
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-menu" className={cn("grid gap-1", className)} {...props} />
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-menu-item" className={cn("grid", className)} {...props} />
}

function SidebarMenuButton({
  className,
  isActive = false,
  render,
  ...props
}: React.ComponentProps<"button"> & {
  isActive?: boolean
  render?: React.ReactElement
}) {
  const classes = cn(
    "inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
    isActive
      ? "bg-muted text-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
    className
  )

  if (render) {
    const renderElement = render as React.ReactElement<{ className?: string }>

    return React.cloneElement(renderElement, {
      ...props,
      ...renderElement.props,
      className: cn(classes, renderElement.props.className),
    })
  }

  return <button data-slot="sidebar-menu-button" className={classes} {...props} />
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
}
