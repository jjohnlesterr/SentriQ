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
    <section className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line px-5 py-4 sm:px-6">
        <h2 className="text-sm font-medium text-white">Answer review</h2>

        <p className="text-sm text-slate-500">
          <span className="text-emerald-300">{score} correct</span>
          {" · "}
          <span className={incorrect > 0 ? "text-red-300" : undefined}>{incorrect} incorrect</span>
        </p>
      </div>

      <ol className="divide-y divide-line">
        {quiz.questions.map((question, index) => (
          <AnswerReviewItem
            key={question.id}
            question={question}
            index={index}
            answer={answers[index]}
          />
        ))}
      </ol>
    </section>
  );
}
