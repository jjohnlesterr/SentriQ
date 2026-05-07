import { LucideIcon } from "lucide-react";

interface FeaturedBadgeProps {
  icon: LucideIcon;
  label: string;
  className?: string;
  iconClassName?: string;
}

export default function FeaturedBadge({
  icon: Icon,
  label,
  className = "",
  iconClassName = "h-4 w-4",
}: FeaturedBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${className}`}
    >
      <Icon className={iconClassName} />

      {label}
    </div>
  );
}