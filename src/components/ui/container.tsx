import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils.js"

const containerVariants = cva("mx-auto w-full min-w-0", {
  variants: {
    size: {
      standard: "max-w-(--container-standard)",
      reading: "max-w-(--container-reading)",
      wide: "max-w-(--container-wide)",
    },
    gutter: {
      true: "px-(--page-gutter)",
      false: null,
    },
  },
  defaultVariants: {
    size: "standard",
    gutter: true,
  },
})

type ContainerProps = useRender.ComponentProps<"div"> &
  VariantProps<typeof containerVariants>

function Container({
  className,
  size = "standard",
  gutter = true,
  render,
  ...props
}: ContainerProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn(containerVariants({ size, gutter }), className) },
      props
    ),
    render,
    state: { slot: "container", size, gutter },
  })
}

export { Container, containerVariants }
export type { ContainerProps }
