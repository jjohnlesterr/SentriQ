import { CheckCircle2, XCircle } from "lucide-react";

import type { Quiz } from "@/lib/shared/types";

import AnswerReviewItem from "./AnswerReviewItem";

type AnswerReviewListProps = {
  quiz: Quiz;
  answers: Record<number, number | string>;
  score: number;
  incorrect: number;
};

export default function AnswerReviewList({
  quiz,
  answers,
  score,
  incorrect,
}: AnswerReviewListProps) {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-md">
      <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-white">Answer Review</h2>

          <p className="mt-1 text-sm text-slate-400">
            Review your answers and the correct answers for each question.
          </p>
        </div>

        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {score} Correct
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300">
            <XCircle className="h-3.5 w-3.5" />
            {incorrect} Incorrect
          </span>
        </div>
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        {quiz.questions.map((question, index) => (
          <AnswerReviewItem
            key={question.id}
            question={question}
            index={index}
            answer={answers[index]}
          />
        ))}
      </div>
    </section>
  );
}