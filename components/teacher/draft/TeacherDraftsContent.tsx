"use client";

import { useState } from "react";

import TeacherPageLayout from "@/components/layout/TeacherPageLayout";
import PageLoader from "@/components/shared/PageLoader";
import DraftHeader from "@/components/teacher/draft/DraftHeader";
import QuizList from "@/components/teacher/dashboard/quizzes/QuizList";
import CreateQuizDialog from "@/components/teacher/dashboard/create/CreateQuizDialog";
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
        <main className="min-w-0 px-4 py-5 sm:px-6 md:px-10 lg:px-8 xl:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <DraftHeader onOpenSidebar={() => setSidebarOpen(true)} />

            <div className="w-full md:mt-[3.25rem] md:w-auto">
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
            </div>
          </div>

          <div className="mt-7 md:mt-8">
            {teacher.isLoading ? (
              <PageLoader label="Loading drafts..." variant="card" />
            ) : (
              <QuizList
                items={teacher.draftQuizzes}
                onDeleteQuiz={teacher.handleDeleteQuiz}
              />
            )}
          </div>
        </main>
      </div>
    </TeacherPageLayout>
  );
}