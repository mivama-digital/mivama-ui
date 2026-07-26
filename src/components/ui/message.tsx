import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const messageVariants = cva("flex w-full", {
  variants: {
    align: {
      start: "justify-start",
      end: "justify-end",
    },
  },
  defaultVariants: {
    align: "start",
  },
})

const messageBubbleVariants = cva(
  "grid w-full max-w-[min(100%,46rem)] gap-3 rounded-2xl px-4 py-3 text-sm shadow-sm",
  {
    variants: {
      tone: {
        default: "bg-card text-card-foreground ring-1 ring-foreground/10",
        accent: "bg-[var(--portal-accent)] text-white",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  }
)

function Message({
  className,
  align,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof messageVariants>) {
  return (
    <div
      data-slot="message"
      className={cn(messageVariants({ align }), className)}
      {...props}
    />
  )
}

function MessageBubble({
  className,
  tone,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof messageBubbleVariants>) {
  return (
    <div
      data-slot="message-bubble"
      className={cn(messageBubbleVariants({ tone }), className)}
      {...props}
    />
  )
}

function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-header"
      className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", className)}
      {...props}
    />
  )
}

function MessageAuthor({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-author"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function MessageMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-meta"
      className={cn("text-xs opacity-80", className)}
      {...props}
    />
  )
}

function MessageTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-title"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function MessageBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-body"
      className={cn("min-w-0", className)}
      {...props}
    />
  )
}

export {
  Message,
  MessageAuthor,
  MessageBody,
  MessageBubble,
  MessageHeader,
  MessageMeta,
  MessageTitle,
}
