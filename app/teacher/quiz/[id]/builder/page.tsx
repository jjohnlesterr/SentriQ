"use client";

import { Loader2 } from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import BuilderHeader from "@/components/teacher/builder/BuilderHeader";
import QuizDetailsForm from "@/components/teacher/builder/QuizDetailsForm";
import QuestionSidebar from "@/components/teacher/builder/QuestionSidebar";
import QuestionEditor from "@/components/teacher/builder/QuestionEditor";
import EmptyQuestionState from "@/components/teacher/builder/EmptyQuestionState";
import PublishCodeDialog from "@/components/teacher/builder/PublishCodeDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuizBuilder } from "@/hooks/useQuizBuilder";

export default function QuizBuilderPage() {
  const builder = useQuizBuilder();

  if (builder.isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center overflow-x-hidden px-4">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-200 backdrop-blur-md">
            <Loader2 className="h-5 w-5 animate-spin text-blue-300" />
            Loading quiz...
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="min-h-screen overflow-x-hidden px-4 py-4 sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-6">
          <BuilderHeader
            questionCount={builder.questions.length}
            isSaving={builder.isSaving}
            isPublishing={builder.isPublishing}
            isPublished={builder.quiz?.published}
            disablePublish={builder.questions.length === 0}
            onBack={builder.goBack}
            onSave={builder.handleSaveQuiz}
            onPublish={builder.handlePublishQuiz}
          />

          <div className="mt-5 grid min-w-0 max-w-full gap-5 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
            <div className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl md:p-4">
              <Tabs defaultValue="questions" className="w-full min-w-0">
                <TabsList className="mb-4 h-auto w-full rounded-2xl border border-white/10 bg-slate-950/50 p-1 backdrop-blur-md">
                  <TabsTrigger
                    value="details"
                    className="min-w-0 flex-1 cursor-pointer rounded-xl px-3 py-2.5 text-xs sm:text-sm"
                  >
                    Quiz Details
                  </TabsTrigger>

                  <TabsTrigger
                    value="questions"
                    className="min-w-0 flex-1 cursor-pointer rounded-xl px-3 py-2.5 text-xs sm:text-sm"
                  >
                    Questions ({builder.questions.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <QuizDetailsForm
                    title={builder.title}
                    description={builder.description}
                    onTitleChange={builder.setTitle}
                    onDescriptionChange={builder.setDescription}
                  />
                </TabsContent>

                <TabsContent value="questions">
                  <QuestionSidebar
                    questions={builder.questions}
                    activeQuestion={builder.activeQuestion}
                    canAddQuestion={builder.canAddQuestion}
                    onSelectQuestion={builder.setActiveQuestion}
                    onAddQuestion={builder.addQuestion}
                    onMoveQuestionUp={builder.moveQuestionUp}
                    onMoveQuestionDown={builder.moveQuestionDown}
                    onDuplicateQuestion={builder.duplicateQuestion}
                    onRemoveQuestion={builder.removeQuestion}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="min-w-0 overflow-hidden">
              {builder.questions.length > 0 && builder.currentQuestion ? (
                <QuestionEditor
                  question={builder.currentQuestion}
                  activeQuestion={builder.activeQuestion}
                  onRemoveQuestion={builder.removeQuestion}
                  onUpdateQuestion={builder.updateQuestion}
                  onChangeQuestionType={builder.handleChangeQuestionType}
                  onUpdateOption={builder.updateOption}
                  onAddOption={builder.addOption}
                  onRemoveOption={builder.removeOption}
                />
              ) : (
                <EmptyQuestionState />
              )}
            </div>
          </div>
        </div>
      </div>

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