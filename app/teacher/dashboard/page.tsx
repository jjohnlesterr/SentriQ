"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import TeacherAppSidebar from "@/components/layout/sidebar/TeacherAppSidebar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DashboardHeader from "@/components/teacher/dashboard/DashboardHeader";
import StatsCard from "@/components/teacher/dashboard/StatsCard";
import QuizList from "@/components/teacher/dashboard/QuizList";
import CreateQuizDialog from "@/components/teacher/dashboard/CreateQuizDialog";

import { createQuiz, deleteQuiz, getTeacherQuizzes } from "@/lib/actions";
import type { Quiz } from "@/lib/types";

export default function TeacherDashboardPage() {
  const router = useRouter();

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
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
    loadQuizzes(storedTeacherId);
  }, [router]);

  async function loadQuizzes(id: string) {
    setIsLoading(true);

    try {
      const data = await getTeacherQuizzes(id);
      setQuizzes(data);
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

      setQuizzes((prev) => [...prev, quiz]);
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

  async function handleDeleteQuiz(quizId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz? This will also delete its sessions."
    );

    if (!confirmed) return;

    try {
      await deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
    } catch {
      alert("Failed to delete quiz.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("teacherId");
    sessionStorage.removeItem("teacherName");
    router.push("/");
  }

  const publishedQuizzes = quizzes.filter((quiz) => quiz.published);
  const draftQuizzes = quizzes.filter((quiz) => !quiz.published);

  return (
    <PageShell>
      <div className="min-h-screen lg:pl-64">
        <TeacherAppSidebar
          teacherName={teacherName}
          quizzes={quizzes}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
          onNewQuiz={() => {
            setDialogOpen(true);
            setSidebarOpen(false);
          }}
          activePage="dashboard"
        />

        <main className="min-w-0 px-4 py-5 sm:px-6 md:px-10 lg:px-8 xl:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <DashboardHeader
              teacherName={teacherName}
              onOpenSidebar={() => setSidebarOpen(true)}
            />

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
            <div className="grid grid-cols-3 gap-2.5 md:gap-4">
              <StatsCard
                type="total"
                label="Total Quizzes"
                value={quizzes.length}
              />

              <StatsCard
                type="published"
                label="Published"
                value={publishedQuizzes.length}
              />

              <StatsCard
                type="draft"
                label="Drafts"
                value={draftQuizzes.length}
              />
            </div>
          </div>

          <div className="mt-7 md:mt-8">
            {isLoading ? (
              <Card className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl md:p-12">
                <div className="flex items-center justify-center gap-3 text-slate-300">
                  <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
                  Loading quizzes...
                </div>
              </Card>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4 h-auto w-full rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl md:mb-5 md:w-auto">
                  <TabsTrigger
                    value="all"
                    className="flex-1 cursor-pointer whitespace-nowrap rounded-xl px-3 py-2 text-xs sm:text-sm"
                  >
                    All Quizzes
                  </TabsTrigger>

                  <TabsTrigger
                    value="published"
                    className="flex-1 cursor-pointer whitespace-nowrap rounded-xl px-3 py-2 text-xs sm:text-sm"
                  >
                    Published
                  </TabsTrigger>

                  <TabsTrigger
                    value="drafts"
                    className="flex-1 cursor-pointer whitespace-nowrap rounded-xl px-3 py-2 text-xs sm:text-sm"
                  >
                    Drafts
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <QuizList items={quizzes} onDeleteQuiz={handleDeleteQuiz} />
                </TabsContent>

                <TabsContent value="published">
                  <QuizList
                    items={publishedQuizzes}
                    onDeleteQuiz={handleDeleteQuiz}
                  />
                </TabsContent>

                <TabsContent value="drafts">
                  <QuizList
                    items={draftQuizzes}
                    onDeleteQuiz={handleDeleteQuiz}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </PageShell>
  );
}