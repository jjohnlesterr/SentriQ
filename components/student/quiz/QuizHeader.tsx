import { ShieldAlert } from "lucide-react";

import { Card } from "@/components/ui/card";

type QuizHeaderProps = {
  title: string;
  studentName: string;
  currentIndex: number;
  totalQuestions: number;
  progress: number;
};

export default function QuizHeader({
  title,
  studentName,
  currentIndex,
  totalQuestions,
  progress,
}: QuizHeaderProps) {
  return (
    <Card className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="relative p-6 md:p-8">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200">
              <ShieldAlert className="h-3.5 w-3.5" />
              Monitored Assessment
            </div>

            <h1 className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
              {title}
            </h1>

            <p className="mt-2 text-sm text-slate-300">
              Student:{" "}
              <span className="font-semibold text-white">{studentName}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            Question {currentIndex + 1} of {totalQuestions}
          </div>
        </div>

        <div className="relative z-10 mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">
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