import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "../../lib/utils"

const headingVariants = cva("", {
  variants: {
    variant: {
      display: "mivama-heading-display",
      page: "mivama-heading-page",
      section: "mivama-heading-section",
      title: "mivama-heading-title",
      card: "mivama-heading-card",
    },
  },
  defaultVariants: {
    variant: "section",
  },
})

const textVariants = cva("", {
  variants: {
    variant: {
      lead: "mivama-text-lead",
      body: "mivama-text-body",
      small: "mivama-text-small",
      meta: "mivama-text-meta",
      eyebrow: "mivama-text-eyebrow",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

function Heading({
  className,
  variant = "section",
  render,
  ...props
}: useRender.ComponentProps<"h2"> & VariantProps<typeof headingVariants>) {
  return useRender({
    defaultTagName: "h2",
    props: mergeProps<"h2">(
      { className: cn(headingVariants({ variant }), className) },
      props
    ),
    render,
    state: { slot: "heading", variant },
  })
}

function Text({
  className,
  variant = "body",
  render,
  ...props
}: useRender.ComponentProps<"p"> & VariantProps<typeof textVariants>) {
  return useRender({
    defaultTagName: "p",
    props: mergeProps<"p">(
      { className: cn(textVariants({ variant }), className) },
      props
    ),
    render,
    state: { slot: "text", variant },
  })
}

function Eyebrow(props: Omit<ComponentProps<typeof Text>, "variant">) {
  return <Text variant="eyebrow" {...props} />
}

export { Eyebrow, Heading, Text, headingVariants, textVariants }
