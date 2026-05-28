"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import OptionRow from "@/components/teacher/builder/shared/OptionRow";
import QuestionField from "@/components/teacher/builder/shared/QuestionField";
import type { Question } from "@/lib/shared/types";

type Props = {
  question: Question;
  activeQuestion: number;
  onUpdateQuestion: (index: number, updates: Partial<Question>) => void;
  onUpdateOption: (questionIndex: number, optionIndex: number, value: string) => void;
  onAddOption: (questionIndex: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  onMoveOptionUp: (questionIndex: number, optionIndex: number) => void;
  onMoveOptionDown: (questionIndex: number, optionIndex: number) => void;
  onDuplicateOption: (questionIndex: number, optionIndex: number) => void;
};

export default function TrueFalseEditor({
  question,
  activeQuestion,
  onUpdateQuestion,
  onUpdateOption,
  onRemoveOption,
  onMoveOptionUp,
  onMoveOptionDown,
  onDuplicateOption,
}: Props) {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  return (
    <div className="mt-7">
      <QuestionField
        label="Answer Options"
        helper="Select True or False as the correct answer."
        rightText={`${question.options.length}/2`}
      >
        <div className="grid gap-3">
          {question.options.map((option, optionIndex) => (
            <OptionRow
              key={optionIndex}
              option={option}
              optionIndex={optionIndex}
              isCorrect={question.correctAnswer === optionIndex}
              disabled
              canDelete={false}
              canDuplicate={false}
              isMenuOpen={openMenuIndex === optionIndex}
              disableMoveUp={optionIndex === 0}
              disableMoveDown={optionIndex === question.options.length - 1}
              onToggleMenu={() =>
                setOpenMenuIndex((current) =>
                  current === optionIndex ? null : optionIndex
                )
              }
              onSelectCorrect={() =>
                onUpdateQuestion(activeQuestion, { correctAnswer: optionIndex })
              }
              onChange={(value) =>
                onUpdateOption(activeQuestion, optionIndex, value)
              }
              onMoveUp={() => {
                onMoveOptionUp(activeQuestion, optionIndex);
                setOpenMenuIndex(null);
              }}
              onMoveDown={() => {
                onMoveOptionDown(activeQuestion, optionIndex);
                setOpenMenuIndex(null);
              }}
              onDuplicate={() => {
                onDuplicateOption(activeQuestion, optionIndex);
                setOpenMenuIndex(null);
              }}
              onDelete={() => {
                onRemoveOption(activeQuestion, optionIndex);
                setOpenMenuIndex(null);
              }}
            />
          ))}
        </div>
      </QuestionField>

      <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-200">
              Correct Answer
            </p>

            <p className="mt-1 break-words text-sm text-emerald-100/70">
              {question.options[question.correctAnswer] || "No answer selected yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}