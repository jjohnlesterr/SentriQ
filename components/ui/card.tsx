import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white/5 text-white shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export { Card };