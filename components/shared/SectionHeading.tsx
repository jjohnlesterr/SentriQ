import { LucideIcon } from "lucide-react";

type Props = {
  icon?: LucideIcon;
  badge?: string;
  title: string;
  description?: string;
  gradient?: boolean;
};

export default function SectionHeading({
  icon: Icon,
  badge,
  title,
  description,
  gradient = false,
}: Props) {
  return (
    <div className="text-center">
      {badge && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
          {Icon && <Icon className="h-4 w-4" />}
          {badge}
        </div>
      )}

      <h2
        className={`text-4xl font-bold tracking-tight ${
          gradient
            ? "bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent"
            : "text-white"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          {description}
        </p>
      )}
    </div>
  );
}