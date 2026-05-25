"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";

import QuestionList from "@/components/teacher/builder/question-list/QuestionList";
import QuestionPagination from "@/components/teacher/builder/question-list/QuestionPagination";
import { Button } from "@/components/ui/button";
import type { Question } from "@/lib/shared/types";

type Props = {
  questions: Question[];
  activeQuestion: number;
  canAddQuestion: boolean;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  onSelectQuestion: (index: number) => void;
  onAddQuestion: () => void;
  onMoveQuestionUp: (index: number) => void;
  onMoveQuestionDown: (index: number) => void;
  onDuplicateQuestion: (index: number) => void;
  onRemoveQuestion: (index: number) => void;
  onReorderQuestions?: (activeId: string, overId: string) => void;
};

const VISIBLE_QUESTION_LIMIT = 5;

export default function QuestionSidebar({
  questions,
  activeQuestion,
  canAddQuestion,
  mobileOpen = false,
  onMobileOpenChange,
  onSelectQuestion,
  onAddQuestion,
  onMoveQuestionUp,
  onMoveQuestionDown,
  onDuplicateQuestion,
  onRemoveQuestion,
}: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleQuestionItems = useMemo(() => {
    const source = isExpanded
      ? questions
      : questions.slice(0, VISIBLE_QUESTION_LIMIT);

    return source.map((question) => ({
      question,
      originalIndex: questions.findIndex((item) => item.id === question.id),
    }));
  }, [isExpanded, questions]);

  function handleAddQuestion() {
    onAddQuestion();
    setOpenMenuId(null);
  }

  function handleSelectQuestion(index: number) {
    onSelectQuestion(index);
    onMobileOpenChange?.(false);
  }

  function handleSeeMore() {
    setIsExpanded(true);
    setOpenMenuId(null);
  }

  function handleSeeLess() {
    setIsExpanded(false);
    setOpenMenuId(null);
  }

  const content = (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white">Questions</h2>

          <p className="mt-1 text-xs text-slate-500">
            Manage and arrange quiz questions
          </p>
        </div>

        {onMobileOpenChange && (
          <button
            type="button"
            aria-label="Close question selector"
            onClick={() => onMobileOpenChange(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {questions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4">
          <Button
            type="button"
            data-add-question-trigger
            onClick={handleAddQuestion}
            className="h-11 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
          >
            <Plus className="h-4 w-4" />
            Add First Question
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <QuestionList
            items={visibleQuestionItems}
            activeQuestion={activeQuestion}
            totalQuestions={questions.length}
            openMenuId={openMenuId}
            onOpenMenuChange={setOpenMenuId}
            onSelectQuestion={handleSelectQuestion}
            onMoveQuestionUp={onMoveQuestionUp}
            onMoveQuestionDown={onMoveQuestionDown}
            onDuplicateQuestion={onDuplicateQuestion}
            onRemoveQuestion={onRemoveQuestion}
          />

          <QuestionPagination
            totalQuestions={questions.length}
            visibleCount={VISIBLE_QUESTION_LIMIT}
            isExpanded={isExpanded}
            onSeeMore={handleSeeMore}
            onSeeLess={handleSeeLess}
          />

          <Button
            type="button"
            data-add-question-trigger
            onClick={handleAddQuestion}
            disabled={!canAddQuestion}
            className="h-11 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/10 hover:from-cyan-600 hover:to-blue-600 disabled:cursor-not-allowed disabled:bg-black/30 disabled:from-black/30 disabled:to-black/30 disabled:text-slate-500"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>

          {!canAddQuestion && (
            <p className="text-center text-xs text-slate-500">
              Complete the current question first.
            </p>
          )}
        </div>
      )}
    </section>
  );

  if (onMobileOpenChange) {
    return (
      <>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950 text-white xl:hidden">
            <div className="h-full overflow-y-auto px-4 pb-40 pt-4">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />
              {content}
            </div>
          </div>
        )}
      </>
    );
  }

  return content;
}
