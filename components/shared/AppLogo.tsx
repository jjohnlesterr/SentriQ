import { cn } from "@/lib/shared/utils";

type Props = {
  className?: string;
};

export default function AppLogo({ className }: Props) {
  return (
    <span className={cn("font-semibold tracking-tight text-white", className)}>
      Sentri<span className="text-cyan-300">Q</span>
    </span>
  );
}
