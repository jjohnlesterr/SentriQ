"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import BuilderHeader from "@/components/teacher/builder/BuilderHeader";
import QuizBuilderSidebar from "@/components/teacher/builder/QuizBuilderSidebar";
import QuizDetailsForm from "@/components/teacher/builder/QuizDetailsForm";
import QuestionSidebar from "@/components/teacher/builder/QuestionSidebar";
import QuestionEditor from "@/components/teacher/builder/QuestionEditor";
import EmptyQuestionState from "@/components/teacher/builder/EmptyQuestionState";
import PublishCodeDialog from "@/components/teacher/builder/PublishCodeDialog";
import CreateQuizDialog from "@/components/teacher/dashboard/CreateQuizDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createQuiz } from "@/lib/actions";
import { useQuizBuilder } from "@/hooks/useQuizBuilder";

export default function QuizBuilderPage() {
  const router = useRouter();
  const builder = useQuizBuilder();

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questionPanelOpen, setQuestionPanelOpen] = useState(false);

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
  }, [router]);

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
        teacherId,
      );

      setNewQuizTitle("");
      setNewQuizDescription("");
      setDialogOpen(false);
      setSidebarOpen(false);

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

  function goDashboard() {
    router.push("/teacher/dashboard");
  }

  function goDrafts() {
    router.push("/teacher/drafts");
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

    setDialogOpen(true);
    setSidebarOpen(false);
  }

  if (builder.isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-200 backdrop-blur-md">
            <Loader2 className="h-5 w-5 animate-spin text-blue-300" />
            Loading quiz...
          </div>
        </div>
      </PageShell>
    );
  }

  const editorContent =
    builder.questions.length > 0 && builder.currentQuestion ? (
      <QuestionEditor
        question={builder.currentQuestion}
        questions={builder.questions}
        activeQuestion={builder.activeQuestion}
        onSelectQuestion={builder.setActiveQuestion}
        onOpenQuestionSelector={() => setQuestionPanelOpen(true)}
        onRemoveQuestion={builder.removeQuestion}
        onUpdateQuestion={builder.updateQuestion}
        onChangeQuestionType={builder.handleChangeQuestionType}
        onUpdateOption={builder.updateOption}
        onAddOption={builder.addOption}
        onRemoveOption={builder.removeOption}
        onMoveOptionUp={builder.moveOptionUp}
        onMoveOptionDown={builder.moveOptionDown}
        onDuplicateOption={builder.duplicateOption}
      />
    ) : (
      <EmptyQuestionState onAddQuestion={builder.addQuestion} />
    );

  return (
    <PageShell>
      <QuizBuilderSidebar
        teacherName={teacherName}
        onLogout={handleLogout}
        onDashboard={goDashboard}
        onDrafts={goDrafts}
        onNewQuiz={openNewQuiz}
      />

      {sidebarOpen && (
        <QuizBuilderSidebar
          teacherName={teacherName}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
          onDashboard={goDashboard}
          onDrafts={goDrafts}
          onNewQuiz={openNewQuiz}
        />
      )}

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

          {/* MOBILE */}
          <div className="mt-5 lg:hidden">
            <Tabs defaultValue="questions" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl">
                <TabsTrigger
                  value="details"
                  className="rounded-xl px-3 py-2.5 text-xs sm:text-sm"
                >
                  Details
                </TabsTrigger>

                <TabsTrigger
                  value="questions"
                  className="rounded-xl px-3 py-2.5 text-xs sm:text-sm"
                >
                  Questions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4">
                <QuizDetailsForm
                  title={builder.title}
                  description={builder.description}
                  onTitleChange={builder.setTitle}
                  onDescriptionChange={builder.setDescription}
                />
              </TabsContent>

              <TabsContent value="questions" className="mt-4">
                {editorContent}
              </TabsContent>
            </Tabs>
          </div>

          {/* DESKTOP */}
          <div className="mt-5 hidden gap-5 lg:grid lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
            <aside className="min-w-0">
              <div className="sticky top-4 space-y-4">
                <Tabs defaultValue="questions" className="w-full">
                  <TabsList className="grid h-auto w-full grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl">
                    <TabsTrigger
                      value="details"
                      className="rounded-xl px-3 py-2.5 text-xs sm:text-sm"
                    >
                      Details
                    </TabsTrigger>

                    <TabsTrigger
                      value="questions"
                      className="rounded-xl px-3 py-2.5 text-xs sm:text-sm"
                    >
                      Questions
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-4">
                    <QuizDetailsForm
                      title={builder.title}
                      description={builder.description}
                      onTitleChange={builder.setTitle}
                      onDescriptionChange={builder.setDescription}
                    />
                  </TabsContent>

                  <TabsContent value="questions" className="mt-4">
                    <QuestionSidebar
                      questions={builder.questions}
                      activeQuestion={builder.activeQuestion}
                      canAddQuestion={builder.canAddQuestion}
                      mobileOpen={questionPanelOpen}
                      onMobileOpenChange={setQuestionPanelOpen}
                      onSelectQuestion={builder.setActiveQuestion}
                      onAddQuestion={builder.addQuestion}
                      onMoveQuestionUp={builder.moveQuestionUp}
                      onMoveQuestionDown={builder.moveQuestionDown}
                      onDuplicateQuestion={builder.duplicateQuestion}
                      onRemoveQuestion={builder.removeQuestion}
                      onReorderQuestions={builder.reorderQuestions}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </aside>

            <main className="min-w-0">{editorContent}</main>
          </div>
        </div>
      </div>

      {/* Mobile selector only */}
      <QuestionSidebar
        questions={builder.questions}
        activeQuestion={builder.activeQuestion}
        canAddQuestion={builder.canAddQuestion}
        mobileOpen={questionPanelOpen}
        onMobileOpenChange={setQuestionPanelOpen}
        onSelectQuestion={builder.setActiveQuestion}
        onAddQuestion={builder.addQuestion}
        onMoveQuestionUp={builder.moveQuestionUp}
        onMoveQuestionDown={builder.moveQuestionDown}
        onDuplicateQuestion={builder.duplicateQuestion}
        onRemoveQuestion={builder.removeQuestion}
        onReorderQuestions={builder.reorderQuestions}
      />

      <CreateQuizDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={newQuizTitle}
        description={newQuizDescription}
        isCreating={isCreating}
        onTitleChange={setNewQuizTitle}
        onDescriptionChange={setNewQuizDescription}
        onCreate={handleCreateQuiz}
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
