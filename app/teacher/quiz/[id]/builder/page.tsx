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
        <div className="flex min-h-screen items-center justify-center px-4">
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

      <section className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 md:px-10 md:py-8 lg:px-16">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-5 h-auto w-full rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-md sm:w-auto md:mb-6">
            <TabsTrigger
              value="details"
              className="flex-1 cursor-pointer rounded-xl px-3 py-2 text-xs sm:text-sm"
            >
              Quiz Details
            </TabsTrigger>

            <TabsTrigger
              value="questions"
              className="flex-1 cursor-pointer rounded-xl px-3 py-2 text-xs sm:text-sm"
            >
              Questions ({builder.questions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-5 md:space-y-6">
            <QuizDetailsForm
              title={builder.title}
              description={builder.description}
              onTitleChange={builder.setTitle}
              onDescriptionChange={builder.setDescription}
            />
          </TabsContent>

          <TabsContent value="questions" className="space-y-5 md:space-y-6">
            <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
              <QuestionSidebar
                questions={builder.questions}
                activeQuestion={builder.activeQuestion}
                canAddQuestion={builder.canAddQuestion}
                onSelectQuestion={builder.setActiveQuestion}
                onAddQuestion={builder.addQuestion}
              />

              <div className="lg:col-span-2">
                {builder.questions.length === 0 ? (
                  <EmptyQuestionState onAddQuestion={builder.addQuestion} />
                ) : builder.currentQuestion ? (
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
                ) : null}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

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