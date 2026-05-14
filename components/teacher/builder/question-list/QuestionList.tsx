"use client";

import QuestionCard from "@/components/teacher/builder/question-list/QuestionCard";
import type { Question } from "@/lib/shared/types";

type Props = {
  questions: Question[];
  activeQuestion: number;
  openMenuId: string | null;
  onOpenMenuChange: (id: string | null) => void;
  onSelectQuestion: (index: number) => void;
  onMoveQuestionUp: (index: number) => void;
  onMoveQuestionDown: (index: number) => void;
  onDuplicateQuestion: (index: number) => void;
  onRemoveQuestion: (index: number) => void;
};

export default function QuestionList({
  questions,
  activeQuestion,
  openMenuId,
  onOpenMenuChange,
  onSelectQuestion,
  onMoveQuestionUp,
  onMoveQuestionDown,
  onDuplicateQuestion,
  onRemoveQuestion,
}: Props) {
  return (
    <div className="space-y-2.5 pr-1">
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          question={question}
          index={index}
          activeQuestion={activeQuestion}
          totalQuestions={questions.length}
          openMenuId={openMenuId}
          onOpenMenuChange={onOpenMenuChange}
          onSelectQuestion={onSelectQuestion}
          onMoveQuestionUp={onMoveQuestionUp}
          onMoveQuestionDown={onMoveQuestionDown}
          onDuplicateQuestion={onDuplicateQuestion}
          onRemoveQuestion={onRemoveQuestion}
        />
      ))}
    </div>
  );
}