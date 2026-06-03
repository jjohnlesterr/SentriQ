"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Circle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Quiz, QuizSession } from "@/lib/shared/types";

const PREVIEW_LIMIT = 5;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getStudentAnswerText(
  question: Quiz["questions"][number],
  answer: number | string | undefined,
) {
  if (answer === undefined || answer === "") return "No answer";
  if (question.type === "identification") return String(answer);

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
  answer: number | string | undefined,
) {
  if (answer === undefined || answer === "") return false;

  if (question.type === "identification") {
    return (
      normalize(String(answer)) === normalize(question.correctTextAnswer || "")
    );
  }

  return answer === question.correctAnswer;
}

export default function SessionAnswersView({
  session,
  quiz,
  compact = false,
}: {
  session: QuizSession;
  quiz: Quiz | null;
  compact?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(PREVIEW_LIMIT);

  const questions = useMemo(() => {
    return session.quizSnapshot?.questions ?? quiz?.questions ?? [];
  }, [quiz?.questions, session.quizSnapshot?.questions]);

  if (!questions.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-400">
        Quiz questions not available.
      </div>
    );
  }

  const visibleQuestions = compact
    ? questions.slice(0, visibleCount)
    : questions;

  const hasMore = compact && visibleCount < questions.length;
  const canShowLess = compact && visibleCount > PREVIEW_LIMIT;
  const hiddenCount = questions.length - visibleCount;
  const nextCount = Math.min(PREVIEW_LIMIT, hiddenCount);

  return (
    <div className="space-y-3">
      {visibleQuestions.map((question, index) => {
        const answer = session.answers[index];
        const correct = isAnswerCorrect(question, answer);

        return (
          <div
            key={question.id}
            className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-slate-300">
                  Q{index + 1}
                </div>

                <p className="pt-1 text-sm font-semibold leading-6 text-white">
                  {question.text}
                </p>
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                  correct
                    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                    : "border-red-400/20 bg-red-500/10 text-red-300"
                }`}
              >
                {correct ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                {correct ? "Correct" : "Wrong"}
              </span>
            </div>

            {question.type === "identification" ? (
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <div
                  className={`rounded-xl border p-4 ${
                    correct
                      ? "border-emerald-400/20 bg-emerald-500/10"
                      : "border-red-400/20 bg-red-500/10"
                  }`}
                >
                  <p className="text-xs text-slate-400">Student Answer</p>
                  <p className="mt-1.5 font-semibold text-slate-100">
                    {getStudentAnswerText(question, answer)}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                  <p className="text-xs text-emerald-200/80">Correct Answer</p>
                  <p className="mt-1.5 font-semibold text-emerald-100">
                    {getCorrectAnswerText(question)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-2">
                {question.options.map((choice, choiceIndex) => {
                  const isCorrectChoice =
                    choiceIndex === question.correctAnswer;
                  const isSelectedChoice = answer === choiceIndex;
                  const isWrongSelected = isSelectedChoice && !isCorrectChoice;

                  return (
                    <div
                      key={`${question.id}-${choiceIndex}`}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                        isCorrectChoice
                          ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
                          : isWrongSelected
                            ? "border-red-400/25 bg-red-500/10 text-red-100"
                            : "border-white/10 bg-white/[0.035] text-slate-300"
                      }`}
                    >
                      {isCorrectChoice ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                      ) : isWrongSelected ? (
                        <XCircle className="h-4 w-4 shrink-0 text-red-300" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-slate-500" />
                      )}

                      <span className="min-w-0 flex-1">{choice}</span>

                      {isCorrectChoice && (
                        <span className="text-xs font-bold text-emerald-300">
                          Correct
                        </span>
                      )}

                      {isWrongSelected && (
                        <span className="text-xs font-bold text-red-300">
                          Student Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {(hasMore || canShowLess) && (
        <div className="grid gap-2">
          {hasMore && (
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setVisibleCount((current) =>
                  Math.min(current + PREVIEW_LIMIT, questions.length),
                )
              }
              className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 text-sm text-white hover:bg-white/10"
            >
              See More ({nextCount})
            </Button>
          )}

          {canShowLess && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setVisibleCount(PREVIEW_LIMIT)}
              className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
            >
              See Less
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
