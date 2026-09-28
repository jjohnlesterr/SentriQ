import { cn } from "@/lib/shared/utils";

type Props = {
  tone?: "error" | "success";
  children: React.ReactNode;
  className?: string;
};

// Inline form feedback. Errors are announced immediately; success politely.
export default function FormMessage({ tone = "error", children, className }: Props) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg border px-3.5 py-2.5 text-sm",
        tone === "error"
          ? "border-red-500/25 bg-red-500/[0.07] text-red-200"
          : "border-emerald-500/25 bg-emerald-500/[0.07] text-emerald-200",
        className,
      )}
    >
      {children}
    </p>
  );
}
