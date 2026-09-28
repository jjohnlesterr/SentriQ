import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/shared/utils";

type Props = React.ComponentProps<"div">;

// The app's standard raised surface. (Name kept for existing imports.)
export function GlassCard({ children, className, ...props }: Props) {
  return (
    <Card
      className={cn("rounded-xl border-line bg-surface text-slate-200", className)}
      {...props}
    >
      {children}
    </Card>
  );
}
