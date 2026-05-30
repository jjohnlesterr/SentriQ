"use client";

import { useMemo, useState } from "react";

import { CheckCircle2, Lightbulb, Loader2, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Quiz } from "@/lib/shared/types";

type Question = Quiz["questions"][number];

type QuestionCardProps = {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: number | string | undefined;
  answeredCount: number;
  isCurrentAnswered: boolean;
  isSubmitting: boolean;
  onAnswer: (answer: number | string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

function getQuestionTextClassName(text: string) {
  const length = text.trim().length;

  if (length >= 220) {
    return "text-lg leading-8 md:text-2xl md:leading-10";
  }

  if (length >= 140) {
    return "text-xl leading-8 md:text-[1.7rem] md:leading-10";
  }

  if (length >= 80) {
    return "text-2xl leading-9 md:text-[1.95rem] md:leading-10";
  }

  return "text-2xl leading-9 md:text-[2.1rem] md:leading-tight";
}

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  answeredCount,
  isCurrentAnswered,
  isSubmitting,
  onAnswer,
  onPrevious,
  onNext,
  onSubmit,
}: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false);

  const hasHint = Boolean(question.hint?.trim());

  const questionTextClassName = useMemo(
    () => getQuestionTextClassName(question.text),
    [question.text],
  );

  return (
    <Card className="relative rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-7">
      {hasHint && (
        <div className="absolute right-5 top-5 z-20">
          <button
            type="button"
            onClick={() => setShowHint((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-500/10 text-yellow-300 transition hover:scale-105 hover:bg-yellow-500/20"
            aria-label="Show hint"
          >
            <Lightbulb className="h-5 w-5" />
          </button>

          {showHint && (
            <div className="absolute right-0 top-14 w-64 rounded-2xl border border-yellow-400/20 bg-slate-950/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-300" />

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">
                    Hint
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowHint(false)}
                  className="text-slate-500 transition hover:text-white"
                  aria-label="Close hint"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm leading-relaxed text-slate-200">
                {question.hint}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mx-auto max-w-4xl">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-violet-300 md:text-xs md:tracking-[0.3em]">
          Question {currentIndex + 1} ·{" "}
          {question.type === "multiple_choice"
            ? "Multiple Choice"
            : question.type === "true_false"
              ? "True/False"
              : "Identification"}
        </p>

        <h2
          className={`${questionTextClassName} max-w-4xl break-words pr-0 font-semibold text-slate-300 md:pr-10`}
        >
          {question.text}
        </h2>

        <div className="mt-6 space-y-3 md:mt-7 md:space-y-4">
          {question.type === "identification" ? (
            <Input
              value={typeof selectedAnswer === "string" ? selectedAnswer : ""}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Type your answer"
              className="h-12 rounded-2xl border-white/10 bg-white/5 px-4 text-base text-white"
            />
          ) : (
            question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => onAnswer(index)}
                  className={
                    isSelected
                      ? "w-full cursor-pointer rounded-2xl border border-violet-400/50 bg-violet-500/20 p-4 text-left text-slate-100 shadow-lg transition hover:bg-violet-500/25 md:p-5"
                      : "w-full cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-slate-300 transition hover:border-violet-400/30 hover:bg-white/10 hover:text-slate-100 md:p-5"
                  }
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className={
                        isSelected
                          ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white"
                          : "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400"
                      }
                    >
                      {isSelected ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>

                    <span className="min-w-0 text-sm md:text-base">
                      {option}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:flex md:items-center md:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="h-11 cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
          >
            Previous
          </Button>

          {currentIndex < totalQuestions - 1 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={onNext}
              disabled={!isCurrentAnswered}
              className="h-11 cursor-pointer"
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={onSubmit}
              disabled={isSubmitting || answeredCount < totalQuestions}
              className="h-11 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit
                </>
              )}
            </Button>
          )}
        </div>

        {answeredCount < totalQuestions && (
          <p className="mt-4 text-center text-xs text-slate-500">
            Answer all questions before submitting.
          </p>
        )}
      </div>
    </Card>
  );
}