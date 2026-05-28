import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/shared/utils";

const buttonVariants = cva(
  `
  inline-flex
  items-center
  justify-center
  gap-2
  whitespace-nowrap
  rounded-xl
  text-sm
  font-medium
  transition-all
  disabled:pointer-events-none
  disabled:opacity-50
  `,
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600",

        secondary:
          "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600",

        ghost:
          "border border-white/10 bg-white/5 text-white hover:bg-white/10",

        destructive:
          "bg-red-600 text-white hover:bg-red-700",

        success:
          "border border-emerald-400/20 bg-gradient-to-r from-emerald-500/90 to-emerald-400/80 text-white hover:from-emerald-400 hover:to-emerald-300 shadow-lg shadow-emerald-950/20 backdrop-blur-xl",

        successSoft:
          "border border-emerald-400/20 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 hover:text-emerald-100",

        dangerSoft:
          "border border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/20 hover:text-red-100",
      },

      size: {
        default: "h-11 px-5",
        lg: "h-14 px-8 text-base",
        sm: "h-9 px-3 text-xs",
        mobile: "h-10 px-4 text-sm",
        icon: "h-10 w-10 p-0",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };