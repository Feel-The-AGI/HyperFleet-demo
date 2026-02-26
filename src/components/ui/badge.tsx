import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "border-white/35 bg-primary/90 text-primary-foreground hover:bg-primary",
        secondary: "border-white/35 bg-secondary/90 text-secondary-foreground hover:bg-secondary",
        destructive: "border-white/25 bg-destructive/90 text-destructive-foreground hover:bg-destructive",
        outline: "border-white/45 bg-white/45 text-foreground dark:border-white/25 dark:bg-slate-800/55",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
