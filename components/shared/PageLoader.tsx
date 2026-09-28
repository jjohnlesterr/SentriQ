import { Loader2 } from "lucide-react";

type PageLoaderProps = {
  label?: string;
  variant?: "page" | "card";
};

export default function PageLoader({
  label = "Loading...",
  variant = "page",
}: PageLoaderProps) {
  const content = (
    <div role="status" className="flex items-center justify-center gap-2.5 text-sm text-slate-400">
      <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
      {label}
    </div>
  );

  if (variant === "card") {
    return <div className="rounded-xl border border-line bg-surface p-10">{content}</div>;
  }

  return <div className="flex min-h-screen items-center justify-center px-4">{content}</div>;
}
