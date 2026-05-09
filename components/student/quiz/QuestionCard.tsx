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
    <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-violet-300 md:text-xs md:tracking-[0.3em]">
        Question {currentIndex + 1} ·{" "}
        {question.type === "multiple_choice"
          ? "Multiple Choice"
          : question.type === "true_false"
          ? "True/False"
          : "Identification"}
      </p>

      <h2 className="text-xl font-bold leading-snug text-white md:text-3xl">
        {question.text}
      </h2>

      <div className="mt-6 space-y-3 md:mt-8 md:space-y-4">
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
                    ? "w-full cursor-pointer rounded-2xl border border-violet-400/50 bg-violet-500/20 p-4 text-left text-white shadow-lg transition hover:bg-violet-500/25 md:p-5"
                    : "w-full cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-slate-300 transition hover:border-violet-400/30 hover:bg-white/10 hover:text-white md:p-5"
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
    </Card>
  );
}