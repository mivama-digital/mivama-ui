import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "../../lib/utils.js"

const headingVariants = cva("", {
  variants: {
    variant: {
      hero: "mivama-heading-hero",
      statement: "mivama-heading-statement",
      display: "mivama-heading-display",
      page: "mivama-heading-page",
      section: "mivama-heading-section",
      title: "mivama-heading-title",
      card: "mivama-heading-card",
    },
    tone: {
      default: null,
      inherit: "mivama-tone-inherit",
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
      signal: "mivama-text-signal",
    },
    tone: {
      default: null,
      inherit: "mivama-tone-inherit",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

type TypographyTone = "default" | "inherit"

type HeadingProps = useRender.ComponentProps<"h2"> &
  VariantProps<typeof headingVariants>

type TextProps = useRender.ComponentProps<"p"> &
  VariantProps<typeof textVariants>

function Heading({
  className,
  variant = "section",
  tone = "default",
  render,
  ...props
}: HeadingProps) {
  return useRender({
    defaultTagName: "h2",
    props: mergeProps<"h2">(
      { className: cn(headingVariants({ variant, tone }), className) },
      props
    ),
    render,
    state: { slot: "heading", variant, tone },
  })
}

function Text({
  className,
  variant = "body",
  tone = "default",
  render,
  ...props
}: TextProps) {
  return useRender({
    defaultTagName: "p",
    props: mergeProps<"p">(
      { className: cn(textVariants({ variant, tone }), className) },
      props
    ),
    render,
    state: { slot: "text", variant, tone },
  })
}

function Eyebrow(props: Omit<ComponentProps<typeof Text>, "variant">) {
  return <Text variant="eyebrow" {...props} />
}

export { Eyebrow, Heading, Text, headingVariants, textVariants }
export type { HeadingProps, TextProps, TypographyTone }
