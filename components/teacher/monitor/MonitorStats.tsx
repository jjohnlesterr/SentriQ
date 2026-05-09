import { Activity, AlertTriangle, CheckCircle2, Eye } from "lucide-react";

import { Card } from "@/components/ui/card";

type Props = {
  total: number;
  inProgress: number;
  completed: number;
  suspicious: number;
};

export default function MonitorStats({
  total,
  inProgress,
  completed,
  suspicious,
}: Props) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-3 md:mb-6 md:gap-4 xl:grid-cols-4">
      <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <Eye className="mb-3 h-7 w-7 text-blue-300 md:h-8 md:w-8" />
        <p className="text-sm text-slate-400">Total Sessions</p>
        <p className="mt-2 text-3xl font-bold text-white">{total}</p>
      </Card>

      <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <Activity className="mb-3 h-7 w-7 text-indigo-300 md:h-8 md:w-8" />
        <p className="text-sm text-slate-400">In Progress</p>
        <p className="mt-2 text-3xl font-bold text-indigo-300">{inProgress}</p>
      </Card>

      <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <CheckCircle2 className="mb-3 h-7 w-7 text-emerald-300 md:h-8 md:w-8" />
        <p className="text-sm text-slate-400">Completed</p>
        <p className="mt-2 text-3xl font-bold text-emerald-300">{completed}</p>
      </Card>

      <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <AlertTriangle className="mb-3 h-7 w-7 text-red-300 md:h-8 md:w-8" />
        <p className="text-sm text-slate-400 md:hidden">Suspicious</p>
        <p className="hidden text-sm text-slate-400 md:block">
          Suspicious Activity
        </p>
        <p className="mt-2 text-3xl font-bold text-red-300">{suspicious}</p>
      </Card>
    </div>
  );
}