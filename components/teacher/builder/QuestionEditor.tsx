"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Copy,
  ListChecks,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [optionMenuIndex, setOptionMenuIndex] = useState<number | null>(null);

  return (
    <section className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-6 lg:p-7">
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
        <div className="space-y-2">
          <Label>Question Type</Label>

          <select
            value={question.type}
            onChange={(e) =>
              onChangeQuestionType(
                activeQuestion,
                e.target.value as QuestionType
              )
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
        </div>

        <div className="min-w-0 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label>Question Text</Label>

            <span className="shrink-0 text-xs text-slate-500">
              {question.text.length}/500
            </span>
          </div>

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
        </div>
      </div>

      {question.type !== "identification" ? (
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <Label>Answer Options</Label>
              <p className="mt-1 text-xs text-slate-500">
                Select the checkbox beside the correct answer.
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
              {question.options.length}/10
            </span>
          </div>

          <div className="grid gap-3">
            {question.options.map((option, optionIndex) => {
              const isCorrect = question.correctAnswer === optionIndex;

              return (
                <div
                  key={optionIndex}
                  className={`relative flex min-w-0 items-center gap-3 rounded-2xl border p-3 transition ${
                    isCorrect
                      ? "border-emerald-400/30 bg-emerald-500/10"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <Checkbox
                    checked={isCorrect}
                    onCheckedChange={() =>
                      onUpdateQuestion(activeQuestion, {
                        correctAnswer: optionIndex,
                      })
                    }
                    className="shrink-0 cursor-pointer"
                  />

                  <Input
                    value={option}
                    onChange={(e) =>
                      onUpdateOption(
                        activeQuestion,
                        optionIndex,
                        e.target.value
                      )
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                    disabled={question.type === "true_false"}
                    className="h-11 min-w-0 flex-1 rounded-xl border-white/10 bg-slate-950/40 px-3 text-sm"
                  />

                  <div className="relative">
                    <button
                      type="button"
                      aria-label={`Open option ${optionIndex + 1} menu`}
                      onClick={() =>
                        setOptionMenuIndex((current) =>
                          current === optionIndex ? null : optionIndex
                        )
                      }
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>

                    {optionMenuIndex === optionIndex && (
                      <div className="absolute right-0 top-11 z-30 w-44 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-1 shadow-2xl backdrop-blur-xl">
                        <button
                          type="button"
                          disabled={optionIndex === 0}
                          onClick={() => {
                            onMoveOptionUp(activeQuestion, optionIndex);
                            setOptionMenuIndex(null);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ArrowUp className="h-4 w-4" />
                          Move Up
                        </button>

                        <button
                          type="button"
                          disabled={optionIndex === question.options.length - 1}
                          onClick={() => {
                            onMoveOptionDown(activeQuestion, optionIndex);
                            setOptionMenuIndex(null);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ArrowDown className="h-4 w-4" />
                          Move Down
                        </button>

                        <button
                          type="button"
                          disabled={question.options.length >= 10}
                          onClick={() => {
                            onDuplicateOption(activeQuestion, optionIndex);
                            setOptionMenuIndex(null);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Copy className="h-4 w-4" />
                          Duplicate
                        </button>

                        <div className="my-1 h-px bg-white/10" />

                        <button
                          type="button"
                          disabled={
                            question.type !== "multiple_choice" ||
                            question.options.length <= 2
                          }
                          onClick={() => {
                            onRemoveOption(activeQuestion, optionIndex);
                            setOptionMenuIndex(null);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {question.type === "multiple_choice" && (
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
          )}

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
      ) : (
        <div className="mt-7 space-y-4">
          <div className="space-y-2">
            <Label>Correct Answer</Label>

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
          </div>
        </div>
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
    </section>
  );
}