"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import TeacherPageLayout from "@/components/layout/TeacherPageLayout";
import LoginTransitionLoader from "@/components/shared/LoginTransitionLoader";
import DashboardHeader from "@/components/teacher/dashboard/DashboardHeader";
import CreateQuizDialog from "@/components/teacher/dashboard/CreateQuizDialog";
import DashboardStats from "@/components/teacher/dashboard/DashboardStats";
import DashboardQuizTabs from "@/components/teacher/dashboard/DashboardQuizTabs";

import { useCreateQuizDialog } from "@/hooks/teacher/useCreateQuizDialog";
import { useTeacherQuizzes } from "@/hooks/teacher/useTeacherQuizzes";

export default function TeacherDashboardContent() {
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

  /*
   * Habang kinukuha ang teacher profile, quizzes at sessions,
   * SentriQ loader lang muna ang ipapakita.
   */
  if (teacher.isLoading) {
    return <LoginTransitionLoader />;
  }

  return (
    <TeacherPageLayout
      teacherName={teacher.teacherName}
      isAdmin={teacher.isAdmin}
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
        <main className="min-w-0 px-4 py-4 sm:px-6 sm:py-5 md:px-10 lg:px-8 xl:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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

          <div className="mt-5 md:mt-8">
            <DashboardStats
              total={teacher.quizzes.length}
              published={teacher.publishedQuizzes.length}
              drafts={teacher.draftQuizzes.length}
            />
          </div>

          <div className="mt-5 md:mt-8">
            <DashboardQuizTabs
              isLoading={false}
              quizzes={teacher.quizzes}
              publishedQuizzes={teacher.publishedQuizzes}
              draftQuizzes={teacher.draftQuizzes}
              onDeleteQuiz={teacher.handleDeleteQuiz}
            />
          </div>
        </main>
      </div>
    </TeacherPageLayout>
  );
}
