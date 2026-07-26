"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button } from "./button"
import { cn } from "../../lib/utils"

type AttachmentContextValue = {
  orientation: "horizontal" | "vertical"
  size: "sm" | "default"
}

const AttachmentContext = React.createContext<AttachmentContextValue>({
  orientation: "horizontal",
  size: "default",
})

const attachmentVariants = cva(
  "group/attachment relative min-w-0 overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 transition-colors",
  {
    variants: {
      orientation: {
        horizontal: "flex items-center gap-3 p-3",
        vertical: "grid gap-0 p-0",
      },
      size: {
        default: "",
        sm: "",
      },
      state: {
        default: "",
        uploading: "bg-muted/40",
        processing: "bg-muted/40",
        error: "ring-destructive/30",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "default",
      state: "default",
    },
  }
)

type AttachmentProps = React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants>

function Attachment({
  className,
  children,
  orientation,
  size,
  state,
  ...props
}: AttachmentProps) {
  const resolvedOrientation = orientation ?? "horizontal"
  const resolvedSize = size ?? "default"
  const resolvedState = state ?? "default"

  return (
    <AttachmentContext.Provider value={{ orientation: resolvedOrientation, size: resolvedSize }}>
      <div
        data-slot="attachment"
        data-orientation={resolvedOrientation}
        data-size={resolvedSize}
        data-state={resolvedState}
        className={cn(attachmentVariants({ orientation: resolvedOrientation, size: resolvedSize, state: resolvedState }), className)}
        {...props}
      >
        {children}
      </div>
    </AttachmentContext.Provider>
  )
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="attachment-group" className={cn("grid gap-3", className)} {...props} />
}

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & { variant?: "icon" | "image" }) {
  const { orientation, size } = React.useContext(AttachmentContext)

  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(
        "relative shrink-0 overflow-hidden",
        variant === "icon"
          ? cn(
              "flex items-center justify-center rounded-lg bg-muted text-muted-foreground",
              size === "sm" ? "size-10" : "size-11"
            )
          : orientation === "vertical"
            ? "aspect-square w-full bg-muted"
            : size === "sm"
              ? "size-10 rounded-lg bg-muted"
              : "size-11 rounded-lg bg-muted",
        className
      )}
      {...props}
    />
  )
}

function AttachmentContent({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = React.useContext(AttachmentContext)

  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "min-w-0 flex-1",
        orientation === "vertical" ? "p-3" : undefined,
        className
      )}
      {...props}
    />
  )
}

function AttachmentHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="attachment-header" className={cn("min-w-0", className)} {...props} />
}

function AttachmentTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-title"
      className={cn(
        "truncate text-sm font-medium text-foreground group-data-[state=processing]/attachment:animate-pulse group-data-[state=uploading]/attachment:animate-pulse",
        className
      )}
      {...props}
    />
  )
}

function AttachmentDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-description"
      className={cn("mt-1 truncate text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function AttachmentActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn("relative z-20 flex shrink-0 items-center gap-1", className)}
      {...props}
    />
  )
}

function AttachmentAction({ className, size = "icon-sm", variant = "ghost", ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      size={size}
      variant={variant}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

type AttachmentTriggerProps =
  | (React.ComponentProps<"a"> & { href: string })
  | (React.ComponentProps<"button"> & { href?: undefined })

function AttachmentTrigger(props: AttachmentTriggerProps) {
  const className = cn(
    "absolute inset-0 z-10 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
  )

  if ("href" in props && props.href) {
    const { className: classNameProp, ...rest } = props
    return <a data-slot="attachment-trigger" className={cn(className, classNameProp)} {...rest} />
  }

  const buttonProps = props as React.ComponentProps<"button">
  const { className: classNameProp, type, ...rest } = buttonProps
  const resolvedType: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] =
    type === "submit" || type === "reset" ? type : "button"

  return <button data-slot="attachment-trigger" type={resolvedType} className={cn(className, classNameProp)} {...rest} />
}

export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentHeader,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
}
