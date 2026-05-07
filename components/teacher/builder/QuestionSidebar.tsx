import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Question } from "@/lib/types";

type Props = {
  questions: Question[];
  activeQuestion: number;
  onSelectQuestion: (index: number) => void;
  onAddQuestion: () => void;
};

export default function QuestionSidebar({
  questions,
  activeQuestion,
  onSelectQuestion,
  onAddQuestion,
}: Props) {
  return (
    <div className="md:col-span-1">
      <Card className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="mb-4 space-y-2">
          {questions.map((question, index) => (
            <button
              key={question.id}
              type="button"
              onClick={() => onSelectQuestion(index)}
              className={`w-full cursor-pointer rounded-2xl border p-3 text-left transition-all ${
                activeQuestion === index
                  ? "border-blue-400/40 bg-blue-500/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                Q{index + 1} ·{" "}
                {question.type === "multiple_choice"
                  ? "Multiple Choice"
                  : question.type === "true_false"
                  ? "True/False"
                  : "Identification"}
              </p>

              <p className="truncate text-sm text-white">
                {question.text || "Untitled question"}
              </p>
            </button>
          ))}
        </div>

        <Button
          type="button"
          onClick={onAddQuestion}
          className="w-full cursor-pointer bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </Card>
    </div>
  );
}