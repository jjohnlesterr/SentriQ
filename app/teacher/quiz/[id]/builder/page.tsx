"use client";

import { Loader2 } from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import BuilderHeader from "@/components/teacher/builder/BuilderHeader";
import QuizDetailsForm from "@/components/teacher/builder/QuizDetailsForm";
import QuestionSidebar from "@/components/teacher/builder/QuestionSidebar";
import QuestionEditor from "@/components/teacher/builder/QuestionEditor";
import EmptyQuestionState from "@/components/teacher/builder/EmptyQuestionState";
import PublishCodeDialog from "@/components/teacher/builder/PublishCodeDialog";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuizBuilder } from "@/hooks/useQuizBuilder";

export default function QuizBuilderPage() {
  const builder = useQuizBuilder();

  if (builder.isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-slate-200 backdrop-blur-md">
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

      <section className="relative mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-16">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-6 border border-white/10 bg-white/5 backdrop-blur-md">
            <TabsTrigger value="details" className="cursor-pointer">
              Quiz Details
            </TabsTrigger>
            <TabsTrigger value="questions" className="cursor-pointer">
              Questions ({builder.questions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <QuizDetailsForm
              title={builder.title}
              description={builder.description}
              onTitleChange={builder.setTitle}
              onDescriptionChange={builder.setDescription}
            />
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <QuestionSidebar
                questions={builder.questions}
                activeQuestion={builder.activeQuestion}
                onSelectQuestion={builder.setActiveQuestion}
                onAddQuestion={builder.addQuestion}
              />

              <div className="md:col-span-2">
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