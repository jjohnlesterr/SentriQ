import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Eye,
} from "lucide-react";

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
    <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <Eye className="mb-3 h-8 w-8 text-blue-300" />
        <p className="text-sm text-slate-400">Total Sessions</p>
        <p className="mt-2 text-3xl font-bold text-white">{total}</p>
      </Card>

      <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <Activity className="mb-3 h-8 w-8 text-indigo-300" />
        <p className="text-sm text-slate-400">In Progress</p>
        <p className="mt-2 text-3xl font-bold text-indigo-300">
          {inProgress}
        </p>
      </Card>

      <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <CheckCircle2 className="mb-3 h-8 w-8 text-emerald-300" />
        <p className="text-sm text-slate-400">Completed</p>
        <p className="mt-2 text-3xl font-bold text-emerald-300">
          {completed}
        </p>
      </Card>

      <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <AlertTriangle className="mb-3 h-8 w-8 text-red-300" />
        <p className="text-sm text-slate-400">Suspicious Activity</p>
        <p className="mt-2 text-3xl font-bold text-red-300">
          {suspicious}
        </p>
      </Card>
    </div>
  );
}