import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function QuestionSection({ children, className }: Props) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-6 lg:p-7",
        className
      )}
    >
      {children}
    </section>
  );
}