import * as React from "react"

import { cn } from "../../lib/utils"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn("grid justify-items-center gap-4 rounded-xl border border-dashed px-6 py-8 text-center", className)}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-header" className={cn("grid justify-items-center gap-2", className)} {...props} />
}

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "icon" }) {
  return (
    <div
      data-slot="empty-media"
      data-variant={variant}
      className={cn(
        variant === "icon"
          ? "flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground"
          : "grid justify-items-center",
        className
      )}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-title" className={cn("text-base font-medium text-foreground", className)} {...props} />
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-description" className={cn("max-w-md text-sm leading-6 text-muted-foreground", className)} {...props} />
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-content" className={cn("flex flex-wrap items-center justify-center gap-2", className)} {...props} />
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle }
