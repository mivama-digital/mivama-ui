import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
declare const buttonVariants: (props?: ({
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | null | undefined;
    size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Button({ className, variant, size, asChild, children, ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    children?: ReactNode;
}): import("react").JSX.Element;
export { Button, buttonVariants };
//# sourceMappingURL=button.d.ts.map