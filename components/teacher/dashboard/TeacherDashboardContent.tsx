"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import TeacherPageLayout from "@/components/layout/TeacherPageLayout";
import LoginTransitionLoader from "@/components/shared/LoginTransitionLoader";
import TeacherPageHeader from "@/components/layout/TeacherPageHeader";
import CreateQuizDialog from "@/components/teacher/dashboard/CreateQuizDialog";
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
        <main className="mx-auto min-w-0 max-w-5xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
          <TeacherPageHeader
            title="Quizzes"
            description={
              <>
                Signed in as{" "}
                <span className="text-slate-300">{teacher.teacherName || "Teacher"}</span>
              </>
            }
            onOpenSidebar={() => setSidebarOpen(true)}
            actions={
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
            }
          />

          <div className="mt-8">
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
