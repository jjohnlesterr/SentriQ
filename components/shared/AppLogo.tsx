import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function AppLogo({ className }: Props) {
  return (
    <h1
      className={cn(
        `
        bg-gradient-to-r
        from-blue-400
        via-cyan-300
        to-indigo-400
        bg-clip-text
        font-extrabold
        text-transparent
        `,
        className
      )}
    >
      SentriQ
    </h1>
  );
}