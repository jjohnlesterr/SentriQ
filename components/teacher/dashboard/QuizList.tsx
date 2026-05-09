"use client";

import { useRouter } from "next/navigation";
import { Edit, Eye } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Quiz } from "@/lib/types";

type Props = {
  items: Quiz[];
};

export default function QuizList({ items }: Props) {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <EmptyState
        title="No quizzes found."
        description="Create your first quiz to get started."
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((quiz) => (
        <Card
          key={quiz.id}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-bold text-white">{quiz.title}</h3>

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

              <p className="text-sm text-slate-400">
                {quiz.description || "No description provided."}
              </p>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
                <span>Questions: {quiz.questions.length}</span>
                <span>Status: {quiz.published ? "Published" : "Draft"}</span>

                {quiz.published && (
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-mono text-cyan-200">
                    Code: {quiz.code}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push(`/teacher/quiz/${quiz.id}/builder`)}
                className="cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
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
                  className="cursor-pointer hover:scale-[1.02]"
                >
                  <Eye className="h-4 w-4" />
                  Monitor
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}