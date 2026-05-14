import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/shared/utils";

type Props = React.ComponentProps<"div">;

export function GlassCard({
  children,
  className,
  ...props
}: Props) {
  return (
    <Card
      className={cn(
        `
        rounded-3xl
        border-white/10
        bg-white/5
        backdrop-blur-xl
        shadow-2xl
        `,
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}