import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils.js"

const sectionVariants = cva("min-w-0 border-border", {
  variants: {
    density: {
      compact: "py-(--section-compact)",
      default: "py-(--section-default)",
      hero: "py-(--section-hero)",
    },
    bordered: {
      true: "border-b",
      false: null,
    },
  },
  defaultVariants: {
    density: "default",
    bordered: true,
  },
})

type SectionProps = useRender.ComponentProps<"section"> &
  VariantProps<typeof sectionVariants>

function Section({
  className,
  density = "default",
  bordered = true,
  render,
  ...props
}: SectionProps) {
  return useRender({
    defaultTagName: "section",
    props: mergeProps<"section">(
      { className: cn(sectionVariants({ density, bordered }), className) },
      props
    ),
    render,
    state: { slot: "section", density, bordered },
  })
}

export { Section, sectionVariants }
export type { SectionProps }
