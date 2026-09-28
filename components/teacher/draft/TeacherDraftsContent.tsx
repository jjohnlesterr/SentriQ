"use client";

import { useState } from "react";

import TeacherPageLayout from "@/components/layout/TeacherPageLayout";
import PageLoader from "@/components/shared/PageLoader";
import TeacherPageHeader from "@/components/layout/TeacherPageHeader";
import QuizList from "@/components/teacher/dashboard/QuizList";
import CreateQuizDialog from "@/components/teacher/dashboard/CreateQuizDialog";
import { useCreateQuizDialog } from "@/hooks/teacher/useCreateQuizDialog";
import { useTeacherQuizzes } from "@/hooks/teacher/useTeacherQuizzes";

export default function TeacherDraftsContent() {
  const teacher = useTeacherQuizzes();
  const createDialog = useCreateQuizDialog(teacher.createNewQuiz);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <TeacherPageLayout
      teacherName={teacher.teacherName}
      quizzes={teacher.quizzes}
      activePage="drafts"
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
            title="Drafts"
            description="Unpublished quizzes you can keep editing."
            onOpenSidebar={() => setSidebarOpen(true)}
            actions={
              <CreateQuizDialog
                open={createDialog.open}
                onOpenChange={createDialog.setOpen}
                title={createDialog.title}
                description={createDialog.description}
                isCreating={createDialog.isCreating}
                onTitleChange={createDialog.setTitle}
                onDescriptionChange={createDialog.setDescription}
                onCreate={createDialog.handleCreateQuiz}
              />
            }
          />

          <section className="mt-8">
            {teacher.isLoading ? (
              <PageLoader label="Loading drafts..." variant="card" />
            ) : (
              <QuizList
                items={teacher.draftQuizzes}
                onDeleteQuiz={teacher.handleDeleteQuiz}
              />
            )}
          </section>
        </main>
      </div>
    </TeacherPageLayout>
  );
}