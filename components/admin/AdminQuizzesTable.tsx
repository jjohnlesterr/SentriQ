"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Clock,
  Eye,
  FileQuestion,
  Lock,
  Search,
  Unlock,
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

type Question = {
  id: string;
  quiz_id: string | null;
  type: string | null;
  text: string | null;
  options: string[] | null;
  correct_answer: number | null;
  correct_text?: string | null;
  correct_text_answer?: string | null;
  position: number | null;
  created_at: string | null;
};

type Quiz = {
  id: string;
  title: string | null;
  description: string | null;
  code: string | null;
  created_by: string | null;
  creator_email: string | null;
  published: boolean | null;
  status: string | null;
  created_at: string | null;
  time_limit_minutes: number | null;
  join_locked: boolean | null;
  questions: Question[];
  question_count: number;
  session_count: number;
};

type AdminQuizzesTableProps = {
  quizzes: Quiz[];
};

function formatDate(dateValue: string | null) {
  if (!dateValue) return "—";
  return new Date(dateValue).toLocaleDateString();
}

function formatStatus(quiz: Quiz) {
  if (quiz.published === true || quiz.status === "published") {
    return "Published";
  }

  if (quiz.status === "draft") return "Draft";

  return quiz.status || "Unknown";
}

function getStatusClass(quiz: Quiz) {
  if (quiz.published === true || quiz.status === "published") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
  }

  if (quiz.status === "draft" || quiz.published === false) {
    return "border-yellow-400/20 bg-yellow-500/10 text-yellow-200";
  }

  return "border-white/10 bg-white/5 text-slate-300";
}

function formatQuestionType(type: string | null) {
  if (type === "multiple_choice") return "Multiple Choice";
  if (type === "true_false") return "True / False";
  if (type === "identification") return "Identification";

  return type || "Question";
}

function getCorrectAnswer(question: Question) {
  const textAnswer = question.correct_text ?? question.correct_text_answer;

  if (textAnswer) return textAnswer;

  if (
    Array.isArray(question.options) &&
    question.correct_answer !== null &&
    question.options[question.correct_answer]
  ) {
    return question.options[question.correct_answer];
  }

  return "—";
}

