"use client";

import QuestionCard from "@/components/teacher/builder/question-list/QuestionCard";
import type { Question } from "@/lib/shared/types";

type QuestionListItem = {
  question: Question;
  originalIndex: number;
};

type Props = {
  items: QuestionListItem[];
  activeQuestion: number;
  totalQuestions: number;
  openMenuId: string | null;
  onOpenMenuChange: (id: string | null) => void;
  onSelectQuestion: (index: number) => void;
  onMoveQuestionUp: (index: number) => void;
  onMoveQuestionDown: (index: number) => void;
  onDuplicateQuestion: (index: number) => void;
  onRemoveQuestion: (index: number) => void;
};

export default function QuestionList({
  items,
  activeQuestion,
  totalQuestions,
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
      {items.map(({ question, originalIndex }) => (
        <QuestionCard
          key={question.id}
          question={question}
          index={originalIndex}
          activeQuestion={activeQuestion}
          totalQuestions={totalQuestions}
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