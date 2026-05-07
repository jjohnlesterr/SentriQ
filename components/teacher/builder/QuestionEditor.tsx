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
    <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-white md:text-xl">
          Question {activeQuestion + 1}
        </h3>

        <Button
          type="button"
          onClick={() => onRemoveQuestion(activeQuestion)}
          variant="destructive"
          size="sm"
          className="cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Question Type</Label>

          <select
            value={question.type}
            onChange={(e) =>
              onChangeQuestionType(activeQuestion, e.target.value as QuestionType)
            }
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white outline-none transition focus:border-blue-400/50"
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True/False</option>
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
          />
        </div>

        {question.type !== "identification" ? (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <Label>Answer Options</Label>

              {question.type === "multiple_choice" && (
                <Button
                  type="button"
                  onClick={() => onAddOption(activeQuestion)}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
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
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                >
                  <Checkbox
                    checked={question.correctAnswer === optionIndex}
                    onCheckedChange={() =>
                      onUpdateQuestion(activeQuestion, {
                        correctAnswer: optionIndex,
                      })
                    }
                    className="cursor-pointer"
                  />

                  <Input
                    value={option}
                    onChange={(e) =>
                      onUpdateOption(activeQuestion, optionIndex, e.target.value)
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                    disabled={question.type === "true_false"}
                    className="flex-1 bg-transparent"
                  />

                  {question.type === "multiple_choice" &&
                    question.options.length > 2 && (
                      <Button
                        type="button"
                        onClick={() =>
                          onRemoveOption(activeQuestion, optionIndex)
                        }
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer hover:bg-white/10"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    )}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-100">
                Correct answer:{" "}
                <span className="font-semibold text-emerald-300">
                  {question.options[question.correctAnswer] ||
                    "No answer selected"}
                </span>
              </p>
            </div>
          </div>
        ) : (
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
            />

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-100">
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