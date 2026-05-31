import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  PartyPopper,
  XCircle,
} from "lucide-react";

type ResultSummaryCardProps = {
  quizTitle: string;
  quizDescription?: string;
  studentName: string;
  score: number;
  incorrect: number;
  totalQuestions: number;
  timeSpentSeconds?: number;
};

function formatDuration(seconds?: number) {
  if (seconds === undefined) return "N/A";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes <= 0) return `${remainingSeconds}s`;

  return `${minutes}m ${remainingSeconds}s`;
}

export default function ResultSummaryCard({
  quizTitle,
  quizDescription,
  studentName,
  score,
  incorrect,
  totalQuestions,
  timeSpentSeconds,
}: ResultSummaryCardProps) {
  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_16px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.1),transparent_34%)]" />

      <div className="relative z-10 space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                <PartyPopper className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-black text-white sm:text-3xl">
                  Quiz Complete!
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Great job,{" "}
                  <span className="font-semibold text-violet-300">
                    {studentName}
                  </span>
                  !
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="flex items-start gap-3">
                <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

                <div className="min-w-0">
                  <p className="line-clamp-2 text-lg font-bold leading-6 text-slate-100 sm:text-xl">
                    {quizTitle || "Untitled Quiz"}
                  </p>

                  {quizDescription?.trim() && (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
                      {quizDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 px-5 py-4 text-center lg:min-w-[160px]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200/80">
              Score
            </p>

            <p className="mt-2 text-4xl font-black text-white">
              {score}
              <span className="text-xl text-slate-400">
                {" "}
                / {totalQuestions}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-center">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />

            <div>
              <p className="text-xl font-black text-white">{score}</p>
              <p className="text-xs text-slate-400">Correct</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-center">
            <XCircle className="h-5 w-5 shrink-0 text-red-400" />

            <div>
              <p className="text-xl font-black text-white">{incorrect}</p>
              <p className="text-xs text-slate-400">Incorrect</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-center">
            <Clock3 className="h-5 w-5 shrink-0 text-violet-300" />

            <div>
              <p className="text-xl font-black text-violet-300">
                {formatDuration(timeSpentSeconds)}
              </p>
              <p className="text-xs text-slate-400">Time Spent</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
