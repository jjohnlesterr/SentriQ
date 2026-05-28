"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import PageShell from "@/components/layout/PageShell";
import TeacherAppSidebar from "@/components/layout/sidebar/TeacherAppSidebar";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PageLoader from "@/components/shared/PageLoader";
import BuilderHeader from "@/components/teacher/builder/BuilderHeader";
import PublishCodeDialog from "@/components/teacher/builder/PublishCodeDialog";
import QuizTimerDialog from "@/components/teacher/builder/QuizTimerDialog";
import CreateQuizDialog from "@/components/teacher/dashboard/CreateQuizDialog";
import BuilderDesktopLayout from "@/components/teacher/builder/layout/BuilderDesktopLayout";
import BuilderEditorContent from "@/components/teacher/builder/layout/BuilderEditorContent";
import BuilderMobileLayout from "@/components/teacher/builder/layout/BuilderMobileLayout";

import { createQuiz } from "@/lib/actions";
import {
  clearTeacherSession,
  getTeacherSession,
} from "@/lib/auth/teacher-session";
import { useQuizBuilder } from "@/hooks/teacher/builder/useQuizBuilder";
import { useCreateQuizDialog } from "@/hooks/teacher/useCreateQuizDialog";

export default function QuizBuilderPage() {
  const router = useRouter();
  const builder = useQuizBuilder();

  const [timerDialogOpen, setTimerDialogOpen] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questionPanelOpen, setQuestionPanelOpen] = useState(false);

  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [pendingLeaveAction, setPendingLeaveAction] = useState<
    (() => Promise<void> | void) | null
  >(null);

  const createDialog = useCreateQuizDialog(async (title, description) => {
    if (!teacherId) {
      toast.error("Teacher session not found.");
      return;
    }

    const quiz = await createQuiz(title, description, teacherId);

    setSidebarOpen(false);
    router.push(`/teacher/quiz/${quiz.id}/builder`);
  });

  useEffect(() => {
    let mounted = true;

    async function loadTeacherSession() {
      const session = await getTeacherSession();

      if (!mounted) return;

      if (!session) {
        router.push("/teacher/login");
        return;
      }

      setTeacherId(session.user.id);
      setTeacherName(session.user.email ?? "Teacher");
    }

    loadTeacherSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!builder.isDirty) return;

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [builder.isDirty]);

  function requestLeave(action: () => Promise<void> | void) {
    if (!builder.isDirty) {
      action();
      return;
    }

    setPendingLeaveAction(() => action);
    setLeaveDialogOpen(true);
  }

  async function handleSaveAndLeave() {
    if (!pendingLeaveAction) return;

    try {
      const saved = await builder.saveDraftOnly();

      if (!saved) return;

      setLeaveDialogOpen(false);

      const action = pendingLeaveAction;
      setPendingLeaveAction(null);

      await action();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save draft.");
    }
  }

  async function handleDiscardAndLeave() {
    if (!pendingLeaveAction) return;

    setLeaveDialogOpen(false);

    const action = pendingLeaveAction;
    setPendingLeaveAction(null);

    await action();
  }

  function handleNavigateRequest(path: string) {
    requestLeave(() => {
      router.push(path);
    });
  }

  function handleBack() {
    requestLeave(() => {
      router.push("/teacher/dashboard");
    });
  }

  function handleLogout() {
    requestLeave(async () => {
      await clearTeacherSession();
      router.push("/");
      router.refresh();
    });
  }

  function openNewQuiz() {
    requestLeave(() => {
      createDialog.setOpen(true);
      setSidebarOpen(false);
    });
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
        onNavigateRequest={handleNavigateRequest}
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
            timeLimitMinutes={builder.timeLimitMinutes}
            onBack={handleBack}
            onSave={builder.handleSaveQuiz}
            onPublish={builder.handlePublishQuiz}
            onOpenTimer={() => setTimerDialogOpen(true)}
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

      <QuizTimerDialog
        open={timerDialogOpen}
        value={builder.timeLimitMinutes}
        onOpenChange={setTimerDialogOpen}
        onApply={builder.setTimeLimitMinutes}
      />

      <PublishCodeDialog
        open={builder.showCodeDialog}
        code={builder.quiz?.code}
        timeLimitMinutes={builder.timeLimitMinutes}
        onOpenChange={builder.setShowCodeDialog}
        onCopyCode={builder.handleCopyCode}
        onGoToMonitor={builder.goToMonitor}
      />

      <ConfirmDialog
        open={leaveDialogOpen}
        title="Save draft before leaving?"
        description="You have unsaved quiz changes. Save this draft before leaving this page?"
        discardText="Discard & Leave"
        confirmText="Save Draft & Leave"
        showCancel={false}
        showDiscard
        confirmVariant="primary"
        onOpenChange={setLeaveDialogOpen}
        onDiscard={handleDiscardAndLeave}
        onConfirm={handleSaveAndLeave}
      />
    </PageShell>
  );
}