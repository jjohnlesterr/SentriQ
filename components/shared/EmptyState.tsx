import { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/shared/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl",
        className
      )}
    >
      {Icon && (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
          <Icon className="h-7 w-7" />
        </div>
      )}

      <p className="font-medium text-slate-200">{title}</p>

      {description && (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      )}
    </Card>
  );
}