"use client";

import { useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";

import OptionRow from "@/components/teacher/builder/shared/OptionRow";
import QuestionField from "@/components/teacher/builder/shared/QuestionField";
import { Button } from "@/components/ui/button";
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

export default function MultipleChoiceEditor({
  question,
  activeQuestion,
  onUpdateQuestion,
  onUpdateOption,
  onAddOption,
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
        helper="Select the checkbox beside the correct answer."
        rightText={`${question.options.length}/10`}
      >
        <div className="grid gap-3">
          {question.options.map((option, optionIndex) => (
            <OptionRow
              key={optionIndex}
              option={option}
              optionIndex={optionIndex}
              isCorrect={question.correctAnswer === optionIndex}
              canDelete={question.options.length > 2}
              canDuplicate={question.options.length < 10}
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

      <Button
        type="button"
        onClick={() => onAddOption(activeQuestion)}
        disabled={question.options.length >= 10}
        variant="ghost"
        className="mt-4 h-11 w-full cursor-pointer rounded-2xl border border-dashed border-violet-400/30 bg-transparent text-violet-300 hover:bg-violet-500/10 hover:text-violet-200 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-black/20 disabled:text-slate-500"
      >
        <Plus className="h-4 w-4" />
        Add Option
      </Button>

      <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-200">
              Correct Answer
            </p>

            <p className="mt-1 break-words text-sm text-emerald-100/70">
              {question.options[question.correctAnswer]?.trim()
                ? question.options[question.correctAnswer]
                : "No answer selected yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}