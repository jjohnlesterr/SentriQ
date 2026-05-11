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
  const stats = [
    {
      label: "Total Sessions",
      value: total,
      icon: Eye,
      className: "text-blue-300",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Activity,
      className: "text-indigo-300",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      className: "text-emerald-300",
    },
    {
      label: "Suspicious",
      value: suspicious,
      icon: AlertTriangle,
      className: "text-red-300",
    },
  ];

  return (
    <>
      {/* MOBILE CAROUSEL */}
      <div className="mb-6 md:hidden">
        <h2 className="mb-3 text-lg font-semibold text-white">
          Sessions Overview
        </h2>

        <div className="-mx-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-3 pr-10">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card
                  key={stat.label}
                  className="w-[135px] shrink-0 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                >
                  <Icon className={`mb-4 h-7 w-7 ${stat.className}`} />

                  <p className={`text-3xl font-bold ${stat.className}`}>
                    {stat.value}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {stat.label}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* DESKTOP OLD GRID */}
      <div className="mb-5 hidden grid-cols-2 gap-3 md:mb-6 md:grid md:gap-4 xl:grid-cols-4">
        <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <Eye className="mb-3 h-7 w-7 text-blue-300 md:h-8 md:w-8" />
          <p className="text-sm text-slate-400">Total Sessions</p>
          <p className="mt-2 text-3xl font-bold text-white">{total}</p>
        </Card>

        <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <Activity className="mb-3 h-7 w-7 text-indigo-300 md:h-8 md:w-8" />
          <p className="text-sm text-slate-400">In Progress</p>
          <p className="mt-2 text-3xl font-bold text-indigo-300">
            {inProgress}
          </p>
        </Card>

        <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <CheckCircle2 className="mb-3 h-7 w-7 text-emerald-300 md:h-8 md:w-8" />
          <p className="text-sm text-slate-400">Completed</p>
          <p className="mt-2 text-3xl font-bold text-emerald-300">
            {completed}
          </p>
        </Card>

        <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <AlertTriangle className="mb-3 h-7 w-7 text-red-300 md:h-8 md:w-8" />
          <p className="text-sm text-slate-400">Suspicious Activity</p>
          <p className="mt-2 text-3xl font-bold text-red-300">
            {suspicious}
          </p>
        </Card>
      </div>
    </>
  );
}