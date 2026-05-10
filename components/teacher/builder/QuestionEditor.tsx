import { CheckCircle2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { Question, QuestionType } from "@/lib/types";

type Props = {
  question: Question;
  activeQuestion: number;
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
};

export default function QuestionEditor({
  question,
  activeQuestion,
  onRemoveQuestion,
  onUpdateQuestion,
  onChangeQuestionType,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
}: Props) {
  return (
    <Card className="w-full min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="min-w-0 break-words text-xl font-extrabold text-white md:text-2xl">
          Question {activeQuestion + 1}
        </h3>

        <Button
          type="button"
          onClick={() => onRemoveQuestion(activeQuestion)}
          variant="ghost"
          size="sm"
          className="h-10 w-10 shrink-0 cursor-pointer rounded-xl border border-red-400/20 bg-red-500/10 p-0 text-red-300 hover:bg-red-500/20 hover:text-red-200"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="min-w-0 space-y-5">
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
            className="h-11 w-full min-w-0 rounded-xl border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
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
            className="box-border min-h-[92px] w-full min-w-0 max-w-full resize-none overflow-hidden rounded-xl break-all bg-slate-950/40 whitespace-pre-wrap [overflow-wrap:anywhere]"
          />
        </div>

        {question.type !== "identification" ? (
          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <Label>Answer Options</Label>

              <span className="shrink-0 text-xs text-slate-500">
                {question.options.length}/10
              </span>
            </div>

            <div className="space-y-2.5">
              {question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className="flex min-w-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2"
                >
                  <Checkbox
                    checked={question.correctAnswer === optionIndex}
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
                    className="h-10 min-w-0 flex-1 rounded-xl bg-slate-950/40 px-3 text-sm"
                  />

                  {question.type === "multiple_choice" &&
                    question.options.length > 2 && (
                      <Button
                        type="button"
                        onClick={() =>
                          onRemoveOption(activeQuestion, optionIndex)
                        }
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 shrink-0 cursor-pointer rounded-xl border border-red-400/10 bg-red-500/5 p-0 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    )}
                </div>
              ))}
            </div>

            {question.type === "multiple_choice" && (
              <Button
                type="button"
                onClick={() => onAddOption(activeQuestion)}
                disabled={question.options.length >= 10}
                variant="ghost"
                className="mt-3 h-11 w-full cursor-pointer rounded-xl border border-dashed border-violet-400/30 bg-transparent text-violet-300 hover:bg-violet-500/10 hover:text-violet-200 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-black/20 disabled:text-slate-500"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </Button>
            )}

            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-emerald-200">
                    Correct Answer
                  </p>

                  <p className="mt-1 break-all text-sm text-emerald-100/70 [overflow-wrap:anywhere]">
                    {question.options[question.correctAnswer]?.trim()
                      ? question.options[question.correctAnswer]
                      : "No answer selected yet"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => {
                const trigger = document.querySelector<HTMLButtonElement>(
                  "[data-add-question-trigger]"
                );

                trigger?.click();
              }}
              className="mt-5 h-12 w-full cursor-pointer rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
            >
              <Plus className="h-4 w-4" />
              Add Another Question
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Label>Correct Answer</Label>

            <Input
              value={question.correctTextAnswer || ""}
              onChange={(e) =>
                onUpdateQuestion(activeQuestion, {
                  correctTextAnswer: e.target.value,
                })
              }
              placeholder="Enter correct answer"
              className="h-11 min-w-0 rounded-xl bg-slate-950/40"
            />

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-emerald-200">
                    Correct Answer
                  </p>

                  <p className="mt-1 break-all text-sm text-emerald-100/70 [overflow-wrap:anywhere]">
                    {question.correctTextAnswer?.trim() ||
                      "No answer entered yet"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => {
                const trigger = document.querySelector<HTMLButtonElement>(
                  "[data-add-question-trigger]"
                );

                trigger?.click();
              }}
              className="h-12 w-full cursor-pointer rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
            >
              <Plus className="h-4 w-4" />
              Add Another Question
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}