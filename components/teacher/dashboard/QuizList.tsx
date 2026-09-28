"use client";

import { useState } from "react";
import {
  Edit,
  Eye,
  FileText,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useInfiniteScroll } from "@/hooks/shared/useInfiniteScroll";
import { useSearchableList } from "@/hooks/shared/useSearchableList";

import type { DashboardQuiz } from "@/hooks/teacher/useTeacherQuizzes";

type Props = {
  items: DashboardQuiz[];
  onDeleteQuiz: (quizId: string) => Promise<void> | void;
};

const INITIAL_VISIBLE = 5;
const LOAD_MORE_STEP = 5;

export default function QuizList({ items, onDeleteQuiz }: Props) {
  const router = useRouter();

  const [quizToDelete, setQuizToDelete] = useState<DashboardQuiz | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { search, setSearch, filteredItems } = useSearchableList({
    items,
    searchBy: (quiz) => `${quiz.title} ${quiz.description} ${quiz.code}`,
  });

  const { visibleItems, hasMoreItems, loaderRef } = useInfiniteScroll(
    filteredItems,
    INITIAL_VISIBLE,
    LOAD_MORE_STEP,
  );

  async function confirmDeleteQuiz() {
    if (!quizToDelete) return;

    setIsDeleting(true);

    try {
      await onDeleteQuiz(quizToDelete.id);
      setQuizToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  function renderQuizRow(quiz: DashboardQuiz) {
    return (
      <li
        key={quiz.id}
        className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="truncate font-medium text-white">{quiz.title}</h3>

            {quiz.published ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Published
              </span>
            ) : (
              <span className="text-xs text-slate-500">Draft</span>
            )}

            {quiz.isAnswering && (
              <span className="inline-flex items-center gap-1.5 text-xs text-cyan-300">
                <Loader2 className="h-3 w-3 animate-spin" />
                {quiz.activeSessionCount > 0
                  ? `${quiz.activeSessionCount} answering`
                  : "Answering"}
              </span>
            )}
          </div>

          {quiz.description && (
            <p className="mt-1 line-clamp-1 text-sm text-slate-400">{quiz.description}</p>
          )}

          <p className="mt-1.5 text-xs text-slate-500">
            {quiz.questions.length} {quiz.questions.length === 1 ? "question" : "questions"}
            {quiz.published && (
              <>
                {" · "}
                Code <span className="font-mono tracking-wider text-slate-300">{quiz.code}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {quiz.published && (
            <Button
              type="button"
              size="sm"
              onClick={() => router.push(`/teacher/quiz/${quiz.id}/monitor`)}
              className="h-9 flex-1 px-3 text-sm sm:flex-none"
            >
              <Eye className="h-4 w-4" />
              Monitor
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={quiz.isAnswering}
            title={
              quiz.isAnswering
                ? "Students are currently answering this quiz."
                : undefined
            }
            onClick={() => router.push(`/teacher/quiz/${quiz.id}/builder`)}
            className="h-9 flex-1 px-3 text-sm sm:flex-none"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Delete ${quiz.title}`}
            title="Delete quiz"
            onClick={() => setQuizToDelete(quiz)}
            className="h-9 w-9 shrink-0 text-slate-400 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </li>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line-strong px-6 py-14 text-center">
        <FileText className="mx-auto h-6 w-6 text-slate-500" />

        <h3 className="mt-3 font-medium text-white">No quizzes here yet</h3>

        <p className="mt-1 text-sm text-slate-400">
          Create a quiz to start adding questions.
        </p>

        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            const trigger = document.querySelector<HTMLButtonElement>(
              "[data-create-quiz-trigger]",
            );

            trigger?.click();
          }}
          className="mx-auto mt-5"
        >
          <Plus className="h-4 w-4" />
          Create quiz
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description or code"
            aria-label="Search quizzes"
            maxLength={100}
            className="h-10 pl-10"
          />
        </div>

        {filteredItems.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line-strong px-6 py-10 text-center text-sm text-slate-400">
            No quizzes match “{search}”.
          </p>
        ) : (
          <>
            <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
              {visibleItems.map(renderQuizRow)}
            </ul>

            {hasMoreItems && (
              <div
                ref={loaderRef}
                className="flex items-center justify-center py-5 text-sm text-slate-400"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading more quizzes...
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!quizToDelete}
        title="Delete quiz?"
        description={`Are you sure you want to delete "${quizToDelete?.title}"? This will also delete its sessions.`}
        confirmText="Delete quiz"
        loadingText="Deleting…"
        isLoading={isDeleting}
        confirmVariant="destructive"
        onOpenChange={(open) => {
          if (!open) setQuizToDelete(null);
        }}
        onConfirm={confirmDeleteQuiz}
      />
    </>
  );
}