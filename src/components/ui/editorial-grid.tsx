import type { ComponentProps } from "react"

import { cn } from "../../lib/utils.js"

type EditorialGridProps = ComponentProps<"div">

function EditorialGrid({ className, ...props }: EditorialGridProps) {
  return (
    <div
      data-slot="editorial-grid"
      className={cn("mivama-editorial-grid", className)}
      {...props}
    />
  )
}

export { EditorialGrid }
export type { EditorialGridProps }
