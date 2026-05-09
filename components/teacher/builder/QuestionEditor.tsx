import { Plus, Trash2 } from "lucide-react";

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
    <Card className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-white md:text-xl">
          Question {activeQuestion + 1}
        </h3>

        <Button
          type="button"
          onClick={() => onRemoveQuestion(activeQuestion)}
          variant="secondary"
          size="sm"
          className="h-10 w-full cursor-pointer border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white sm:w-auto"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="space-y-5">
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
            className="h-11 w-full rounded-xl border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-blue-400/50"
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True / False</option>
            <option value="identification">Identification</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Question Text</Label>

          <Textarea
            value={question.text}
            onChange={(e) =>
              onUpdateQuestion(activeQuestion, {
                text: e.target.value,
              })
            }
            placeholder="Enter your question"
            rows={3}
            className="min-h-[110px]"
          />
        </div>

        {question.type !== "identification" ? (
          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Label>Answer Options</Label>

              {question.type === "multiple_choice" && (
                <Button
                  type="button"
                  onClick={() => onAddOption(activeQuestion)}
                  variant="secondary"
                  size="sm"
                  className="h-10 w-full cursor-pointer border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  <Plus className="h-3 w-3" />
                  Add Option
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3"
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
                    className="h-10 flex-1 bg-transparent text-sm"
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
                        className="h-9 w-9 shrink-0 cursor-pointer p-0 hover:bg-white/10"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    )}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <p className="text-sm leading-6 text-emerald-100">
                Correct answer:{" "}
                <span className="font-semibold text-emerald-300">
                  {question.options[question.correctAnswer] ||
                    "No answer selected"}
                </span>
              </p>
            </div>
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
              className="h-11"
            />

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <p className="text-sm leading-6 text-emerald-100">
                Correct answer:{" "}
                <span className="font-semibold text-emerald-300">
                  {question.correctTextAnswer || "No answer entered"}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}