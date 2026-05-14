"use client";

import { MoreVertical } from "lucide-react";

import QuestionActionMenu from "@/components/teacher/builder/question-list/QuestionActionMenu";
import type { Question } from "@/lib/shared/types";

type Props = {
  question: Question;
  index: number;
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

function getQuestionTypeLabel(question: Question) {
  if (question.type === "multiple_choice") return "Multiple Choice";
  if (question.type === "true_false") return "True/False";
  return "Identification";
}

export default function QuestionCard({
  question,
  index,
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
  const isActive = activeQuestion === index;
  const isMenuOpen = openMenuId === question.id;

  return (
    <div className={`relative ${isMenuOpen ? "lg:mb-0 mb-36" : ""}`}>
      <button
        type="button"
        onClick={() => onSelectQuestion(index)}
        className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-3 pr-12 text-left transition ${
          isActive
            ? "border-cyan-400/50 bg-cyan-500/10 shadow-[0_12px_40px_rgba(34,211,238,0.08)]"
            : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
        }`}
      >
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-bold ${
            isActive
              ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300"
              : "border-white/10 bg-white/5 text-slate-500"
          }`}
        >
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-slate-500">Question {index + 1}</p>

          <p className="mt-0.5 line-clamp-3 break-words text-xs font-semibold leading-4 text-white">
            {question.text || "Untitled question"}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {getQuestionTypeLabel(question)}
          </p>
        </div>
      </button>

      <button
        type="button"
        aria-label={`Open actions for question ${index + 1}`}
        onClick={(event) => {
          event.stopPropagation();
          onOpenMenuChange(isMenuOpen ? null : question.id);
        }}
        className="absolute right-2 top-3 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {isMenuOpen && (
        <QuestionActionMenu
          index={index}
          totalQuestions={totalQuestions}
          onMoveUp={onMoveQuestionUp}
          onMoveDown={onMoveQuestionDown}
          onDuplicate={onDuplicateQuestion}
          onRemove={onRemoveQuestion}
          onClose={() => onOpenMenuChange(null)}
        />
      )}
    </div>
  );
}