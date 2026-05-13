"use client";

import { useState } from "react";
import { ChevronDown, ListChecks, Plus, Trash2 } from "lucide-react";

import IdentificationEditor from "@/components/teacher/builder/question-types/IdentificationEditor";
import MultipleChoiceEditor from "@/components/teacher/builder/question-types/MultipleChoiceEditor";
import TrueFalseEditor from "@/components/teacher/builder/question-types/TrueFalseEditor";
import QuestionField from "@/components/teacher/builder/shared/QuestionField";
import QuestionSection from "@/components/teacher/builder/shared/QuestionSection";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import type { Question, QuestionType } from "@/lib/types";

type Props = {
  question: Question;
  questions: Question[];
  activeQuestion: number;
  onSelectQuestion: (index: number) => void;
  onOpenQuestionSelector?: () => void;
  onRemoveQuestion: (index: number) => void;
  onUpdateQuestion: (index: number, updates: Partial<Question>) => void;
  onChangeQuestionType: (index: number, type: QuestionType) => void;
  onUpdateOption: (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => void;
  onAddOption: (questionIndex: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  onMoveOptionUp: (questionIndex: number, optionIndex: number) => void;
  onMoveOptionDown: (questionIndex: number, optionIndex: number) => void;
  onDuplicateOption: (questionIndex: number, optionIndex: number) => void;
};

function getQuestionLabel(question: Question) {
  if (question.type === "multiple_choice") return "Multiple Choice";
  if (question.type === "true_false") return "True/False";
  return "Identification";
}

export default function QuestionEditor({
  question,
  questions,
  activeQuestion,
  onSelectQuestion,
  onOpenQuestionSelector,
  onRemoveQuestion,
  onUpdateQuestion,
  onChangeQuestionType,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onMoveOptionUp,
  onMoveOptionDown,
  onDuplicateOption,
}: Props) {
  const [questionMenuOpen, setQuestionMenuOpen] = useState(false);

  const optionEditorProps = {
    question,
    activeQuestion,
    onUpdateQuestion,
    onUpdateOption,
    onAddOption,
    onRemoveOption,
    onMoveOptionUp,
    onMoveOptionDown,
    onDuplicateOption,
  };

  return (
    <QuestionSection>
      <div className="mb-6 border-b border-white/10 pb-5">
        <div className="mb-4 flex items-center gap-2 lg:hidden">
          {onOpenQuestionSelector && (
            <Button
              type="button"
              variant="ghost"
              onClick={onOpenQuestionSelector}
              aria-label="Open question settings"
              className="h-12 w-12 shrink-0 rounded-2xl border border-white/10 bg-white/5 p-0 text-cyan-300 hover:bg-white/10"
            >
              <ListChecks className="h-5 w-5" />
            </Button>
          )}

          <div className="relative flex-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setQuestionMenuOpen((prev) => !prev)}
              className="h-12 w-full justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 text-white hover:bg-white/10"
            >
              Question {activeQuestion + 1}
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </Button>

            {questionMenuOpen && (
              <div className="absolute right-0 top-14 z-40 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-1 shadow-2xl backdrop-blur-xl">
                {questions.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectQuestion(index);
                      setQuestionMenuOpen(false);
                    }}
                    className={
                      activeQuestion === index
                        ? "flex w-full items-center justify-between rounded-xl bg-cyan-500/10 px-3 py-2 text-left text-sm text-cyan-200"
                        : "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                    }
                  >
                    <span>Question {index + 1}</span>
                    <span className="text-xs text-slate-500">
                      {getQuestionLabel(item)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300 sm:block">
              Selected Question
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">
              Question {activeQuestion + 1}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {getQuestionLabel(question)}
            </p>
          </div>

          <Button
            type="button"
            onClick={() => onRemoveQuestion(activeQuestion)}
            variant="ghost"
            size="sm"
            aria-label="Delete current question"
            className="h-11 w-11 cursor-pointer rounded-2xl border border-red-400/20 bg-red-500/10 p-0 text-red-300 hover:bg-red-500/20 hover:text-red-200"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        <QuestionField label="Question Type">
          <select
            value={question.type}
            onChange={(e) =>
              onChangeQuestionType(activeQuestion, e.target.value as QuestionType)
            }
            className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
          >
            <option className="bg-slate-950 text-white" value="multiple_choice">
              Multiple Choice
            </option>
            <option className="bg-slate-950 text-white" value="true_false">
              True / False
            </option>
            <option className="bg-slate-950 text-white" value="identification">
              Identification
            </option>
          </select>
        </QuestionField>

        <QuestionField
          label="Question Text"
          rightText={`${question.text.length}/500`}
        >
          <Textarea
            value={question.text}
            wrap="soft"
            onChange={(e) =>
              onUpdateQuestion(activeQuestion, {
                text: e.target.value.slice(0, 500),
              })
            }
            placeholder="Enter your question"
            rows={3}
            className="min-h-[112px] w-full resize-none rounded-2xl border-white/10 bg-slate-950/40 px-4 py-3 text-base text-white placeholder:text-slate-600"
          />
        </QuestionField>
      </div>

      {question.type === "multiple_choice" && (
        <MultipleChoiceEditor {...optionEditorProps} />
      )}

      {question.type === "true_false" && (
        <TrueFalseEditor {...optionEditorProps} />
      )}

      {question.type === "identification" && (
        <IdentificationEditor
          question={question}
          activeQuestion={activeQuestion}
          onUpdateQuestion={onUpdateQuestion}
        />
      )}

      <Button
        type="button"
        onClick={() => {
          const trigger = document.querySelector<HTMLButtonElement>(
            "[data-add-question-trigger]"
          );

          trigger?.click();
        }}
        className="mt-5 h-12 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
      >
        <Plus className="h-4 w-4" />
        Add Another Question
      </Button>
    </QuestionSection>
  );
}