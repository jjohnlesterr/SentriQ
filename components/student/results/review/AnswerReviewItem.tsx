"use client";

import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { isAnswerCorrect } from "@/lib/quiz/scoring";
import type { Quiz } from "@/lib/shared/types";

type Question = Quiz["questions"][number];

type AnswerReviewItemProps = {
  question: Question;
  index: number;
  answer: number | string | undefined;
};

function getStudentAnswerText(question: Question, answer: number | string | undefined) {
  if (answer === undefined || answer === "") return "No answer";

  if (question.type === "identification") return String(answer);

  if (typeof answer === "number") return question.options[answer] ?? "Invalid answer";

  return String(answer);
}

function getCorrectAnswerText(question: Question) {
  if (question.type === "identification") {
    return question.correctTextAnswer || "No correct answer set";
  }

  return question.options[question.correctAnswer] || "No correct answer set";
}

export default function AnswerReviewItem({ question, index, answer }: AnswerReviewItemProps) {
  const [open, setOpen] = useState(false);

  const correct = isAnswerCorrect(question, answer);
  const panelId = `answer-review-${question.id}`;

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02] sm:px-6"
      >
        <span className="w-7 shrink-0 pt-0.5 text-sm tabular-nums text-slate-500">
          {index + 1}.
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm leading-6 text-slate-100">{question.text}</p>
          <p className={`mt-1 text-sm ${correct ? "text-slate-400" : "text-red-300"}`}>
            <span className="text-slate-500">Your answer: </span>
            {getStudentAnswerText(question, answer)}
          </p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1 pt-0.5 text-xs font-medium ${
            correct ? "text-emerald-300" : "text-red-300"
          }`}
        >
          {correct ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{correct ? "Correct" : "Incorrect"}</span>
        </span>

        <ChevronDown
          aria-hidden="true"
          className={`mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div id={panelId} className="pb-5 pl-16 pr-5 sm:pl-[4.25rem] sm:pr-6">
          {question.type === "identification" ? (
            <p className="text-sm text-slate-400">
              Correct answer:{" "}
              <span className="font-medium text-emerald-300">{getCorrectAnswerText(question)}</span>
            </p>
          ) : (
            <ul className="space-y-1.5">
              {question.options.map((choice, choiceIndex) => {
                const isCorrectChoice = choiceIndex === question.correctAnswer;
                const isWrongSelected = Number(answer) === choiceIndex && !isCorrectChoice;

                return (
                  <li
                    key={`${question.id}-${choiceIndex}`}
                    className={`flex items-center gap-2.5 text-sm ${
                      isCorrectChoice
                        ? "text-emerald-300"
                        : isWrongSelected
                          ? "text-red-300"
                          : "text-slate-400"
                    }`}
                  >
                    {isCorrectChoice ? (
                      <Check className="h-4 w-4 shrink-0" />
                    ) : isWrongSelected ? (
                      <X className="h-4 w-4 shrink-0" />
                    ) : (
                      <span className="h-4 w-4 shrink-0" />
                    )}
                    <span className="min-w-0 flex-1">{choice}</span>
                    {isCorrectChoice && <span className="text-xs">Correct answer</span>}
                    {isWrongSelected && <span className="text-xs">Your answer</span>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}
