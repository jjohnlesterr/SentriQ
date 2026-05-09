import { AlertTriangle, CheckCircle2, Home, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type StudentResultCardProps = {
  studentName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  tabSwitches: number;
  onReturnHome: () => void;
};

export default function StudentResultCard({
  studentName,
  score,
  totalQuestions,
  percentage,
  passed,
  tabSwitches,
  onReturnHome,
}: StudentResultCardProps) {
  return (
    <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-5 sm:px-6 md:px-10 md:py-12 lg:px-16">
      <div className="w-full max-w-xl">
        <Card className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="relative p-5 sm:p-6 md:p-10">
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl md:h-36 md:w-36" />
            <div className="absolute left-0 top-24 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl md:h-28 md:w-28" />

            <div className="relative z-10 space-y-5 md:space-y-8">
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
                  Great job,{" "}
                  <span className="font-semibold text-white">
                    {studentName}
                  </span>
                  !
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

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <Card className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md md:p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 md:text-xs">
                    Correct
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-300">
                    {score}
                  </p>
                </Card>

                <Card className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md md:p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 md:text-xs">
                    Incorrect
                  </p>

                  <p className="mt-2 text-3xl font-bold text-red-300">
                    {totalQuestions - score}
                  </p>
                </Card>
              </div>

              {tabSwitches > 0 && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 backdrop-blur-md">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />

                    <div>
                      <p className="font-semibold text-red-200">
                        {tabSwitches} tab switch
                        {tabSwitches !== 1 ? "es" : ""} detected
                      </p>

                      <p className="mt-1 text-sm text-slate-300">
                        Your instructor has been notified.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="button"
                onClick={onReturnHome}
                variant="primary"
                className="h-11 w-full md:h-12"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}