import EmptyQuestionState from "@/components/teacher/builder/EmptyQuestionState";
import QuestionEditor from "@/components/teacher/builder/QuestionEditor";
import type { useQuizBuilder } from "@/hooks/teacher/builder/useQuizBuilder";

type BuilderState = ReturnType<typeof useQuizBuilder>;

type Props = {
  builder: BuilderState;
  onOpenQuestionSelector: () => void;
};

export default function BuilderEditorContent({
  builder,
  onOpenQuestionSelector,
}: Props) {
  const currentQuestion = builder.questions[builder.activeQuestion];

  if (!currentQuestion) {
    return <EmptyQuestionState onAddQuestion={builder.addQuestion} />;
  }

  return (
    <QuestionEditor
      question={currentQuestion}
      questions={builder.questions}
      activeQuestion={builder.activeQuestion}
      quizTitle={builder.title}
      onSelectQuestion={builder.setActiveQuestion}
      onOpenQuestionSelector={onOpenQuestionSelector}
      onRemoveQuestion={builder.removeQuestion}
      onUpdateQuestion={builder.updateQuestion}
      onChangeQuestionType={builder.handleChangeQuestionType}
      onUpdateOption={builder.updateOption}
      onAddOption={builder.addOption}
      onRemoveOption={builder.removeOption}
      onMoveOptionUp={builder.moveOptionUp}
      onMoveOptionDown={builder.moveOptionDown}
      onDuplicateOption={builder.duplicateOption}
      onAddQuestionDirect={builder.addQuestion}
    />
  );
}