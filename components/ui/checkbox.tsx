"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded-md border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-cyan-500",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };