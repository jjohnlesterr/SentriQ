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
    { label: "Students", value: total, tone: "text-white" },
    { label: "In progress", value: inProgress, tone: "text-white" },
    { label: "Completed", value: completed, tone: "text-white" },
    {
      label: "Flagged",
      value: suspicious,
      tone: suspicious > 0 ? "text-amber-300" : "text-white",
    },
  ];

  return (
    <dl className="mb-6 grid grid-cols-2 overflow-hidden rounded-xl border border-line bg-surface sm:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`px-4 py-3.5 sm:px-5 ${index % 2 === 1 ? "border-l border-line" : ""} ${
            index >= 2 ? "border-t border-line sm:border-t-0" : ""
          } ${index === 2 ? "sm:border-l" : ""}`}
        >
          <dt className="text-xs text-slate-500">{stat.label}</dt>
          <dd className={`mt-1 text-xl font-semibold tabular-nums ${stat.tone}`}>{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
