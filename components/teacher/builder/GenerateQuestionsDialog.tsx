"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import FormMessage from "@/components/shared/FormMessage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AI_QUESTION_TYPES, GENERATION_LIMITS, type AIQuestionType } from "@/lib/ai/quiz-generation";
import { generateQuizQuestions } from "@/lib/actions/ai.actions";
import type { Question } from "@/lib/shared/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizTitle: string;
  existingQuestions: Question[];
  onInsert: (questions: Question[]) => void;
};

const TYPE_LABELS: Record<AIQuestionType, string> = {
  multiple_choice: "Multiple choice",
  true_false: "True / False",
  identification: "Identification",
};

export default function GenerateQuestionsDialog({
  open,
  onOpenChange,
  quizTitle,
  existingQuestions,
  onInsert,
}: Props) {
  const [topic, setTopic] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [count, setCount] = useState(5);
  const [types, setTypes] = useState<AIQuestionType[]>(["multiple_choice"]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Pre-fill the topic from the quiz title each time the dialog opens.
  useEffect(() => {
    if (!open) return;

    const id = requestAnimationFrame(() => {
      setTopic((current) => current || quizTitle.trim());
      setError("");
    });

    return () => cancelAnimationFrame(id);
  }, [open, quizTitle]);

  function toggleType(type: AIQuestionType, checked: boolean) {
    setTypes((current) =>
      checked ? [...new Set([...current, type])] : current.filter((item) => item !== type),
    );
  }

  function handleGenerate(event: React.FormEvent) {
    event.preventDefault();
    if (isPending) return;

    if (topic.trim().length < GENERATION_LIMITS.TOPIC_MIN && sourceText.trim().length < GENERATION_LIMITS.SOURCE_MIN) {
      setError("Enter a topic or paste some source material to generate from.");
      return;
    }

    if (types.length === 0) {
      setError("Choose at least one question type.");
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        const result = await generateQuizQuestions({
          topic: topic.trim(),
          sourceText: sourceText.trim(),
          count,
          types,
          avoid: existingQuestions
            .map((question) => question.text.trim())
            .filter(Boolean)
            .slice(0, GENERATION_LIMITS.AVOID_MAX),
        });

        if (!result.success) {
          setError(result.message);
          return;
        }

        onInsert(result.questions);
        onOpenChange(false);

        const added = `Added ${result.questions.length} question${result.questions.length === 1 ? "" : "s"}.`;
        toast.success(
          result.skipped > 0
            ? `${added} ${result.skipped} invalid suggestion${result.skipped === 1 ? " was" : "s were"} skipped.`
            : `${added} Review them before publishing.`,
        );
      } catch {
        setError("Couldn't reach the server. Check your connection and try again.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate questions with AI</DialogTitle>
          <DialogDescription>
            Questions are checked before they&apos;re added. Always review them
            before publishing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ai-topic">Topic</Label>
            <Input
              id="ai-topic"
              value={topic}
              maxLength={GENERATION_LIMITS.TOPIC_MAX}
              placeholder="e.g. Photosynthesis"
              onChange={(event) => setTopic(event.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="ai-source">
                Source material <span className="font-normal text-slate-500">(optional)</span>
              </Label>
              <span className="text-xs tabular-nums text-slate-500">
                {sourceText.length}/{GENERATION_LIMITS.SOURCE_MAX}
              </span>
            </div>
            <Textarea
              id="ai-source"
              value={sourceText}
              maxLength={GENERATION_LIMITS.SOURCE_MAX}
              placeholder="Paste notes or a lesson excerpt. Questions will only use facts from this text."
              className="min-h-24"
              onChange={(event) => setSourceText(event.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
            <div className="space-y-1.5">
              <Label htmlFor="ai-count">Questions</Label>
              <Input
                id="ai-count"
                type="number"
                min={GENERATION_LIMITS.MIN_COUNT}
                max={GENERATION_LIMITS.MAX_COUNT}
                value={count}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setCount(Number.isNaN(next) ? 1 : Math.min(Math.max(next, 1), GENERATION_LIMITS.MAX_COUNT));
                }}
                disabled={isPending}
              />
            </div>

            <fieldset className="space-y-1.5">
              <legend className="mb-1.5 text-sm font-medium text-slate-200">Question types</legend>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {AI_QUESTION_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2 text-sm text-slate-300">
                    <Checkbox
                      checked={types.includes(type)}
                      onCheckedChange={(checked) => toggleType(type, checked === true)}
                      disabled={isPending}
                    />
                    {TYPE_LABELS[type]}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {error && <FormMessage>{error}</FormMessage>}

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:items-center sm:justify-end">
            {isPending && (
              <p className="text-xs text-slate-500 sm:mr-auto" role="status">
                This can take up to 30 seconds…
              </p>
            )}

            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
