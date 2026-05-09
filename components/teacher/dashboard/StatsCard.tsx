import { BookOpen, Eye, FileText } from "lucide-react";

import { Card } from "@/components/ui/card";

type Props = {
  type: "total" | "published" | "draft";
  label: string;
  value: number;
};

export default function StatsCard({ type, label, value }: Props) {
  const icon =
    type === "total" ? (
      <BookOpen className="mb-3 h-7 w-7 text-cyan-300 md:mb-4 md:h-8 md:w-8" />
    ) : type === "published" ? (
      <Eye className="mb-3 h-7 w-7 text-blue-300 md:mb-4 md:h-8 md:w-8" />
    ) : (
      <FileText className="mb-3 h-7 w-7 text-violet-300 md:mb-4 md:h-8 md:w-8" />
    );

  const valueClass =
    type === "published"
      ? "text-blue-300"
      : type === "draft"
      ? "text-violet-300"
      : "text-white";

  return (
    <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:p-6">
      {icon}

      <p className="text-sm text-slate-400">{label}</p>

      <p className={`mt-2 text-3xl font-bold ${valueClass}`}>{value}</p>
    </Card>
  );
}