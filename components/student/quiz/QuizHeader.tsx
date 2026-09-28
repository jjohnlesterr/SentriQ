import { Clock3, ShieldAlert } from "lucide-react";

import { Card } from "@/components/ui/card";

type QuizHeaderProps = {
  title: string;
  studentName: string;
  currentIndex: number;
  totalQuestions: number;
  progress: number;
  remainingTime?: string | null;
};

export default function QuizHeader({
  title,
  studentName,
  currentIndex,
  totalQuestions,
  progress,
  remainingTime,
}: QuizHeaderProps) {
  return (
    <Card className="sticky top-3 z-40 mb-4 overflow-hidden rounded-xl border border-line bg-surface p-0 md:top-4 md:mb-5">
      <div className="relative p-4 md:p-5">

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-cyan-300">
              <ShieldAlert className="h-3.5 w-3.5" />
              Monitored Assessment
            </div>

            <h1 className="truncate text-xl font-semibold leading-tight tracking-tight text-white md:text-2xl">
              {title}
            </h1>

            <p className="mt-1 truncate text-sm text-slate-400">
              Student:{" "}
              <span className="font-medium text-slate-200">{studentName}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:gap-3">
            {remainingTime && (
              <div className="rounded-lg border border-line-strong px-3 py-2 text-slate-100 md:min-w-[128px]">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 shrink-0" />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-none tabular-nums">
                      {remainingTime}
                    </p>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                      Remaining
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center rounded-lg border border-line-strong px-3 py-2 text-sm font-medium tabular-nums text-slate-200 md:min-w-[128px] md:justify-center">
              Question {currentIndex + 1} of {totalQuestions}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Quiz progress">
            <div
              className="h-full rounded-full bg-cyan-400 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}