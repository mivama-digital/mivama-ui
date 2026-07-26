"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "../../lib/utils"

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-input p-0.5 shadow-xs transition-colors outline-none data-[checked]:bg-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-5 rounded-full bg-background shadow-sm ring-0 transition-transform data-[checked]:translate-x-5 data-[unchecked]:translate-x-0"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
