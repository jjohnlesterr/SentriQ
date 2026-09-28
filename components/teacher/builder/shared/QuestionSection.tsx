import { cn } from "@/lib/shared/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function QuestionSection({ children, className }: Props) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-xl border border-line bg-surface p-4 md:p-6 lg:p-7",
        className
      )}
    >
      {children}
    </section>
  );
}