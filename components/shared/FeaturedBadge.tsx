import { LucideIcon } from "lucide-react";

interface FeaturedBadgeProps {
  icon: LucideIcon;
  label: string;
  className: string;
}

export default function FeaturedBadge({
  icon: Icon,
  label,
  className,
}: FeaturedBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${className}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </div>
  );
}