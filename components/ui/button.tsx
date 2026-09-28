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
  rounded-lg
  text-sm
  font-medium
  transition-colors
  focus-visible:outline-2
  focus-visible:outline-offset-2
  focus-visible:outline-cyan-400
  disabled:pointer-events-none
  disabled:opacity-50
  `,
  {
    variants: {
      variant: {
        primary:
          "bg-cyan-400 font-semibold text-cyan-950 hover:bg-cyan-300",

        secondary:
          "border border-line-strong bg-surface-raised text-slate-100 hover:border-slate-500/60 hover:bg-[#1d222b]",

        ghost:
          "border border-line bg-transparent text-slate-200 hover:border-line-strong hover:bg-white/[0.04] hover:text-white",

        destructive: "bg-red-600 text-white hover:bg-red-500",

        success:
          "bg-emerald-500 font-semibold text-emerald-950 hover:bg-emerald-400",

        successSoft:
          "border border-emerald-400/25 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/15 hover:text-emerald-100",

        dangerSoft:
          "border border-red-400/25 bg-red-500/10 text-red-200 hover:bg-red-500/15 hover:text-red-100",
      },

      size: {
        default: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        sm: "h-8 px-3 text-xs",
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