export default function AdminQuizzesTable({ quizzes }: AdminQuizzesTableProps) {
  const [search, setSearch] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const filteredQuizzes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return quizzes.filter((quiz) => {
      const matchesSearch =
        (quiz.title ?? "").toLowerCase().includes(query) ||
        (quiz.description ?? "").toLowerCase().includes(query) ||
        (quiz.code ?? "").toLowerCase().includes(query) ||
        (quiz.creator_email ?? "").toLowerCase().includes(query);

      const isPublished =
        quiz.published === true || quiz.status === "published";

      const matchesPublished =
        publishedFilter === "all"
          ? true
          : publishedFilter === "published"
            ? isPublished
            : !isPublished;

      return matchesSearch && matchesPublished;
    });
  }, [quizzes, search, publishedFilter]);

  return (
    <>
      <div className="grid gap-3 border-b border-white/10 px-5 py-4 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quiz title, code, description, or creator..."
            className="h-11 pl-11"
          />
        </div>

        <select
          value={publishedFilter}
          onChange={(e) => setPublishedFilter(e.target.value)}
          className="h-11 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none"
        >
          <option value="all">All quizzes</option>
          <option value="published">Published only</option>
          <option value="draft">Draft/unpublished</option>
        </select>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1200px] table-auto text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="w-[320px] px-5 py-3 font-medium">Quiz</th>
              <th className="w-[240px] px-5 py-3 font-medium">Creator</th>
              <th className="w-[130px] px-5 py-3 font-medium">Questions</th>
              <th className="w-[130px] px-5 py-3 font-medium">Sessions</th>
              <th className="w-[140px] px-5 py-3 font-medium">Status</th>
              <th className="w-[140px] px-5 py-3 font-medium">Created</th>
              <th className="w-[230px] px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredQuizzes.map((quiz) => (
              <tr key={quiz.id} className="border-b border-white/5">
                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                      <BookOpen className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p
                        title={quiz.title || "Untitled quiz"}
                        className="max-w-[260px] truncate font-semibold text-white"
                      >
                        {quiz.title || "Untitled quiz"}
                      </p>

                      <p
                        title={quiz.description || "No description"}
                        className="mt-1 max-w-[280px] truncate text-xs text-slate-500"
                      >
                        {quiz.description || "No description"}
                      </p>

                      <p className="mt-1 text-xs text-cyan-300">
                        Code: {quiz.code || "—"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-400">
                  <span
                    title={quiz.creator_email || "—"}
                    className="block max-w-[220px] truncate"
                  >
                    {quiz.creator_email || "—"}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {quiz.question_count}
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {quiz.session_count}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                      quiz,
                    )}`}
                  >
                    {formatStatus(quiz)}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-400">
                  {formatDate(quiz.created_at)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedQuiz(quiz)}
                      className="h-10 w-[95px]"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>

                    <DeleteQuizButton quizId={quiz.id} />
                  </div>
                </td>
              </tr>
            ))}

            {!filteredQuizzes.length && (
              <tr>
                <td
                  colSpan={7}
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
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.id} className="space-y-4 px-5 py-5">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                <BookOpen className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  title={quiz.title || "Untitled quiz"}
                  className="truncate text-sm font-semibold text-white"
                >
                  {quiz.title || "Untitled quiz"}
                </p>

                <p
                  title={quiz.description || "No description"}
                  className="mt-1 truncate text-xs text-slate-500"
                >
                  {quiz.description || "No description"}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                      quiz,
                    )}`}
                  >
                    {formatStatus(quiz)}
                  </span>

                  <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    {quiz.question_count} Questions
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Creator</span>
                <span
                  title={quiz.creator_email || "—"}
                  className="max-w-[190px] truncate text-right text-slate-300"
                >
                  {quiz.creator_email || "—"}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Sessions</span>
                <span className="text-slate-300">{quiz.session_count}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Created</span>
                <span className="text-slate-300">
                  {formatDate(quiz.created_at)}
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSelectedQuiz(quiz)}
                className="h-11 w-full"
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>

              <DeleteQuizButton quizId={quiz.id} />
            </div>
          </div>
        ))}

        {!filteredQuizzes.length && (
          <div className="px-5 py-10 text-center text-slate-400">
            No quizzes found.
          </div>
        )}
      </div>

      <Dialog
        open={selectedQuiz !== null}
        onOpenChange={() => setSelectedQuiz(null)}
      >
        <DialogContent className="max-h-[85vh] w-[calc(100vw-2rem)] max-w-4xl overflow-y-auto border-cyan-400/20 bg-slate-950 p-5 sm:p-6">
          {selectedQuiz && (
            <>
              <DialogHeader>
                <DialogTitle className="break-words text-2xl">
                  {selectedQuiz.title || "Untitled quiz"}
                </DialogTitle>

                <DialogDescription className="break-words">
                  {selectedQuiz.description ||
                    "Review quiz metadata, questions, options, and correct answers."}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm md:grid-cols-2">
                <div>
                  <p className="text-slate-500">Code</p>
                  <p className="mt-1 font-semibold text-cyan-300">
                    {selectedQuiz.code || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Creator</p>
                  <p className="mt-1 truncate text-white">
                    {selectedQuiz.creator_email || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Status</p>
                  <span
                    className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                      selectedQuiz,
                    )}`}
                  >
                    {formatStatus(selectedQuiz)}
                  </span>
                </div>

                <div>
                  <p className="text-slate-500">Created</p>
                  <p className="mt-1 text-white">
                    {formatDate(selectedQuiz.created_at)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Time Limit</p>
                  <p className="mt-1 flex items-center gap-2 text-white">
                    <Clock className="h-4 w-4 text-slate-500" />
                    {selectedQuiz.time_limit_minutes
                      ? `${selectedQuiz.time_limit_minutes} minutes`
                      : "No time limit"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Join Lock</p>
                  <p className="mt-1 flex items-center gap-2 text-white">
                    {selectedQuiz.join_locked ? (
                      <Lock className="h-4 w-4 text-red-300" />
                    ) : (
                      <Unlock className="h-4 w-4 text-emerald-300" />
                    )}
                    {selectedQuiz.join_locked ? "Locked" : "Open"}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <FileQuestion className="h-5 w-5 text-cyan-300" />
                  Questions ({selectedQuiz.question_count})
                </h3>

                <div className="mt-4 space-y-4">
                  {selectedQuiz.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                        Question {index + 1} ·{" "}
                        {formatQuestionType(question.type)}
                      </p>

                      <p className="mt-2 break-words font-medium text-white">
                        {question.text || "Untitled question"}
                      </p>

                      {Array.isArray(question.options) &&
                        question.options.length > 0 && (
                          <div className="mt-4 grid gap-2">
                            {question.options.map((option, optionIndex) => {
                              const isCorrect =
                                question.correct_answer === optionIndex;

                              return (
                                <div
                                  key={`${question.id}-${optionIndex}`}
                                  className={`break-words rounded-xl border px-3 py-2 text-sm ${
                                    isCorrect
                                      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                                      : "border-white/10 bg-white/[0.02] text-slate-300"
                                  }`}
                                >
                                  <span className="mr-2 font-semibold">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  {option}
                                </div>
                              );
                            })}
                          </div>
                        )}

                      <div className="mt-4 break-words rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100">
                        Correct Answer:{" "}
                        <span className="font-semibold">
                          {getCorrectAnswer(question)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {!selectedQuiz.questions.length && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-slate-400">
                      No questions found for this quiz.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
