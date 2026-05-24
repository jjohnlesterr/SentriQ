"use client";

import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useExpandableList } from "@/hooks/shared/useExpandableList";
import { useSearchableList } from "@/hooks/shared/useSearchableList";

import type { Quiz } from "@/lib/shared/types";

type Props = {
  items: Quiz[];
  onDeleteQuiz: (quizId: string) => void;
};

const VISIBLE_LIMIT = 5;

export default function QuizList({ items, onDeleteQuiz }: Props) {
  const router = useRouter();

  const { search, setSearch, filteredItems } = useSearchableList({
    items,
    searchBy: (quiz) => `${quiz.title} ${quiz.description} ${quiz.code}`,
  });

  const {
    expanded,
    visibleItems,
    hasHiddenItems,
    hiddenCount,
    showMore,
    showLess,
  } = useExpandableList(filteredItems, VISIBLE_LIMIT);

  if (items.length === 0) {
    return (
      <Card className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl md:p-12">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-slate-500 md:h-24 md:w-24">
          <FileText className="h-9 w-9 md:h-10 md:w-10" />
        </div>

        <h3 className="text-lg font-bold text-white md:text-xl">
          No quizzes yet
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Create your first quiz to get started.
        </p>

        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            const trigger = document.querySelector<HTMLButtonElement>(
              "[data-create-quiz-trigger]"
            );

            trigger?.click();
          }}
          className="mx-auto mt-5 h-11 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm text-white hover:bg-white/10"
        >
          <Plus className="h-4 w-4" />
          Create Quiz
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl border border-cyan-400/10 bg-[#081121] shadow-[0_0_0_1px_rgba(34,211,238,0.03)] transition focus-within:border-cyan-400/30 focus-within:ring-2 focus-within:ring-cyan-400/10">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300/70" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quizzes..."
          maxLength={100}
          className="h-12 rounded-2xl border-0 bg-transparent pl-11 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {filteredItems.length === 0 ? (
        <Card className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
          <p className="text-sm text-slate-400">No quizzes found.</p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {visibleItems.map((quiz) => (
              <Card
                key={quiz.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:border-white/20 md:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <h3 className="truncate text-lg font-bold text-white md:text-xl">
                        {quiz.title}
                      </h3>

                      <span
                        className={
                          quiz.published
                            ? "rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-200"
                            : "rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200"
                        }
                      >
                        {quiz.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <p className="text-sm leading-6 text-slate-400">
                      {quiz.description || "No description provided."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
                      <span>{quiz.questions.length} Questions</span>

                      {quiz.published && (
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-mono text-cyan-200">
                          {quiz.code}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        router.push(`/teacher/quiz/${quiz.id}/builder`)
                      }
                      className="h-10 cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>

                    {quiz.published && (
                      <Button
                        type="button"
                        onClick={() =>
                          router.push(`/teacher/quiz/${quiz.id}/monitor`)
                        }
                        className="h-10 cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                        Monitor
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onDeleteQuiz(quiz.id)}
                      className="h-10 cursor-pointer border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/20 hover:text-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {hasHiddenItems && (
            <Button
              type="button"
              variant="ghost"
              onClick={expanded ? showLess : showMore}
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 text-sm text-white hover:bg-white/10"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  See Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  See More ({hiddenCount})
                </>
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
}