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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center shadow-inner">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10">
        {passed ? (
          <Trophy className="h-7 w-7 text-emerald-300" />
        ) : (
          <CheckCircle2 className="h-7 w-7 text-violet-300" />
        )}
      </div>

      <h1 className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-extrabold text-transparent">
        Quiz Complete!
      </h1>

      <p className="mt-1.5 text-sm text-slate-300">
        Great job, <span className="font-semibold text-white">{studentName}</span>!
      </p>

      <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/30 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-violet-300">
          Your Score
        </p>

        <div className="mt-2 flex items-end justify-center gap-2">
          <span className="text-5xl font-extrabold text-white">{score}</span>
          <span className="pb-1 text-xl text-slate-400">/ {totalQuestions}</span>
        </div>

        <div className="mt-2 text-2xl font-bold text-violet-300">
          {percentage}%
        </div>

        <div
          className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
            passed
              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
              : "border-orange-400/20 bg-orange-500/10 text-orange-300"
          }`}
        >
          {passed ? "Passed" : "Needs Review"}
        </div>
      </div>
    </div>
  );
}