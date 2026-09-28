import { ArrowRight, KeyRound } from "lucide-react";

import OpenAuthModalButton from "@/components/landing/OpenAuthModalButton";

const previewRows = [
  { name: "Maria Santos", progress: 18, total: 20, flag: null },
  { name: "Daniel Cruz", progress: 14, total: 20, flag: "Left tab 2×" },
  { name: "Aira Villanueva", progress: 20, total: 20, flag: "Submitted" },
  { name: "Joshua Reyes", progress: 9, total: 20, flag: "Exited fullscreen" },
];

export default function LandingHero() {
  return (
    <section className="grid items-center gap-14 py-16 md:py-24 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
      <div>
        <p className="text-sm font-medium text-cyan-300">
          Quiz monitoring for classrooms
        </p>

        <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-[3.25rem]">
          Run quizzes online and know the results are honest.
        </h1>

        <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
          Build a quiz in minutes, approve who joins, and watch every session
          live — tab switches, fullscreen exits and copy attempts are logged as
          they happen.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <OpenAuthModalButton modal="login" size="lg" className="w-full sm:w-auto">
            Get started
            <ArrowRight className="h-4 w-4" />
          </OpenAuthModalButton>

          <OpenAuthModalButton
            modal="quiz"
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
          >
            <KeyRound className="h-4 w-4" />
            Enter quiz code
          </OpenAuthModalButton>
        </div>
      </div>

      <MonitorPreview />
    </section>
  );
}

function MonitorPreview() {
  return (
    <figure
      aria-label="Preview of the live session monitor"
      className="overflow-hidden rounded-xl border border-line bg-surface"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <p className="text-sm font-medium text-white">Biology · Unit 3 check</p>
          <p className="mt-0.5 text-xs text-slate-500">Code BIO3QZ · 20 questions</p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      <ul className="divide-y divide-line">
        {previewRows.map((row) => {
          const percent = Math.round((row.progress / row.total) * 100);
          const flagTone =
            row.flag === "Submitted"
              ? "text-emerald-300"
              : row.flag
                ? "text-amber-300"
                : "text-slate-500";

          return (
            <li key={row.name} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-5 py-3.5 sm:grid-cols-[9rem_1fr_8.5rem]">
              <span className="truncate text-sm text-slate-200">{row.name}</span>

              <div className="order-last col-span-2 flex items-center gap-3 sm:order-none sm:col-span-1">
                <div className="h-1 flex-1 rounded-full bg-white/[0.06]">
                  <div
                    className="h-1 rounded-full bg-cyan-400/80"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs tabular-nums text-slate-500">
                  {row.progress}/{row.total}
                </span>
              </div>

              <span className={`text-right text-xs ${flagTone}`}>
                {row.flag ?? "Answering"}
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
