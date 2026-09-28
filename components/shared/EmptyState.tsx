import { LucideIcon } from "lucide-react";

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
    <div
      className={cn(
        "rounded-xl border border-dashed border-line-strong px-6 py-12 text-center",
        className,
      )}
    >
      {Icon && <Icon className="mx-auto mb-3 h-6 w-6 text-slate-500" />}

      <p className="font-medium text-slate-200">{title}</p>

      {description && (
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
}
