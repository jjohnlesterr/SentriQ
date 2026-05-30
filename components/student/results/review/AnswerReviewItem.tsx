"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  XCircle,
} from "lucide-react";

import type { Quiz } from "@/lib/shared/types";

type Question = Quiz["questions"][number];

type AnswerReviewItemProps = {
  question: Question;
  index: number;
  answer: number | string | undefined;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getStudentAnswerText(
  question: Question,
  answer: number | string | undefined,
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

function getCorrectAnswerText(question: Question) {
  if (question.type === "identification") {
    return question.correctTextAnswer || "No correct answer set";
  }

  return question.options[question.correctAnswer] || "No correct answer set";
}

function isAnswerCorrect(
  question: Question,
  answer: number | string | undefined,
) {
  if (answer === undefined || answer === "") return false;

  if (question.type === "identification") {
    return normalize(String(answer)) === normalize(question.correctTextAnswer || "");
  }

  return answer === question.correctAnswer;
}

function getQuestionTypeLabel(question: Question) {
  if (question.type === "multiple_choice") return "Multiple Choice";
  if (question.type === "true_false") return "True/False";
  return "Identification";
}

export default function AnswerReviewItem({
  question,
  index,
  answer,
}: AnswerReviewItemProps) {
  const [open, setOpen] = useState(false);

  const correct = isAnswerCorrect(question, answer);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-white/[0.03]"
      >
        <div className="hidden shrink-0 border-r border-white/10 pr-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-violet-300 sm:block">
          Q{index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2 sm:hidden">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">
              Q{index + 1}
            </span>

            <span className="text-[10px] text-slate-500">
              {getQuestionTypeLabel(question)}
            </span>
          </div>

          <p className="line-clamp-2 text-sm font-medium leading-6 text-slate-100 sm:line-clamp-1 sm:text-base">
            {question.text}
          </p>

          {!open && (
            <p
              className={`mt-2 text-sm font-semibold ${
                correct ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {correct
                ? getStudentAnswerText(question, answer)
                : `Your Answer: ${getStudentAnswerText(question, answer)}`}
            </p>
          )}
        </div>

        <span
          className={`hidden shrink-0 rounded-xl border px-3 py-1 text-xs font-bold sm:inline-flex ${
            correct
              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
              : "border-red-400/20 bg-red-500/10 text-red-300"
          }`}
        >
          {correct ? "Correct" : "Incorrect"}
        </span>

        <ChevronDown
          className={`h-5 w-5 shrink-0 text-violet-300 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-white/10 p-4">
          <div className="mb-4 grid gap-3 text-sm md:grid-cols-2">
            <div
              className={`rounded-xl border p-3 ${
                correct
                  ? "border-emerald-400/20 bg-emerald-500/10"
                  : "border-red-400/20 bg-red-500/10"
              }`}
            >
              <p className="text-xs text-slate-400">Your Answer</p>
              <p
                className={`mt-1 font-semibold ${
                  correct ? "text-emerald-200" : "text-red-200"
                }`}
              >
                {getStudentAnswerText(question, answer)}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
              <p className="text-xs text-emerald-200/80">Correct Answer</p>
              <p className="mt-1 font-semibold text-emerald-200">
                {getCorrectAnswerText(question)}
              </p>
            </div>
          </div>

          {question.type !== "identification" && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Choices
              </p>

              {question.options.map((choice, choiceIndex) => {
                const isCorrectChoice = choiceIndex === question.correctAnswer;
                const isSelectedChoice = answer === choiceIndex;
                const isWrongSelected = isSelectedChoice && !isCorrectChoice;

                return (
                  <div
                    key={`${question.id}-${choiceIndex}`}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm ${
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
                        Your Answer
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}