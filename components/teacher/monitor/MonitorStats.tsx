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
      className: "text-cyan-300",
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
    <div className="mb-5 md:mb-6">
      <h2 className="mb-3 text-lg font-bold text-white xl:hidden">
        Sessions Overview
      </h2>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 lg:-mx-16 lg:px-16 xl:mx-0 xl:overflow-visible xl:px-0 xl:pb-0">
        <div className="flex w-max gap-3 pr-6 xl:grid xl:w-full xl:grid-cols-4 xl:gap-4 xl:pr-0">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.label}
                className="flex h-[96px] w-[156px] shrink-0 flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:w-[180px] md:h-[104px] md:w-[210px] xl:h-auto xl:min-h-[130px] xl:w-auto xl:p-5"
              >
                <div className="flex items-center gap-2.5 md:gap-3">
                  <Icon className={`h-5 w-5 shrink-0 md:h-6 md:w-6 xl:h-7 xl:w-7 ${stat.className}`} />

                  <span
                    className={`text-3xl font-black leading-none xl:text-4xl ${stat.className}`}
                  >
                    {stat.value}
                  </span>
                </div>

                <p className="text-xs leading-4 text-slate-400 xl:text-sm">
                  {stat.label}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}