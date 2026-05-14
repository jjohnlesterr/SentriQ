import { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/shared/utils";

type SectionHeadingProps = {
  icon?: LucideIcon;
  badge?: string;
  title: string;
  description?: React.ReactNode;
  variant?: "hero" | "page" | "section" | "card";
  align?: "left" | "center";
  className?: string;
  badgeClassName?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export default function SectionHeading({
  icon: Icon,
  badge,
  title,
  description,
  variant = "section",
  align = "left",
  className,
  badgeClassName,
  iconClassName,
  titleClassName,
  descriptionClassName,
}: SectionHeadingProps) {
  const titleVariants = {
    hero: "bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl",

    page: "bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl",

    section: "text-3xl font-bold tracking-tight text-white md:text-4xl",

    card: "text-xl font-semibold text-white md:text-2xl",
  };

  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {badge && (
        <Badge
          className={cn(
            `
            mb-4
            border-cyan-400/20
            bg-cyan-400/10
            px-4
            py-2
            text-sm
            text-cyan-200
            `,
            badgeClassName,
          )}
        >
          {Icon && <Icon className={cn("h-4 w-4", iconClassName)} />}

          {badge}
        </Badge>
      )}

      <h2 className={cn(titleVariants[variant], titleClassName)}>{title}</h2>

      {description && (
        <p
          className={cn(
            `
            mt-4
            text-sm
            leading-7
            text-slate-300
            md:text-lg
            `,
            align === "center" && "mx-auto max-w-3xl",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
