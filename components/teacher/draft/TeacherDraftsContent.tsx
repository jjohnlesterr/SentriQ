"use client";

import { useState } from "react";
import { History } from "lucide-react";

import TeacherPageLayout from "@/components/layout/TeacherPageLayout";
import PageLoader from "@/components/shared/PageLoader";
import DraftHeader from "@/components/teacher/draft/DraftHeader";
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

          <section className="mt-7 md:mt-8">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-200">
                <History className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">Draft History</h2>
                <p className="text-sm text-slate-400">
                  Search and continue editing your unpublished quizzes.
                </p>
              </div>
            </div>

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