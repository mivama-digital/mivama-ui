import type { ComponentProps } from "react"

import { cn } from "../../lib/utils.js"

type BentoGridProps = ComponentProps<"div">

type BentoGridItemProps = ComponentProps<"div"> & {
  span?: 1 | 2
}

function BentoGrid({ className, ...props }: BentoGridProps) {
  return (
    <div
      data-slot="bento-grid"
      className={cn("mivama-bento-grid", className)}
      {...props}
    />
  )
}

function BentoGridItem({ className, span = 1, ...props }: BentoGridItemProps) {
  return (
    <div
      data-slot="bento-grid-item"
      data-span={span}
      className={cn("mivama-bento-grid-item", className)}
      {...props}
    />
  )
}

export { BentoGrid, BentoGridItem }
export type { BentoGridItemProps, BentoGridProps }
