import type { ComponentProps } from "react"

import { cn } from "../../lib/utils.js"

type ScrollSceneProps = ComponentProps<"div">

type ScrollLayerProps = ComponentProps<"div"> & {
  direction?: "up" | "down"
  distance?: 8 | 16 | 24 | 32 | 48
  effect?: "reveal" | "parallax"
}

function ScrollScene({ className, ...props }: ScrollSceneProps) {
  return (
    <div
      data-slot="scroll-scene"
      className={cn("mivama-scroll-scene", className)}
      {...props}
    />
  )
}

function ScrollLayer({
  className,
  direction = "up",
  distance = 16,
  effect = "reveal",
  ...props
}: ScrollLayerProps) {
  return (
    <div
      data-slot="scroll-layer"
      data-direction={direction}
      data-distance={distance}
      data-effect={effect}
      className={cn("mivama-scroll-layer", className)}
      {...props}
    />
  )
}

export { ScrollLayer, ScrollScene }
export type { ScrollLayerProps, ScrollSceneProps }
