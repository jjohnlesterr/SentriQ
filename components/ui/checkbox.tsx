"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/shared/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-line-strong bg-surface text-cyan-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-cyan-400 data-[state=checked]:bg-cyan-400",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="h-3 w-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };