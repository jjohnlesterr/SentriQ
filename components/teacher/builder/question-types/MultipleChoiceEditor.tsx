"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Plus } from "lucide-react";

import OptionRow from "@/components/teacher/builder/shared/OptionRow";
import QuestionField from "@/components/teacher/builder/shared/QuestionField";
import { Button } from "@/components/ui/button";

import type { Question } from "@/lib/shared/types";
import { VALIDATION_LIMITS } from "@/lib/validations/constants";

type Props = {
  question: Question;
  activeQuestion: number;
  onUpdateQuestion: (index: number, updates: Partial<Question>) => void;
  onUpdateOption: (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => void;
  onAddOption: (questionIndex: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  onMoveOptionUp: (questionIndex: number, optionIndex: number) => void;
  onMoveOptionDown: (questionIndex: number, optionIndex: number) => void;
  onDuplicateOption: (questionIndex: number, optionIndex: number) => void;
};

const OPTION_COUNT_WARNING_AT = 40;

function sanitizeInput(value: string) {
  return value.replace(/^\s+/, "");
}

function isDefaultOption(option: string, index: number) {
  return option.trim().toLowerCase() === `option ${index + 1}`;
}

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
  const [touchedOptions, setTouchedOptions] = useState<Record<number, boolean>>(
    {},
  );

useEffect(() => {
  const id = requestAnimationFrame(() => {
    setTouchedOptions({});
    setOpenMenuIndex(null);
  });

  return () => cancelAnimationFrame(id);
}, [question.id]);

  const hasDuplicateOptions = useMemo(() => {
    const meaningfulOptions = question.options
      .map((option, index) => ({
        value: option.trim().toLowerCase(),
        isDefault: isDefaultOption(option, index),
      }))
      .filter((option) => option.value.length > 0 && !option.isDefault)
      .map((option) => option.value);

    return new Set(meaningfulOptions).size !== meaningfulOptions.length;
  }, [question.options]);

  return (
    <div className="mt-7">
      <QuestionField
        label="Answer Options"
        helper="Select the checkbox beside the correct answer."
        rightText={`${question.options.length}/10`}
      >
        <div className="grid gap-3">
          {question.options.map((option, optionIndex) => {
            const isTouched = touchedOptions[optionIndex];
            const showEmptyWarning = isTouched && !option.trim();
            const showCharacterCount = option.length >= OPTION_COUNT_WARNING_AT;

            return (
              <div key={optionIndex} className="space-y-1">
                <OptionRow
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
                      current === optionIndex ? null : optionIndex,
                    )
                  }
                  onSelectCorrect={() =>
                    onUpdateQuestion(activeQuestion, {
                      correctAnswer: optionIndex,
                    })
                  }
                  onChange={(value) => {
                    setTouchedOptions((current) => ({
                      ...current,
                      [optionIndex]: true,
                    }));

                    onUpdateOption(
                      activeQuestion,
                      optionIndex,
                      sanitizeInput(value).slice(
                        0,
                        VALIDATION_LIMITS.OPTION_MAX,
                      ),
                    );
                  }}
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

                    setTouchedOptions((current) => ({
                      ...current,
                      [question.options.length]: true,
                    }));

                    setOpenMenuIndex(null);
                  }}
                  onDelete={() => {
                    onRemoveOption(activeQuestion, optionIndex);
                    setOpenMenuIndex(null);
                  }}
                />

                {(showCharacterCount || showEmptyWarning) && (
                  <div className="flex items-center justify-between px-2">
                    {showCharacterCount ? (
                      <span className="text-xs text-slate-500">
                        {option.length}/{VALIDATION_LIMITS.OPTION_MAX}
                      </span>
                    ) : (
                      <span />
                    )}

                    {showEmptyWarning && (
                      <span className="text-xs text-red-400">
                        Option cannot be empty.
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </QuestionField>

      {hasDuplicateOptions && (
        <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />

            <div>
              <p className="text-sm font-semibold text-red-200">
                Duplicate Answers Detected
              </p>

              <p className="mt-1 text-sm text-red-100/70">
                Multiple choice answers must be unique.
              </p>
            </div>
          </div>
        </div>
      )}

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
