type ResultActivitySummaryProps = {
  tabSwitches: number;
  fullscreenExits: number;
  copyAttempts: number;
  pasteAttempts: number;
};

export default function ResultActivitySummary({
  tabSwitches,
  fullscreenExits,
  copyAttempts,
  pasteAttempts,
}: ResultActivitySummaryProps) {
  const items = [
    { label: "Tab switches", value: tabSwitches },
    { label: "Fullscreen exits", value: fullscreenExits },
    { label: "Copy attempts", value: copyAttempts },
    { label: "Paste attempts", value: pasteAttempts },
  ];

  return (
    <section className="rounded-xl border border-line bg-surface">
      <h2 className="border-b border-line px-5 py-4 text-sm font-medium text-white sm:px-6">
        Activity during the quiz
      </h2>

      <dl className="grid grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={`px-5 py-4 sm:px-6 ${index % 2 === 1 ? "border-l border-line" : ""} ${
              index >= 2 ? "border-t border-line lg:border-t-0" : ""
            } ${index === 2 ? "lg:border-l" : ""}`}
          >
            <dt className="text-xs text-slate-500">{item.label}</dt>
            <dd
              className={`mt-1 text-lg font-semibold tabular-nums ${
                item.value > 0 ? "text-amber-300" : "text-white"
              }`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
