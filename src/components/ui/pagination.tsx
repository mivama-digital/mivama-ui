import * as React from "react"

import { cn } from "../../lib/utils.js"
import { buttonVariants } from "./button.js"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

function Pagination({
  className,
  label = "Pagination",
  ...props
}: React.ComponentProps<"nav"> & { label?: string }) {
  return (
    <nav
      role="navigation"
      aria-label={label}
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

export type PaginationLinkProps = {
  isActive?: boolean
  size?: "default" | "icon" | "icon-lg" | "icon-sm" | "icon-xs" | "lg" | "sm" | "xs" | null
} & React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
          className,
        })
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  text = "Previous",
  label = "Go to previous page",
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  text?: string
  label?: string
}) {
  return (
    <PaginationLink
      aria-label={label}
      size="default"
      className={cn("pl-1.5!", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = "Next",
  label = "Go to next page",
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  text?: string
  label?: string
}) {
  return (
    <PaginationLink
      aria-label={label}
      size="default"
      className={cn("pr-1.5!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
