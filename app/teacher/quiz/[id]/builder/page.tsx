"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PageShell from "@/components/layout/PageShell";
import TeacherAppSidebar from "@/components/layout/sidebar/TeacherAppSidebar";
import PageLoader from "@/components/shared/PageLoader";
import BuilderHeader from "@/components/teacher/builder/BuilderHeader";
import PublishCodeDialog from "@/components/teacher/builder/PublishCodeDialog";
import CreateQuizDialog from "@/components/teacher/dashboard/CreateQuizDialog";
import BuilderDesktopLayout from "@/components/teacher/builder/layout/BuilderDesktopLayout";
import BuilderEditorContent from "@/components/teacher/builder/layout/BuilderEditorContent";
import BuilderMobileLayout from "@/components/teacher/builder/layout/BuilderMobileLayout";

import { createQuiz } from "@/lib/actions";
import {
  clearTeacherSession,
  getTeacherSession,
} from "@/lib/auth/teacher-session";
import { useQuizBuilder } from "@/hooks/builder/useQuizBuilder";
import { useCreateQuizDialog } from "@/hooks/teacher/useCreateQuizDialog";

export default function QuizBuilderPage() {
  const router = useRouter();
  const builder = useQuizBuilder();

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questionPanelOpen, setQuestionPanelOpen] = useState(false);

  const createDialog = useCreateQuizDialog(async (title, description) => {
    if (!teacherId) {
      alert("Teacher session not found.");
      return;
    }

    const quiz = await createQuiz(title, description, teacherId);

    setSidebarOpen(false);
    router.push(`/teacher/quiz/${quiz.id}/builder`);
  });

  useEffect(() => {
    const session = getTeacherSession();

    if (!session) {
      router.push("/teacher/login");
      return;
    }

    setTeacherId(session.id);
    setTeacherName(session.name);
  }, [router]);

  function handleLogout() {
    clearTeacherSession();
    router.push("/");
  }

  function openNewQuiz() {
    const hasUnsavedChanges =
      builder.title.trim() ||
      builder.description.trim() ||
      builder.questions.length > 0;

    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "Do you want to discard your current quiz progress?",
      );

      if (!confirmed) return;
    }

    createDialog.setOpen(true);
    setSidebarOpen(false);
  }

  if (builder.isLoading) {
    return (
      <PageShell>
        <PageLoader label="Loading quiz builder..." />
      </PageShell>
    );
  }

  const editorContent = (
    <BuilderEditorContent
      builder={builder}
      onOpenQuestionSelector={() => setQuestionPanelOpen(true)}
    />
  );

  return (
    <PageShell>
      <TeacherAppSidebar
        teacherName={teacherName}
        quizzes={builder.quizzes}
        activeQuizId={builder.quiz?.id}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        onNewQuiz={openNewQuiz}
        activePage="quiz-builder"
      />

      <div className="min-h-screen px-4 py-4 sm:px-6 md:px-8 lg:pl-[304px] lg:pr-8 xl:pr-10">
        <div className="mx-auto w-full max-w-7xl">
          <BuilderHeader
            questionCount={builder.questions.length}
            isSaving={builder.isSaving}
            isPublishing={builder.isPublishing}
            isPublished={builder.quiz?.published}
            disablePublish={builder.questions.length === 0}
            onBack={builder.goBack}
            onSave={builder.handleSaveQuiz}
            onPublish={builder.handlePublishQuiz}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          <BuilderMobileLayout
            builder={builder}
            questionPanelOpen={questionPanelOpen}
            onQuestionPanelOpenChange={setQuestionPanelOpen}
          >
            {editorContent}
          </BuilderMobileLayout>

          <BuilderDesktopLayout builder={builder}>
            {editorContent}
          </BuilderDesktopLayout>
        </div>
      </div>

      <CreateQuizDialog
        open={createDialog.open}
        onOpenChange={createDialog.setOpen}
        title={createDialog.title}
        description={createDialog.description}
        isCreating={createDialog.isCreating}
        onTitleChange={createDialog.setTitle}
        onDescriptionChange={createDialog.setDescription}
        onCreate={createDialog.handleCreateQuiz}
        hideTrigger
      />

      <PublishCodeDialog
        open={builder.showCodeDialog}
        code={builder.quiz?.code}
        onOpenChange={builder.setShowCodeDialog}
        onCopyCode={builder.handleCopyCode}
        onGoToMonitor={builder.goToMonitor}
      />
    </PageShell>
  );
}
