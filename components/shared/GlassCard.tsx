import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function GlassCard({ children, className }: Props) {
  return (
    <div
      className={cn(
        `
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        shadow-2xl
        `,
        className
      )}
    >
      {children}
    </div>
  );
}