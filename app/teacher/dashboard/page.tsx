"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import TeacherPageLayout from "@/components/layout/TeacherPageLayout";
import PageLoader from "@/components/shared/PageLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DashboardHeader from "@/components/teacher/dashboard/DashboardHeader";
import StatsCard from "@/components/teacher/dashboard/StatsCard";
import QuizList from "@/components/teacher/dashboard/QuizList";
import CreateQuizDialog from "@/components/teacher/dashboard/CreateQuizDialog";

import { useCreateQuizDialog } from "@/hooks/teacher/useCreateQuizDialog";
import { useTeacherQuizzes } from "@/hooks/useTeacherQuizzes";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const teacher = useTeacherQuizzes();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const createDialog = useCreateQuizDialog(teacher.createNewQuiz);

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      createDialog.setOpen(true);
    }
  }, [searchParams, createDialog]);

  function handleDialogOpenChange(open: boolean) {
    createDialog.setOpen(open);

    if (!open && searchParams.get("create") === "true") {
      router.replace("/teacher/dashboard");
    }
  }

  return (
    <TeacherPageLayout
      teacherName={teacher.teacherName}
      quizzes={teacher.quizzes}
      activePage="dashboard"
      sidebarOpen={sidebarOpen}
      onCloseSidebar={() => setSidebarOpen(false)}
      onLogout={teacher.handleLogout}
      onNewQuiz={() => {
        createDialog.setOpen(true);
        setSidebarOpen(false);
      }}
    >
      <div className="min-h-screen">
        <main className="min-w-0 px-4 py-5 sm:px-6 md:px-10 lg:px-8 xl:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <DashboardHeader
              teacherName={teacher.teacherName}
              onOpenSidebar={() => setSidebarOpen(true)}
            />

            <div className="w-full md:mt-[3.25rem] md:w-auto">
              <CreateQuizDialog
                open={createDialog.open}
                onOpenChange={handleDialogOpenChange}
                title={createDialog.title}
                description={createDialog.description}
                isCreating={createDialog.isCreating}
                onTitleChange={createDialog.setTitle}
                onDescriptionChange={createDialog.setDescription}
                onCreate={createDialog.handleCreateQuiz}
              />
            </div>
          </div>

          <div className="mt-7 md:mt-8">
            <div className="grid grid-cols-3 gap-2.5 md:gap-4">
              <StatsCard
                type="total"
                label="Total Quizzes"
                value={teacher.quizzes.length}
              />

              <StatsCard
                type="published"
                label="Published"
                value={teacher.publishedQuizzes.length}
              />

              <StatsCard
                type="draft"
                label="Drafts"
                value={teacher.draftQuizzes.length}
              />
            </div>
          </div>

          <div className="mt-7 md:mt-8">
            {teacher.isLoading ? (
              <PageLoader label="Loading quizzes..." variant="card" />
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
                  <QuizList
                    items={teacher.quizzes}
                    onDeleteQuiz={teacher.handleDeleteQuiz}
                  />
                </TabsContent>

                <TabsContent value="published">
                  <QuizList
                    items={teacher.publishedQuizzes}
                    onDeleteQuiz={teacher.handleDeleteQuiz}
                  />
                </TabsContent>

                <TabsContent value="drafts">
                  <QuizList
                    items={teacher.draftQuizzes}
                    onDeleteQuiz={teacher.handleDeleteQuiz}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </TeacherPageLayout>
  );
}
