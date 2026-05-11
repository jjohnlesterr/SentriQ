"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import TeacherAppSidebar from "@/components/layout/sidebar/TeacherAppSidebar";
import { Card } from "@/components/ui/card";
import DraftHeader from "@/components/teacher/draft/DraftHeader";
import QuizList from "@/components/teacher/dashboard/QuizList";
import CreateQuizDialog from "@/components/teacher/dashboard/CreateQuizDialog";
import { useTeacherQuizzes } from "@/hooks/useTeacherQuizzes";

export default function TeacherDraftsPage() {
  const teacher = useTeacherQuizzes();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PageShell>
      <div className="min-h-screen lg:pl-64">
        <TeacherAppSidebar
          teacherName={teacher.teacherName}
          quizzes={teacher.quizzes}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={teacher.handleLogout}
          onNewQuiz={() => {
            teacher.openCreateDialog();
            setSidebarOpen(false);
          }}
          activePage="drafts"
        />

        <main className="min-w-0 px-4 py-5 sm:px-6 md:px-10 lg:px-8 xl:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <DraftHeader onOpenSidebar={() => setSidebarOpen(true)} />

            <div className="w-full md:mt-[3.25rem] md:w-auto">
              <CreateQuizDialog
                open={teacher.dialogOpen}
                onOpenChange={teacher.setDialogOpen}
                title={teacher.newQuizTitle}
                description={teacher.newQuizDescription}
                isCreating={teacher.isCreating}
                onTitleChange={teacher.setNewQuizTitle}
                onDescriptionChange={teacher.setNewQuizDescription}
                onCreate={teacher.handleCreateQuiz}
              />
            </div>
          </div>

          <div className="mt-7 md:mt-8">
            {teacher.isLoading ? (
              <Card className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl md:p-12">
                <div className="flex items-center justify-center gap-3 text-slate-300">
                  <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
                  Loading drafts...
                </div>
              </Card>
            ) : (
              <QuizList
                items={teacher.draftQuizzes}
                onDeleteQuiz={teacher.handleDeleteQuiz}
              />
            )}
          </div>
        </main>
      </div>
    </PageShell>
  );
}