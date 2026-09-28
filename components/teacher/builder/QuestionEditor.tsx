"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  Lightbulb,
  ListChecks,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import AIChatHead from "@/components/ai/AIChatHead";
import IdentificationEditor from "@/components/teacher/builder/question-types/IdentificationEditor";
import MultipleChoiceEditor from "@/components/teacher/builder/question-types/MultipleChoiceEditor";
import TrueFalseEditor from "@/components/teacher/builder/question-types/TrueFalseEditor";
import QuestionField from "@/components/teacher/builder/shared/QuestionField";
import QuestionSection from "@/components/teacher/builder/shared/QuestionSection";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import type { Question, QuestionType } from "@/lib/shared/types";
import { VALIDATION_LIMITS } from "@/lib/validations/constants";

type Props = {
  question: Question;
  questions: Question[];
  activeQuestion: number;
  quizTitle?: string;
  onSelectQuestion: (index: number) => void;
  onOpenQuestionSelector?: () => void;
  onRemoveQuestion: (index: number) => void;
  onUpdateQuestion: (index: number, updates: Partial<Question>) => void;
  onChangeQuestionType: (index: number, type: QuestionType) => void;
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
  onAddQuestionDirect: () => void;
};

const QUESTION_COUNT_WARNING_AT = 160;
const HINT_MAX_LENGTH = 120;

function getQuestionLabel(question: Question) {
  if (question.type === "multiple_choice") return "Multiple Choice";
  if (question.type === "true_false") return "True/False";
  return "Identification";
}

