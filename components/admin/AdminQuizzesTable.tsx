"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  BookOpen,
  Calendar,
  Eye,
  FileQuestion,
  Loader2,
  Search,
  User,
} from "lucide-react";

import DeleteQuizButton from "@/components/admin/DeleteQuizButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getAdminQuizzesPageAction } from "@/lib/actions/admin.actions";

type Quiz = {
  id: string;
  title: string | null;
  description: string | null;
  code: string | null;
  created_at: string | null;
  creator_email: string | null;
  question_count: number;
  session_count: number;
  status?: string | null;
};

function formatDate(dateValue: string | null) {
  if (!dateValue) return "—";

  return new Date(dateValue).toLocaleString();
}

export default function AdminQuizzesTable({
  initialQuizzes,
  initialHasMore,
  pageSize,
}: {
  initialQuizzes: Quiz[];
  initialHasMore: boolean;
  pageSize: number;
}) {
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const [isLoadingMore, startLoadingMore] = useTransition();
  const [isRefreshing, startRefreshing] = useTransition();

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    startRefreshing(async () => {
      const result = await getAdminQuizzesPageAction({
        page: 0,
        pageSize,
        search: debouncedSearch,
        status: "all",
      });

      setQuizzes(result.quizzes);
      setHasMore(result.hasMore);
      setPage(0);
    });
  }, [debouncedSearch, pageSize]);

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (!firstEntry?.isIntersecting || !hasMore || isLoadingMore) return;

        startLoadingMore(async () => {
          const nextPage = page + 1;

          const result = await getAdminQuizzesPageAction({
            page: nextPage,
            pageSize,
            search: debouncedSearch,
            status: "all",
          });

          setQuizzes((current) => {
            const existingIds = new Set(current.map((quiz) => quiz.id));

            const nextRows = result.quizzes.filter(
              (quiz) => !existingIds.has(quiz.id),
            );

            return [...current, ...nextRows];
          });

          setHasMore(result.hasMore);
          setPage(nextPage);
        });
      },
      {
        rootMargin: "300px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, page, pageSize, debouncedSearch]);

  return (
    <>
      <div className="border-b border-white/10 px-5 py-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search quizzes..."
            className="h-11 pl-11"
          />
        </div>
      </div>

      {isRefreshing && (
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Refreshing quizzes...
        </div>
      )}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1100px] table-fixed text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="w-[360px] px-5 py-3 font-medium">Quiz</th>
              <th className="w-[230px] px-5 py-3 font-medium">Creator</th>
              <th className="w-[120px] px-5 py-3 font-medium">Questions</th>
              <th className="w-[120px] px-5 py-3 font-medium">Attempts</th>
              <th className="w-[190px] px-5 py-3 font-medium">Created</th>
              <th className="w-[180px] px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="border-b border-white/5">
                <td className="px-5 py-4">
                  <div className="min-w-0">
                    <p
                      className="max-w-[300px] truncate font-medium text-white"
                      title={quiz.title || "Untitled Quiz"}
                    >
                      {quiz.title || "Untitled Quiz"}
                    </p>

                    {quiz.description && (
                      <p
                        className="mt-1 max-w-[320px] truncate text-xs text-slate-500"
                        title={quiz.description}
                      >
                        {quiz.description}
                      </p>
                    )}

                    <p className="mt-1 max-w-[160px] truncate text-xs text-cyan-300">
                      Code: {quiz.code || "—"}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-300">
                  <span
                    className="block max-w-[190px] truncate"
                    title={quiz.creator_email || "Unknown"}
                  >
                    {quiz.creator_email || "Unknown"}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {quiz.question_count}
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {quiz.session_count}
                </td>

                <td className="px-5 py-4 text-slate-400">
                  <span
                    className="block max-w-[160px] truncate"
                    title={formatDate(quiz.created_at)}
                  >
                    {formatDate(quiz.created_at)}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedQuiz(quiz)}
                      className="h-10 w-[85px]"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>

                    <DeleteQuizButton
                      quizId={quiz.id}
                      quizTitle={quiz.title || "this quiz"}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {!quizzes.length && !isRefreshing && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-slate-400"
                >
                  No quizzes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-white/10 md:hidden">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="space-y-4 px-5 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                <BookOpen className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-semibold text-white"
                  title={quiz.title || "Untitled Quiz"}
                >
                  {quiz.title || "Untitled Quiz"}
                </p>

                {quiz.description && (
                  <p
                    className="mt-1 line-clamp-2 text-xs text-slate-500"
                    title={quiz.description}
                  >
                    {quiz.description}
                  </p>
                )}

                <p className="mt-1 truncate text-xs text-cyan-300">
                  Code: {quiz.code || "—"}
                </p>

                <p
                  className="mt-1 truncate text-xs text-slate-500"
                  title={quiz.creator_email || "Unknown"}
                >
                  {quiz.creator_email || "Unknown"}
                </p>
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Questions</span>
                <span className="text-slate-300">{quiz.question_count}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Attempts</span>
                <span className="text-slate-300">{quiz.session_count}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Created</span>
                <span
                  className="max-w-[180px] truncate text-right text-slate-300"
                  title={formatDate(quiz.created_at)}
                >
                  {formatDate(quiz.created_at)}
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Button
                variant="ghost"
                onClick={() => setSelectedQuiz(quiz)}
                className="h-11 w-full"
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>

              <DeleteQuizButton
                quizId={quiz.id}
                quizTitle={quiz.title || "this quiz"}
              />
            </div>
          </div>
        ))}

        {!quizzes.length && !isRefreshing && (
          <div className="px-5 py-10 text-center text-slate-400">
            No quizzes found.
          </div>
        )}
      </div>

      <div
        ref={loaderRef}
        className="px-5 py-5 text-center text-sm text-slate-400"
      >
        {isLoadingMore ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more quizzes...
          </span>
        ) : hasMore ? (
          "Scroll to load more quizzes"
        ) : quizzes.length > 0 ? (
          "No more quizzes."
        ) : null}
      </div>

      <Dialog
        open={selectedQuiz !== null}
        onOpenChange={() => setSelectedQuiz(null)}
      >
        <DialogContent className="max-h-[85vh] w-[calc(100vw-2rem)] max-w-3xl overflow-y-auto border-cyan-400/20 bg-slate-950">
          {selectedQuiz && (
            <>
              <DialogHeader>
                <DialogTitle
                  className="break-words"
                  title={selectedQuiz.title || "Untitled Quiz"}
                >
                  {selectedQuiz.title || "Untitled Quiz"}
                </DialogTitle>

                <DialogDescription>
                  Quiz information and usage statistics.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="min-w-0 rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="h-4 w-4 text-cyan-300" />
                    Creator
                  </div>

                  <p
                    className="mt-2 truncate text-sm text-white"
                    title={selectedQuiz.creator_email || "Unknown"}
                  >
                    {selectedQuiz.creator_email || "Unknown"}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="h-4 w-4 text-cyan-300" />
                    Created
                  </div>

                  <p
                    className="mt-2 truncate text-sm text-white"
                    title={formatDate(selectedQuiz.created_at)}
                  >
                    {formatDate(selectedQuiz.created_at)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <FileQuestion className="h-4 w-4 text-cyan-300" />
                    Questions
                  </div>

                  <p className="mt-2 text-sm text-white">
                    {selectedQuiz.question_count}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <BookOpen className="h-4 w-4 text-cyan-300" />
                    Attempts
                  </div>

                  <p className="mt-2 text-sm text-white">
                    {selectedQuiz.session_count}
                  </p>
                </div>
              </div>

              {selectedQuiz.description && (
                <div className="mt-4 rounded-2xl border border-white/10 p-4">
                  <p className="text-sm text-slate-400">Description</p>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-white">
                    {selectedQuiz.description}
                  </p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}