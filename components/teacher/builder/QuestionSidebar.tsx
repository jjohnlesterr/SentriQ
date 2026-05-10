"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  GripVertical,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Question } from "@/lib/types";

type Props = {
  questions: Question[];
  activeQuestion: number;
  canAddQuestion: boolean;
  onSelectQuestion: (index: number) => void;
  onAddQuestion: () => void;
  onMoveQuestionUp: (index: number) => void;
  onMoveQuestionDown: (index: number) => void;
  onDuplicateQuestion: (index: number) => void;
  onRemoveQuestion: (index: number) => void;
};

const INITIAL_VISIBLE_QUESTIONS = 3;
const QUESTIONS_LOAD_STEP = 10;

export default function QuestionSidebar({
  questions,
  activeQuestion,
  canAddQuestion,
  onSelectQuestion,
  onAddQuestion,
  onMoveQuestionUp,
  onMoveQuestionDown,
  onDuplicateQuestion,
  onRemoveQuestion,
}: Props) {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_QUESTIONS);

  const visibleQuestions = questions.slice(0, visibleCount);

  function getQuestionTypeLabel(question: Question) {
    if (question.type === "multiple_choice") return "Multiple Choice";
    if (question.type === "true_false") return "True/False";
    return "Identification";
  }

  function handleAddQuestion() {
    onAddQuestion();
    setVisibleCount((prev) => Math.max(prev, INITIAL_VISIBLE_QUESTIONS));
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Questions</p>

        <p className="text-xs text-slate-400">
          {questions.length} question{questions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {questions.length === 0 ? (
        <Card className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
            <Plus className="h-6 w-6" />
          </div>

          <p className="font-semibold text-white">No questions yet</p>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Start building your quiz by adding your first question.
          </p>

          <Button
            type="button"
            data-add-question-trigger
            onClick={handleAddQuestion}
            className="mt-5 h-11 w-full cursor-pointer rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {visibleQuestions.map((question, index) => (
            <div key={question.id} className="relative">
              <button
                type="button"
                onClick={() => onSelectQuestion(index)}
                className={`group flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-3 pr-12 text-left transition ${
                  activeQuestion === index
                    ? "border-violet-400/70 bg-violet-500/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/5"
                }`}
              >
                <GripVertical className="mt-1 h-5 w-5 shrink-0 text-slate-500" />

                <div className="min-w-0 flex-1">
                  <p className="break-words text-xs text-slate-400">
                    Question {index + 1} · {getQuestionTypeLabel(question)}
                  </p>

                  <p className="mt-1 break-words text-sm font-semibold text-white">
                    {question.text || "Untitled question"}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenMenuIndex((current) =>
                    current === index ? null : index
                  );
                }}
                className="absolute right-2 top-3 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              {openMenuIndex === index && (
                <div className="absolute right-2 top-12 z-30 w-44 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-1 shadow-2xl backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={() => {
                      onMoveQuestionUp(index);
                      setOpenMenuIndex(null);
                    }}
                    disabled={index === 0}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
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
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
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
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
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
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {visibleCount < questions.length && (
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setVisibleCount((prev) =>
                  Math.min(prev + QUESTIONS_LOAD_STEP, questions.length)
                )
              }
              className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10 hover:text-white"
            >
              See More ({questions.length - visibleCount})
            </Button>
          )}

          <Button
            type="button"
            data-add-question-trigger
            onClick={handleAddQuestion}
            disabled={!canAddQuestion}
            className="h-11 w-full cursor-pointer rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 disabled:cursor-not-allowed disabled:bg-black/30 disabled:from-black/30 disabled:to-black/30 disabled:text-slate-500"
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
    </div>
  );
}