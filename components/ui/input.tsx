import * as React from "react";

import { cn } from "@/lib/shared/utils";

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        `
        flex
        h-11
        w-full
        rounded-lg
        border
        border-line-strong
        bg-surface
        px-3.5
        py-2
        text-sm
        text-white
        outline-none
        transition-colors
        placeholder:text-slate-500
        focus:border-cyan-400/70
        focus:ring-2
        focus:ring-cyan-400/15
        disabled:cursor-not-allowed
        disabled:opacity-50
        `,
        className
      )}
      {...props}
    />
  );
}

export { Input };