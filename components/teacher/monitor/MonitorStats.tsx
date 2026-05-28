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
      <div className="mb-6 md:hidden">
        <h2 className="mb-3 text-lg font-semibold text-white">
          Sessions Overview
        </h2>

        <div className="-mx-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2.5 pr-8">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card
                  key={stat.label}
                  className="flex min-h-[104px] w-[112px] shrink-0 flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Icon className={`h-5 w-5 shrink-0 ${stat.className}`} />
                  </div>

                  <div>
                    <p className={`text-2xl font-extrabold leading-none ${stat.className}`}>
                      {stat.value}
                    </p>

                    <p className="mt-1 text-[11px] leading-4 text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-5 hidden grid-cols-2 gap-3 md:mb-6 md:grid md:gap-4 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <Icon className={`mb-3 h-7 w-7 md:h-8 md:w-8 ${stat.className}`} />

              <p className="text-sm text-slate-400">{stat.label}</p>

              <p className={`mt-2 text-3xl font-bold ${stat.className}`}>
                {stat.value}
              </p>
            </Card>
          );
        })}
      </div>
    </>
  );
}