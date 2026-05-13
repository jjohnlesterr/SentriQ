import { Loader2 } from "lucide-react";

type PageLoaderProps = {
  label?: string;
  variant?: "page" | "card";
};

export default function PageLoader({
  label = "Loading...",
  variant = "page",
}: PageLoaderProps) {
  if (variant === "card") {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl md:p-12">
        <div className="flex items-center justify-center gap-3 text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
          {label}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-slate-200 backdrop-blur-md">
        <Loader2 className="h-5 w-5 animate-spin text-blue-300" />
        {label}
      </div>
    </div>
  );
}