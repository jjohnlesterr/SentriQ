import QuestionField from "@/components/teacher/builder/shared/QuestionField";
import { Input } from "@/components/ui/input";

import type { Question } from "@/lib/shared/types";
import { VALIDATION_LIMITS } from "@/lib/validations/constants";

type Props = {
  question: Question;
  activeQuestion: number;
  onUpdateQuestion: (
    index: number,
    updates: Partial<Question>,
  ) => void;
};

function sanitizeInput(value: string) {
  return value.replace(/^\s+/, "");
}

export default function IdentificationEditor({
  question,
  activeQuestion,
  onUpdateQuestion,
}: Props) {
  const value = question.correctTextAnswer || "";

  return (
    <div className="mt-7">
      <QuestionField
        label="Correct Answer"
        rightText={`${value.length}/${VALIDATION_LIMITS.IDENTIFICATION_ANSWER_MAX}`}
      >
        <div className="space-y-2">
          <Input
            value={value}
            maxLength={
              VALIDATION_LIMITS.IDENTIFICATION_ANSWER_MAX
            }
            onChange={(e) =>
              onUpdateQuestion(activeQuestion, {
                correctTextAnswer: sanitizeInput(
                  e.target.value,
                ),
              })
            }
            placeholder="Enter correct answer"
            className="h-12 rounded-2xl border-white/10 bg-slate-950/40 px-4 text-base"
          />

          {!value.trim() && (
            <p className="text-xs text-red-400">
              Correct answer is required.
            </p>
          )}
        </div>
      </QuestionField>
    </div>
  );
}