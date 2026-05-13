import QuizDetailsForm from "@/components/teacher/builder/QuizDetailsForm";
import QuestionSidebar from "@/components/teacher/builder/QuestionSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { useQuizBuilder } from "@/hooks/builder/useQuizBuilder";

type BuilderState = ReturnType<typeof useQuizBuilder>;

type Props = {
  builder: BuilderState;
  children: React.ReactNode;
};

export default function BuilderDesktopLayout({ builder, children }: Props) {
  return (
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

      <main className="min-w-0">{children}</main>
    </div>
  );
}