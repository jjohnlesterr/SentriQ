import * as React from "react";

import { cn } from "@/lib/utils";

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
        h-12
        w-full
        rounded-xl
        border
        border-white/10
        bg-white/5
        px-4
        py-2
        text-sm
        text-white
        outline-none
        transition-all
        placeholder:text-slate-400
        focus:border-cyan-400/40
        focus:bg-white/10
        focus:ring-2
        focus:ring-cyan-400/20
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