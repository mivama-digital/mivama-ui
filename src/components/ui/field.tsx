import type { ComponentProps } from "react"

import { cn } from "../../lib/utils.js"

type FieldProps = ComponentProps<"div">
type FieldLabelProps = ComponentProps<"label">
type FieldDescriptionProps = ComponentProps<"p">
type FieldErrorProps = ComponentProps<"p">
type FieldsetProps = ComponentProps<"fieldset">
type FieldLegendProps = ComponentProps<"legend">

function Field({ className, ...props }: FieldProps) {
  return <div data-slot="field" className={cn("grid gap-2", className)} {...props} />
}

function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <label
      data-slot="field-label"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-sm/relaxed text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <p
      data-slot="field-error"
      className={cn("text-sm/relaxed text-destructive-foreground", className)}
      {...props}
    />
  )
}

function Fieldset({ className, ...props }: FieldsetProps) {
  return (
    <fieldset
      data-slot="fieldset"
      className={cn("grid min-w-0 gap-4 disabled:opacity-50", className)}
      {...props}
    />
  )
}

function FieldLegend({ className, ...props }: FieldLegendProps) {
  return (
    <legend
      data-slot="field-legend"
      className={cn("mb-2 text-base font-semibold text-foreground", className)}
      {...props}
    />
  )
}

export { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, Fieldset }
export type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldLegendProps,
  FieldProps,
  FieldsetProps,
}
