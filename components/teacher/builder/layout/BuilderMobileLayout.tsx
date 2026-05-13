import QuizDetailsForm from "@/components/teacher/builder/QuizDetailsForm";
import QuestionSidebar from "@/components/teacher/builder/QuestionSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { useQuizBuilder } from "@/hooks/builder/useQuizBuilder";

type BuilderState = ReturnType<typeof useQuizBuilder>;

type Props = {
  builder: BuilderState;
  questionPanelOpen: boolean;
  onQuestionPanelOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export default function BuilderMobileLayout({
  builder,
  questionPanelOpen,
  onQuestionPanelOpenChange,
  children,
}: Props) {
  return (
    <>
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
            {children}
          </TabsContent>
        </Tabs>
      </div>

      <div className="lg:hidden">
        <QuestionSidebar
          questions={builder.questions}
          activeQuestion={builder.activeQuestion}
          canAddQuestion={builder.canAddQuestion}
          mobileOpen={questionPanelOpen}
          onMobileOpenChange={onQuestionPanelOpenChange}
          onSelectQuestion={builder.setActiveQuestion}
          onAddQuestion={builder.addQuestion}
          onMoveQuestionUp={builder.moveQuestionUp}
          onMoveQuestionDown={builder.moveQuestionDown}
          onDuplicateQuestion={builder.duplicateQuestion}
          onRemoveQuestion={builder.removeQuestion}
          onReorderQuestions={builder.reorderQuestions}
        />
      </div>
    </>
  );
}