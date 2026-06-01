"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import DeleteQuizButton from "@/components/admin/DeleteQuizButton";
import { Input } from "@/components/ui/input";

type Quiz = {
  id: string;
  title: string | null;
  code: string | null;
  created_by: string | null;
  published: boolean | null;
  status: string | null;
  created_at: string | null;
};

type AdminQuizzesTableProps = {
  quizzes: Quiz[];
};

export default function AdminQuizzesTable({
  quizzes,
}: AdminQuizzesTableProps) {
  const [search, setSearch] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("all");

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        (quiz.title ?? "").toLowerCase().includes(query) ||
        (quiz.code ?? "").toLowerCase().includes(query) ||
        (quiz.created_by ?? "").toLowerCase().includes(query);

      const matchesPublished =
        publishedFilter === "all"
          ? true
          : publishedFilter === "published"
            ? quiz.published === true
            : quiz.published !== true;

      return matchesSearch && matchesPublished;
    });
  }, [quizzes, search, publishedFilter]);

  return (
    <>
      <div className="grid gap-3 border-b border-white/10 px-5 py-4 md:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quiz title, code, or creator..."
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px] table-auto text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="w-[220px] px-5 py-3 font-medium">Title</th>
              <th className="w-[120px] px-5 py-3 font-medium">Code</th>
              <th className="w-[260px] px-5 py-3 font-medium">Created By</th>
              <th className="w-[140px] px-5 py-3 font-medium">Status</th>
              <th className="w-[120px] px-5 py-3 font-medium">Published</th>
              <th className="w-[140px] px-5 py-3 font-medium">Created</th>
              <th className="sticky right-0 w-[140px] bg-[#0b1020] px-5 py-3 font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredQuizzes.map((quiz) => (
              <tr key={quiz.id} className="border-b border-white/5">
                <td className="px-5 py-4 text-white">
                  {quiz.title || "Untitled quiz"}
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {quiz.code || "—"}
                </td>

                <td className="px-5 py-4 text-slate-400">
                  <span className="block max-w-[230px] truncate">
                    {quiz.created_by || "—"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex max-w-[120px] items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                    <span className="truncate">{quiz.status || "unknown"}</span>
                  </span>
                </td>

                <td className="px-5 py-4">
                  {quiz.published ? (
                    <span className="text-emerald-300">Yes</span>
                  ) : (
                    <span className="text-slate-400">No</span>
                  )}
                </td>

                <td className="px-5 py-4 text-slate-400">
                  {quiz.created_at
                    ? new Date(quiz.created_at).toLocaleDateString()
                    : "—"}
                </td>

                <td className="sticky right-0 bg-[#0b1020] px-5 py-4">
                  <DeleteQuizButton quizId={quiz.id} />
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
    </>
  );
}