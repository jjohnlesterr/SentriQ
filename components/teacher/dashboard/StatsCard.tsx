import { BookOpen, Eye, FileText } from "lucide-react";

import { Card } from "@/components/ui/card";

type Props = {
  type: "total" | "published" | "draft";
  label: string;
  value: number;
};

export default function StatsCard({ type, label, value }: Props) {
  const Icon =
    type === "total" ? BookOpen : type === "published" ? Eye : FileText;

  const iconClass =
    type === "total"
      ? "text-cyan-300"
      : type === "published"
        ? "text-blue-300"
        : "text-violet-300";

  return (
    <Card className="flex min-h-[96px] flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:min-h-[130px] md:p-5">
      <div className="flex items-center gap-2.5 md:gap-3">
        <Icon className={`h-5 w-5 shrink-0 md:h-6 md:w-6 ${iconClass}`} />

        <p className="text-3xl font-extrabold leading-none text-white md:text-4xl">
          {value}
        </p>
      </div>

      <p className="mt-5 text-xs font-medium leading-4 text-slate-400 md:text-sm md:leading-5">
        {label}
      </p>
    </Card>
  );
}