"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DashboardHeader from "@/components/teacher/dashboard/DashboardHeader";
import StatsCard from "@/components/teacher/dashboard/StatsCard";
import QuizList from "@/components/teacher/dashboard/QuizList";
import CreateQuizDialog from "@/components/teacher/dashboard/CreateQuizDialog";

import { createQuiz, getTeacherQuizzes } from "@/lib/actions";
import type { Quiz } from "@/lib/types";

export default function TeacherDashboardPage() {
  const router = useRouter();

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  function handleLogout() {
    sessionStorage.removeItem("teacherId");
    sessionStorage.removeItem("teacherName");
    router.push("/");
  }

  const publishedQuizzes = quizzes.filter((quiz) => quiz.published);
  const draftQuizzes = quizzes.filter((quiz) => !quiz.published);

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:px-10 md:py-8 lg:px-16">
        <DashboardHeader teacherName={teacherName} onLogout={handleLogout} />

        <div className="mb-5 grid grid-cols-2 gap-3 md:mb-6 md:gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <StatsCard type="total" label="Total Quizzes" value={quizzes.length} />

          <StatsCard
            type="published"
            label="Published"
            value={publishedQuizzes.length}
          />

          <StatsCard type="draft" label="Drafts" value={draftQuizzes.length} />

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

        {isLoading ? (
          <Card className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl md:p-12">
            <div className="flex items-center justify-center gap-3 text-slate-300">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
              Loading quizzes...
            </div>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-5 h-auto w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl md:mb-6 md:w-auto">
              <TabsTrigger
                value="all"
                className="flex-1 cursor-pointer whitespace-nowrap rounded-xl px-3 py-2 text-xs sm:text-sm"
              >
                All Quizzes ({quizzes.length})
              </TabsTrigger>

              <TabsTrigger
                value="published"
                className="flex-1 cursor-pointer whitespace-nowrap rounded-xl px-3 py-2 text-xs sm:text-sm"
              >
                Published ({publishedQuizzes.length})
              </TabsTrigger>

              <TabsTrigger
                value="drafts"
                className="flex-1 cursor-pointer whitespace-nowrap rounded-xl px-3 py-2 text-xs sm:text-sm"
              >
                Drafts ({draftQuizzes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <QuizList items={quizzes} />
            </TabsContent>

            <TabsContent value="published">
              <QuizList items={publishedQuizzes} />
            </TabsContent>

            <TabsContent value="drafts">
              <QuizList items={draftQuizzes} />
            </TabsContent>
          </Tabs>
        )}
      </section>
    </PageShell>
  );
}