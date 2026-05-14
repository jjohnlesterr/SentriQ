import type { Quiz } from "@/lib/shared/types";

import AnswerReviewItem from "./AnswerReviewItem";

type AnswerReviewListProps = {
  quiz: Quiz;
  answers: Record<number, number | string>;
};

export default function AnswerReviewList({
  quiz,
  answers,
}: AnswerReviewListProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h2 className="text-lg font-bold text-white">Answer Review</h2>

      <p className="mt-1 text-sm text-slate-400">
        Review your answers and the correct answers for each question.
      </p>

      <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {quiz.questions.map((question, index) => (
          <AnswerReviewItem
            key={question.id}
            question={question}
            index={index}
            answer={answers[index]}
          />
        ))}
      </div>
    </div>
  );
}