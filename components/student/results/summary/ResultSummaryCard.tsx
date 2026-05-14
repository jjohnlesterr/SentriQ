import { CheckCircle2, Trophy } from "lucide-react";

type ResultSummaryCardProps = {
  studentName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
};

export default function ResultSummaryCard({
  studentName,
  score,
  totalQuestions,
  percentage,
  passed,
}: ResultSummaryCardProps) {
  return (
    <>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 shadow-lg md:mb-5 md:h-20 md:w-20">
          {passed ? (
            <Trophy className="h-8 w-8 text-emerald-300 md:h-10 md:w-10" />
          ) : (
            <CheckCircle2 className="h-8 w-8 text-violet-300 md:h-10 md:w-10" />
          )}
        </div>

        <h1 className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
          Quiz Complete!
        </h1>

        <p className="mt-2 text-sm text-slate-300 md:mt-3 md:text-base">
          Great job, <span className="font-semibold text-white">{studentName}</span>!
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center shadow-inner md:p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-violet-300 md:text-sm">
          Your Score
        </p>

        <div className="mt-3 flex items-end justify-center gap-2 md:mt-4">
          <span className="text-5xl font-extrabold text-white md:text-6xl">
            {score}
          </span>

          <span className="pb-1 text-xl text-slate-400 md:pb-2 md:text-2xl">
            / {totalQuestions}
          </span>
        </div>

        <div className="mt-3 text-2xl font-bold text-violet-300 md:mt-4 md:text-3xl">
          {percentage}%
        </div>

        <div
          className={`mt-3 inline-flex rounded-full border px-4 py-1.5 text-sm font-semibold ${
            passed
              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
              : "border-orange-400/20 bg-orange-500/10 text-orange-300"
          }`}
        >
          {passed ? "Passed" : "Needs Review"}
        </div>
      </div>
    </>
  );
}