export default function QuestionEditor({
  question,
  questions,
  activeQuestion,
  quizTitle,
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
  onAddQuestionDirect,
}: Props) {
  const [questionMenuOpen, setQuestionMenuOpen] = useState(false);
  const [questionTouched, setQuestionTouched] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [hintDraft, setHintDraft] = useState(question.hint || "");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setQuestionTouched(false);
      setQuestionMenuOpen(false);
      setHintOpen(false);
      setHintDraft(question.hint || "");
    });

    return () => cancelAnimationFrame(id);
  }, [question.id, question.hint]);

  const showQuestionCount = question.text.length >= QUESTION_COUNT_WARNING_AT;
  const showQuestionWarning = questionTouched && !question.text.trim();
  const hasHint = Boolean(question.hint?.trim());

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

  function saveHint() {
    onUpdateQuestion(activeQuestion, {
      hint: hintDraft.trim(),
    });

    setHintOpen(false);
  }

  function clearHint() {
    setHintDraft("");

    onUpdateQuestion(activeQuestion, {
      hint: "",
    });
  }

  function applyWrongAnswers(answers: string[]) {
    const emptyWrongOptionIndexes = question.options
      .map((option, index) => ({ option, index }))
      .filter(
        ({ option, index }) =>
          index !== question.correctAnswer && !option.trim(),
      )
      .map(({ index }) => index);

    answers.slice(0, emptyWrongOptionIndexes.length).forEach((answer, answerIndex) => {
      onUpdateOption(activeQuestion, emptyWrongOptionIndexes[answerIndex], answer);
    });
  }

  return (
    <QuestionSection>
      <div className="relative">
        <div className="mb-6 border-b border-line pb-5">
          <div className="mb-4 flex items-center gap-2 xl:hidden">
            {onOpenQuestionSelector && (
              <Button
                type="button"
                variant="ghost"
                onClick={onOpenQuestionSelector}
                aria-label="Open question settings"
                size="icon"
                className="h-10 w-10 shrink-0"
              >
                <ListChecks className="h-5 w-5" />
              </Button>
            )}

            <div className="relative flex-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setQuestionMenuOpen((prev) => !prev)}
                className="h-10 w-full justify-between px-3.5"
              >
                Question {activeQuestion + 1}
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </Button>

              {questionMenuOpen && (
                <div className="absolute right-0 top-14 z-40 w-full overflow-hidden rounded-xl border border-line bg-surface p-1">
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

              <h2 className="mt-1 text-xl font-semibold tracking-tight text-white md:text-2xl">
                Question {activeQuestion + 1}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {getQuestionLabel(question)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => {
                  setHintDraft(question.hint || "");
                  setHintOpen((current) => !current);
                }}
                variant="ghost"
                size="sm"
                aria-label={hasHint ? "Edit hint" : "Add hint"}
                aria-expanded={hintOpen}
                title={hasHint ? "Edit hint" : "Add hint"}
                className={`h-9 w-9 p-0 ${hasHint ? "border-amber-400/40 text-amber-300" : "text-slate-400"}`}
              >
                <Lightbulb className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                onClick={() => onRemoveQuestion(activeQuestion)}
                variant="ghost"
                size="sm"
                aria-label="Delete current question"
                title="Delete question"
                className="h-9 w-9 p-0 text-slate-400 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {hintOpen && (
          <div className="absolute right-0 top-14 z-[9998] w-[360px] max-w-[calc(100vw-2rem)] rounded-lg border border-line-strong bg-surface-raised p-4 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-300" />
                <p className="text-sm font-medium text-white">Hint</p>
              </div>

              <button
                type="button"
                onClick={() => setHintOpen(false)}
                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                aria-label="Close hint editor"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <Textarea
              value={hintDraft}
              maxLength={HINT_MAX_LENGTH}
              spellCheck={false}
              onChange={(event) =>
                setHintDraft(event.target.value.slice(0, HINT_MAX_LENGTH))
              }
              placeholder="Example: We discussed this during class."
              rows={3}
              className="min-h-[96px] resize-none"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                {hintDraft.length}/{HINT_MAX_LENGTH}
              </p>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={clearHint}
                  className="text-slate-300"
                >
                  Clear
                </Button>

                <Button
                  type="button"
                  onClick={saveHint}
                 
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
          <QuestionField label="Question Type">
            <div className="relative w-full xl:w-[220px]">
              <select
                value={question.type}
                onChange={(e) =>
                  onChangeQuestionType(
                    activeQuestion,
                    e.target.value as QuestionType,
                  )
                }
                className="h-12 w-full appearance-none rounded-xl border border-cyan-400/20 bg-surface px-4 pr-10 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
              >
                <option
                  className="bg-surface text-white"
                  value="multiple_choice"
                >
                  Multiple Choice
                </option>

                <option className="bg-surface text-white" value="true_false">
                  True / False
                </option>

                <option
                  className="bg-surface text-white"
                  value="identification"
                >
                  Identification
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            </div>
          </QuestionField>

          <QuestionField
            label="Question Text"
            rightText={
              showQuestionCount
                ? `${question.text.length}/${VALIDATION_LIMITS.QUESTION_MAX}`
                : undefined
            }
          >
            <div className="space-y-2">
              <Textarea
                value={question.text}
                wrap="soft"
                maxLength={VALIDATION_LIMITS.QUESTION_MAX}
                spellCheck={false}
                onBlur={() => setQuestionTouched(true)}
                onChange={(e) => {
                  setQuestionTouched(true);

                  onUpdateQuestion(activeQuestion, {
                    text: e.target.value.slice(
                      0,
                      VALIDATION_LIMITS.QUESTION_MAX,
                    ),
                  });
                }}
                placeholder="Enter your question"
                rows={3}
                className="min-h-[112px] w-full resize-none rounded-xl border-line bg-surface px-4 py-3 text-base text-white placeholder:text-slate-600"
              />

              {showQuestionWarning && (
                <p className="text-xs text-red-400">
                  Question text is required.
                </p>
              )}
            </div>
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
            if (!question.text.trim()) {
              setQuestionTouched(true);
              return;
            }

            onAddQuestionDirect();
          }}
          className="mt-5 w-full"
        >
          <Plus className="h-4 w-4" />
          Add Another Question
        </Button>

        <AIChatHead
          question={question}
          quizTitle={quizTitle}
          onApplyWrongAnswers={applyWrongAnswers}
        />
      </div>
    </QuestionSection>
  );
}