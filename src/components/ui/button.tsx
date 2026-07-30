import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils.js"

const buttonVariants = cva(
  "group/button relative inline-flex items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring active:not-aria-[haspopup]:translate-y-px motion-reduce:transition-none motion-reduce:active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "border-destructive-border bg-destructive-subtle text-destructive-foreground hover:bg-destructive-subtle/80 focus-visible:border-destructive focus-visible:ring-destructive/30",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "min-h-11 gap-2 px-5 py-2.5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "min-h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-11 gap-2 rounded-[min(var(--radius-md),12px)] px-4 py-2.5 text-sm in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        lg: "min-h-12 gap-2.5 px-6 py-3 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-11",
        "icon-xs":
          "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-11 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-12",
      },
      wrap: {
        false: "shrink-0 whitespace-nowrap",
        true: "max-w-full min-w-0 shrink whitespace-normal text-center wrap-anywhere",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      wrap: false,
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  wrap = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & { loading?: boolean }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      {...props}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, wrap, className }))}
    >
      {loading ? (
        <>
          <span className="inline-flex items-center gap-2 opacity-0">{children}</span>
          <span
            aria-hidden="true"
            className="absolute size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
          />
        </>
      ) : children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
