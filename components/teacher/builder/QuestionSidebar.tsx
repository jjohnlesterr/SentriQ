"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  MoreVertical,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Question } from "@/lib/types";

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

function getQuestionTypeLabel(question: Question) {
  if (question.type === "multiple_choice") return "Multiple Choice";
  if (question.type === "true_false") return "True/False";
  return "Identification";
}

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
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  function handleAddQuestion() {
    onAddQuestion();
  }

  function handleSelectQuestion(index: number) {
    onSelectQuestion(index);
    onMobileOpenChange?.(false);
  }

  const content = (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white">
            {onMobileOpenChange ? "Select Question" : "Questions"}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Select and arrange quiz items
          </p>
        </div>

        {onMobileOpenChange && (
          <button
            type="button"
            aria-label="Close question selector"
            onClick={() => onMobileOpenChange(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
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
          <div className="space-y-2.5 pr-1">
            {questions.map((question, index) => {
              const isActive = activeQuestion === index;
              const isMenuOpen = openMenuIndex === index;

              return (
                <div
                  key={question.id}
                  className={`relative ${isMenuOpen ? "lg:mb-0 mb-36" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectQuestion(index)}
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
                      <p className="text-[11px] text-slate-500">
                        Question {index + 1}
                      </p>

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
                      setOpenMenuIndex((current) =>
                        current === index ? null : index,
                      );
                    }}
                    className="absolute right-2 top-3 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-2 top-14 z-[999] w-52 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
                      <button
                        type="button"
                        onClick={() => {
                          onMoveQuestionUp(index);
                          setOpenMenuIndex(null);
                        }}
                        disabled={index === 0}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowUp className="h-4 w-4" />
                        Move Up
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onMoveQuestionDown(index);
                          setOpenMenuIndex(null);
                        }}
                        disabled={index === questions.length - 1}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowDown className="h-4 w-4" />
                        Move Down
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onDuplicateQuestion(index);
                          setOpenMenuIndex(null);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </button>

                      <div className="my-1 h-px bg-white/10" />

                      <button
                        type="button"
                        onClick={() => {
                          onRemoveQuestion(index);
                          setOpenMenuIndex(null);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

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
          <div className="fixed inset-0 z-50 bg-slate-950 text-white lg:hidden">
            <div className="h-full overflow-y-auto px-4 pt-4 pb-40">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />
              {content}
            </div>
          </div>
        )}

        <div className="hidden lg:block">{content}</div>
      </>
    );
  }

  return content;
}
