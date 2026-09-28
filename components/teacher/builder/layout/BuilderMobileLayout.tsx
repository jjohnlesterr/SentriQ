import QuizDetailsForm from "@/components/teacher/builder/QuizDetailsForm";
import QuestionSidebar from "@/components/teacher/builder/QuestionSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { useQuizBuilder } from "@/hooks/teacher/builder/useQuizBuilder";

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
      <div className="mt-5 xl:hidden">
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2">
            <TabsTrigger
              value="details"
              className="text-xs sm:text-sm"
            >
              Details
            </TabsTrigger>

            <TabsTrigger
              value="questions"
              className="text-xs sm:text-sm"
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
    </>
  );
}
