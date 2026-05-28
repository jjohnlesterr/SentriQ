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
    <Card className="flex min-h-[92px] flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-xl md:min-h-[130px] md:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] leading-4 text-slate-400 md:text-sm md:leading-5">
          {label}
        </p>

        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:h-12 md:w-12 md:rounded-2xl">
          <Icon className={`h-3.5 w-3.5 md:h-6 md:w-6 ${iconClass}`} />
        </div>
      </div>

      <p className="text-2xl font-extrabold leading-none text-white md:text-4xl">
        {value}
      </p>
    </Card>
  );
}
