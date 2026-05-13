import QuestionField from "@/components/teacher/builder/shared/QuestionField";
import { Input } from "@/components/ui/input";
import type { Question } from "@/lib/types";

type Props = {
  question: Question;
  activeQuestion: number;
  onUpdateQuestion: (index: number, updates: Partial<Question>) => void;
};

export default function IdentificationEditor({
  question,
  activeQuestion,
  onUpdateQuestion,
}: Props) {
  return (
    <div className="mt-7">
      <QuestionField label="Correct Answer">
        <Input
          value={question.correctTextAnswer || ""}
          onChange={(e) =>
            onUpdateQuestion(activeQuestion, {
              correctTextAnswer: e.target.value,
            })
          }
          placeholder="Enter correct answer"
          className="h-12 rounded-2xl border-white/10 bg-slate-950/40 px-4 text-base"
        />
      </QuestionField>
    </div>
  );
}