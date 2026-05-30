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
    <Card className="sticky top-3 z-40 mb-4 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-0 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:top-4 md:mb-5">
      <div className="relative p-4 md:p-5">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-200">
              <ShieldAlert className="h-3.5 w-3.5" />
              Monitored Assessment
            </div>

            <h1 className="truncate bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-2xl font-extrabold leading-tight text-transparent md:text-3xl">
              {title}
            </h1>

            <p className="mt-1 truncate text-sm text-slate-300">
              Student:{" "}
              <span className="font-semibold text-white">{studentName}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:gap-3">
            {remainingTime && (
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-cyan-100 md:min-w-[136px]">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 shrink-0" />

                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-none">
                      {remainingTime}
                    </p>
                    <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-200/80">
                      Remaining
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 md:min-w-[132px] md:text-center">
              Question {currentIndex + 1} of {totalQuestions}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}