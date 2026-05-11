"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Menu, FileText } from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeacherSidebar from "@/components/teacher/dashboard/TeacherSidebar";
import QuizList from "@/components/teacher/dashboard/QuizList";
import CreateQuizDialog from "@/components/teacher/dashboard/CreateQuizDialog";
import { createQuiz, getTeacherQuizzes } from "@/lib/actions";
import type { Quiz } from "@/lib/types";

export default function TeacherDraftsPage() {
  const router = useRouter();

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [drafts, setDrafts] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizDescription, setNewQuizDescription] = useState("");

  useEffect(() => {
    const storedTeacherId = sessionStorage.getItem("teacherId");
    const storedTeacherName = sessionStorage.getItem("teacherName");

    if (!storedTeacherId) {
      router.push("/teacher/login");
      return;
    }

    setTeacherId(storedTeacherId);
    setTeacherName(storedTeacherName || "Teacher");
    loadDrafts(storedTeacherId);
  }, [router]);

  async function loadDrafts(id: string) {
    setIsLoading(true);

    try {
      const data = await getTeacherQuizzes(id);
      setDrafts(data.filter((quiz) => !quiz.published));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateQuiz() {
    if (!newQuizTitle.trim() || !teacherId) {
      alert("Quiz title is required.");
      return;
    }

    setIsCreating(true);

    try {
      const quiz = await createQuiz(
        newQuizTitle.trim(),
        newQuizDescription.trim(),
        teacherId
      );

      setNewQuizTitle("");
      setNewQuizDescription("");
      setDialogOpen(false);

      router.push(`/teacher/quiz/${quiz.id}/builder`);
    } catch {
      alert("Failed to create quiz.");
    } finally {
      setIsCreating(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("teacherId");
    sessionStorage.removeItem("teacherName");
    router.push("/");
  }

  return (
    <PageShell>
      <div className="min-h-screen lg:pl-64">
        <TeacherSidebar
          teacherName={teacherName}
          onLogout={handleLogout}
          onNewQuiz={() => setDialogOpen(true)}
          onDrafts={() => router.push("/teacher/drafts")}
          activePage="drafts"
        />

        {sidebarOpen && (
          <TeacherSidebar
            teacherName={teacherName}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onLogout={handleLogout}
            onNewQuiz={() => setDialogOpen(true)}
            onDrafts={() => router.push("/teacher/drafts")}
            activePage="drafts"
          />
        )}

        <main className="min-w-0 px-4 py-5 sm:px-6 md:px-10 lg:px-8 xl:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <header>
              <div className="mb-6 flex items-center justify-between lg:hidden">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-2xl font-extrabold text-transparent">
                  SentriQ
                </h1>

                <div className="h-10 w-10" />
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
                <FileText className="h-4 w-4" />
                Quiz Builder Drafts
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                Drafts
              </h2>

              <p className="mt-2 text-sm text-slate-400 md:text-base">
                Continue editing unpublished quizzes.
              </p>
            </header>

            <div className="w-full md:mt-[3.25rem] md:w-auto">
              <CreateQuizDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                title={newQuizTitle}
                description={newQuizDescription}
                isCreating={isCreating}
                onTitleChange={setNewQuizTitle}
                onDescriptionChange={setNewQuizDescription}
                onCreate={handleCreateQuiz}
              />
            </div>
          </div>

          <div className="mt-7 md:mt-8">
            {isLoading ? (
              <Card className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl md:p-12">
                <div className="flex items-center justify-center gap-3 text-slate-300">
                  <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
                  Loading drafts...
                </div>
              </Card>
            ) : (
              <QuizList items={drafts} />
            )}
          </div>
        </main>
      </div>
    </PageShell>
  );
}