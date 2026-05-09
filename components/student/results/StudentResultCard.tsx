import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  ClipboardPaste,
  Home,
  Lock,
  Maximize,
  Trophy,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { Quiz, ReportVisibility, SessionEvent } from "@/lib/types";

type StudentResultCardProps = {
  studentName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  tabSwitches: number;
  reportVisibility?: ReportVisibility;
  events?: SessionEvent[];
  quiz: Quiz;
  answers: Record<number, number | string>;
  onReturnHome: () => void;
};

function countEvents(events: SessionEvent[], type: string) {
  return events.filter((event) => event.type === type).length;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getStudentAnswerText(
  question: Quiz["questions"][number],
  answer: number | string | undefined
) {
  if (answer === undefined || answer === "") return "No answer";

  if (question.type === "identification") {
    return String(answer);
  }

  if (typeof answer === "number") {
    return question.options[answer] ?? "Invalid answer";
  }

  return String(answer);
}

function getCorrectAnswerText(question: Quiz["questions"][number]) {
  if (question.type === "identification") {
    return question.correctTextAnswer || "No correct answer set";
  }

  return question.options[question.correctAnswer] || "No correct answer set";
}

function isAnswerCorrect(
  question: Quiz["questions"][number],
  answer: number | string | undefined
) {
  if (answer === undefined || answer === "") return false;

  if (question.type === "identification") {
    return normalize(String(answer)) === normalize(question.correctTextAnswer || "");
  }

  return answer === question.correctAnswer;
}

export default function StudentResultCard({
  studentName,
  score,
  totalQuestions,
  percentage,
  passed,
  tabSwitches,
  reportVisibility = "locked",
  events = [],
  quiz,
  answers,
  onReturnHome,
}: StudentResultCardProps) {
  const fullscreenExits = countEvents(events, "fullscreen-exit");
  const copyAttempts = countEvents(events, "copy-attempt");
  const pasteAttempts = countEvents(events, "paste-attempt");

  return (
    <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-5 sm:px-6 md:px-10 md:py-12 lg:px-16">
      <div className="w-full max-w-3xl">
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
                  <span className="font-semibold text-white">{studentName}</span>!
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

              {reportVisibility === "locked" && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />

                    <div>
                      <p className="font-semibold text-white">Review Locked</p>
                      <p className="mt-1 text-sm text-slate-300">
                        Your instructor has not released your answer review yet.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {reportVisibility !== "locked" && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 backdrop-blur-md">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />

                    <div className="w-full">
                      <p className="font-semibold text-red-200">
                        Activity Summary
                      </p>

                      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                          Tab Switches:{" "}
                          <span className="font-bold text-red-300">
                            {tabSwitches}
                          </span>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                          <Maximize className="mr-1 inline h-3 w-3" />
                          Fullscreen Exits:{" "}
                          <span className="font-bold text-orange-300">
                            {fullscreenExits}
                          </span>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                          <Clipboard className="mr-1 inline h-3 w-3" />
                          Copy Attempts:{" "}
                          <span className="font-bold text-red-300">
                            {copyAttempts}
                          </span>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                          <ClipboardPaste className="mr-1 inline h-3 w-3" />
                          Paste Attempts:{" "}
                          <span className="font-bold text-red-300">
                            {pasteAttempts}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {reportVisibility === "full" && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h2 className="text-lg font-bold text-white">
                    Answer Review
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Review your answers and the correct answers for each question.
                  </p>

                  <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1">
                    {quiz.questions.map((question, index) => {
                      const answer = answers[index];
                      const correct = isAnswerCorrect(question, answer);

                      return (
                        <div
                          key={question.id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                              Question {index + 1}
                            </p>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                                correct
                                  ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                                  : "border-red-400/20 bg-red-500/10 text-red-300"
                              }`}
                            >
                              {correct ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {correct ? "Correct" : "Wrong"}
                            </span>
                          </div>

                          <p className="text-sm font-semibold text-white">
                            {question.text}
                          </p>

                          <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                              <p className="text-xs text-slate-500">Your Answer</p>
                              <p className="mt-1 text-slate-200">
                                {getStudentAnswerText(question, answer)}
                              </p>
                            </div>

                            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
                              <p className="text-xs text-emerald-200/80">
                                Correct Answer
                              </p>
                              <p className="mt-1 font-semibold text-emerald-200">
                                {getCorrectAnswerText(question)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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