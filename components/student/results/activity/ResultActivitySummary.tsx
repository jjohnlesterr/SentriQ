import {
  Clipboard,
  ClipboardPaste,
  Maximize,
  MousePointerClick,
  UsersRound,
} from "lucide-react";

type ResultActivitySummaryProps = {
  tabSwitches: number;
  fullscreenExits: number;
  copyAttempts: number;
  pasteAttempts: number;
};

const summaryCards = [
  {
    label: "Tab Switches",
    valueKey: "tabSwitches",
    icon: MousePointerClick,
    className: "text-violet-300",
  },
  {
    label: "Fullscreen Exits",
    valueKey: "fullscreenExits",
    icon: Maximize,
    className: "text-orange-300",
  },
  {
    label: "Copy Attempts",
    valueKey: "copyAttempts",
    icon: Clipboard,
    className: "text-blue-300",
  },
  {
    label: "Paste Attempts",
    valueKey: "pasteAttempts",
    icon: ClipboardPaste,
    className: "text-emerald-300",
  },
] as const;

export default function ResultActivitySummary({
  tabSwitches,
  fullscreenExits,
  copyAttempts,
  pasteAttempts,
}: ResultActivitySummaryProps) {
  const values = {
    tabSwitches,
    fullscreenExits,
    copyAttempts,
    pasteAttempts,
  };

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <UsersRound className="h-5 w-5 text-violet-300" />

        <h2 className="text-lg font-bold text-white">Activity Summary</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.valueKey}
              className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-current/20 bg-current/10 ${card.className}`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-xl font-black text-white">
                    {values[card.valueKey]}
                  </p>

                  <p className={`text-xs font-medium ${card.className}`}>
                    {card.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}