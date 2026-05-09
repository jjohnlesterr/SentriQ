"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Question } from "@/lib/types";

type Props = {
  questions: Question[];
  activeQuestion: number;
  canAddQuestion: boolean;
  onSelectQuestion: (index: number) => void;
  onAddQuestion: () => void;
};

const QUESTIONS_PER_PAGE = 4;

export default function QuestionSidebar({
  questions,
  activeQuestion,
  canAddQuestion,
  onSelectQuestion,
  onAddQuestion,
}: Props) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIndex = page * QUESTIONS_PER_PAGE;
  const visibleQuestions = questions.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );

  useEffect(() => {
    const activePage = Math.floor(activeQuestion / QUESTIONS_PER_PAGE);
    setPage(activePage);
  }, [activeQuestion]);

  function goPreviousPage() {
    setPage((prev) => Math.max(0, prev - 1));
  }

  function goNextPage() {
    setPage((prev) => Math.min(totalPages - 1, prev + 1));
  }

  return (
    <div className="lg:col-span-1">
      <Card className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="mb-4 grid grid-cols-2 gap-2 lg:block lg:space-y-2">
          {visibleQuestions.map((question, visibleIndex) => {
            const index = startIndex + visibleIndex;

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => onSelectQuestion(index)}
                className={`min-w-0 cursor-pointer rounded-2xl border p-3 text-left transition-all lg:w-full ${
                  activeQuestion === index
                    ? "border-blue-400/40 bg-blue-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
                  Q{index + 1} ·{" "}
                  {question.type === "multiple_choice"
                    ? "Multiple Choice"
                    : question.type === "true_false"
                    ? "True/False"
                    : "Identification"}
                </p>

                <p className="truncate text-sm text-white">
                  {question.text || "Untitled question"}
                </p>
              </button>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mb-4 flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={goPreviousPage}
              disabled={page === 0}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <p className="text-xs text-slate-400">
              Page{" "}
              <span className="font-medium text-white">{page + 1}</span> of{" "}
              {totalPages}
            </p>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={goNextPage}
              disabled={page >= totalPages - 1}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button
          type="button"
          onClick={onAddQuestion}
          disabled={!canAddQuestion}
          className="h-11 w-full cursor-pointer bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </Button>

        {!canAddQuestion && (
          <p className="mt-3 text-center text-xs text-slate-500">
            Complete the current question first.
          </p>
        )}
      </Card>
    </div>
  );
}