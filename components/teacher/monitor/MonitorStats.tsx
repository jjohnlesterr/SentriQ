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
    <>
      <div className="mb-5 md:hidden">
        <h2 className="mb-3 text-lg font-bold text-white">
          Sessions Overview
        </h2>

        <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-3 pr-6">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card
                  key={stat.label}
                  className="flex h-[96px] w-[132px] shrink-0 flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${stat.className}`} />

                    <span
                      className={`text-2xl font-black leading-none ${stat.className}`}
                    >
                      {stat.value}
                    </span>
                  </div>

                  <p className="text-xs leading-4 text-slate-400">
                    {stat.label}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-6 hidden grid-cols-2 gap-4 md:grid xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-7 w-7 ${stat.className}`} />

                <span
                  className={`text-4xl font-black leading-none ${stat.className}`}
                >
                  {stat.value}
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-400">{stat.label}</p>
            </Card>
          );
        })}
      </div>
    </>
  );
}