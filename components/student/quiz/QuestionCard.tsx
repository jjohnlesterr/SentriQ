import { CheckCircle2, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Quiz } from "@/lib/types";

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
  return (
    <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-violet-300">
        Question {currentIndex + 1} ·{" "}
        {question.type === "multiple_choice"
          ? "Multiple Choice"
          : question.type === "true_false"
          ? "True/False"
          : "Identification"}
      </p>

      <h2 className="text-2xl font-bold leading-snug text-white md:text-3xl">
        {question.text}
      </h2>

      <div className="mt-8 space-y-4">
        {question.type === "identification" ? (
          <Input
            value={typeof selectedAnswer === "string" ? selectedAnswer : ""}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Type your answer"
            className="rounded-2xl border-white/10 bg-white/5 p-5 text-base text-white"
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
                    ? "w-full cursor-pointer rounded-2xl border border-violet-400/50 bg-violet-500/20 p-5 text-left text-white shadow-lg transition hover:bg-violet-500/25"
                    : "w-full cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-slate-300 transition hover:border-violet-400/30 hover:bg-white/10 hover:text-white"
                }
              >
                <div className="flex items-center gap-4">
                  <div
                    className={
                      isSelected
                        ? "flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white"
                        : "flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400"
                    }
                  >
                    {isSelected ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>

                  <span className="text-base">{option}</span>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
        >
          Previous
        </Button>

        <div className="flex gap-3">
          {currentIndex < totalQuestions - 1 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={onNext}
              disabled={!isCurrentAnswered}
              className="cursor-pointer"
            >
              Next Question
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={onSubmit}
              disabled={isSubmitting || answeredCount < totalQuestions}
              className="cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Quiz
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {answeredCount < totalQuestions && (
        <p className="mt-4 text-center text-xs text-slate-500">
          Answer all questions before submitting.
        </p>
      )}
    </Card>
  );
}