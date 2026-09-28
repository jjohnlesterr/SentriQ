import { AlertTriangle, CheckCircle2, TimerOff } from "lucide-react";

import type { QuizSession } from "@/lib/shared/types";

type ResultSummaryCardProps = {
  quizTitle: string;
  quizDescription?: string;
  studentName: string;
  status: QuizSession["status"];
  score: number;
  incorrect: number;
  totalQuestions: number;
  timeSpentSeconds?: number;
};

function formatDuration(seconds?: number) {
  if (seconds === undefined) return "—";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes <= 0) return `${remainingSeconds}s`;

  return `${minutes}m ${remainingSeconds}s`;
}

function getResultCopy(status: QuizSession["status"]) {
  if (status === "timed-out") {
    return {
      label: "Time expired",
      description: "Your answers were submitted automatically when time ran out.",
      icon: TimerOff,
      tone: "text-amber-300",
    };
  }

  if (status === "abandoned") {
    return {
      label: "Session ended",
      description: "Your session was closed after more than 5 minutes of inactivity.",
      icon: AlertTriangle,
      tone: "text-amber-300",
    };
  }

  return {
    label: "Submitted",
    description: "Your quiz has been submitted.",
    icon: CheckCircle2,
    tone: "text-emerald-300",
  };
}

export default function ResultSummaryCard({
  quizTitle,
  quizDescription,
  studentName,
  status,
  score,
  incorrect,
  totalQuestions,
  timeSpentSeconds,
}: ResultSummaryCardProps) {
  const resultCopy = getResultCopy(status);
  const Icon = resultCopy.icon;

  const stats = [
    { label: "Correct", value: score },
    { label: "Incorrect", value: incorrect },
    { label: "Time spent", value: formatDuration(timeSpentSeconds) },
  ];

  return (
    <section className="rounded-xl border border-line bg-surface">
      <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="min-w-0">
          <p className={`inline-flex items-center gap-1.5 text-sm font-medium ${resultCopy.tone}`}>
            <Icon className="h-4 w-4" />
            {resultCopy.label}
          </p>

          <h1 className="mt-2 line-clamp-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {quizTitle || "Untitled quiz"}
          </h1>

          {quizDescription?.trim() && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-400">
              {quizDescription}
            </p>
          )}

          <p className="mt-3 text-sm text-slate-400">
            <span className="font-medium text-slate-200">{studentName}</span>
            {" · "}
            {resultCopy.description}
          </p>
        </div>

        <div className="shrink-0 sm:text-right">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            Score
          </p>
          <p className="mt-1 text-4xl font-semibold tabular-nums tracking-tight text-white">
            {score}
            <span className="text-xl font-normal text-slate-500"> / {totalQuestions}</span>
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-3 divide-x divide-line border-t border-line">
        {stats.map((stat) => (
          <div key={stat.label} className="px-5 py-4 sm:px-6">
            <dt className="text-xs text-slate-500">{stat.label}</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-white">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
