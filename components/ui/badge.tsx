import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow hover:shadow-lg",
                secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground border-gray-200 bg-white/80 backdrop-blur-sm",
                success: "border-transparent bg-gradient-to-r from-green-500 to-green-600 text-white shadow",
                warning: "border-transparent bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
