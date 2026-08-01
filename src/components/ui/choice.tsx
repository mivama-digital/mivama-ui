import type { ComponentProps } from "react"

import { cn } from "../../lib/utils.js"

type ChoiceProps = Omit<ComponentProps<"input">, "type"> & {
  type: "checkbox" | "radio"
}
type ChoiceGroupProps = ComponentProps<"fieldset">

function Choice({ className, type, ...props }: ChoiceProps) {
  return (
    <input
      type={type}
      data-slot="choice"
      className={cn(
        "size-5 shrink-0 accent-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 aria-invalid:ring-destructive/30 dark:aria-invalid:ring-destructive/50",
        className
      )}
      {...props}
    />
  )
}

function ChoiceGroup({ className, ...props }: ChoiceGroupProps) {
  return (
    <fieldset
      data-slot="choice-group"
      className={cn("grid min-w-0 gap-3 disabled:opacity-50", className)}
      {...props}
    />
  )
}

export { Choice, ChoiceGroup }
export type { ChoiceGroupProps, ChoiceProps }
