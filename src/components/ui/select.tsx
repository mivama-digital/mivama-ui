import type { ComponentProps } from "react"

import { cn } from "../../lib/utils.js"

type SelectProps = ComponentProps<"select">

function Select({ className, ...props }: SelectProps) {
  return (
    <select
      data-slot="select"
      className={cn(
        "min-h-11 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-base text-foreground transition-colors outline-none motion-reduce:transition-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Select }
export type { SelectProps }
