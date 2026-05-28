"use client";

import { useMemo, useState, useTransition } from "react";
import { Send, Sparkles, X } from "lucide-react";

import { generateAIResponse } from "@/lib/actions/ai.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Question } from "@/lib/shared/types";

type AIAction =
  | "chat"
  | "suggest_wrong_answers"
  | "generate_question_ideas"
  | "suggest_topics"
  | "write_question"
  | "create_outline";

type Message = {
  role: "user" | "ai";
  content: string;
  wrongAnswers?: string[];
};

type Props = {
  question: Question;
  onClose: () => void;
  onApplyWrongAnswers: (answers: string[]) => void;
};

export default function AIChatPanel({
  question,
  onClose,
  onApplyWrongAnswers,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hi! I can help you create better quiz questions.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const correctAnswer =
    question.type === "identification"
      ? (question.correctTextAnswer ?? "")
      : (question.options?.[question.correctAnswer] ?? "");

  const canSuggestWrongAnswers =
    question.type === "multiple_choice" &&
    question.text.trim().length > 0 &&
    correctAnswer.trim().length > 0;

  const chips = useMemo(() => {
    if (canSuggestWrongAnswers) {
      return [
        "Suggest 3 wrong answers",
        "Improve this question",
        "Generate explanation",
        "Make this harder",
      ];
    }

    return [
      "Generate question ideas",
      "Suggest topics",
      "Help me write a question",
      "Create quiz outline",
    ];
  }, [canSuggestWrongAnswers]);

  function askAI(message: string, action: AIAction) {
    if (isPending) return;

    setMessages((current) => [
      ...current,
      { role: "user", content: message },
    ]);

    startTransition(async () => {
      const response = await generateAIResponse({
        action,
        message,
        context: {
          questionType: question.type,
          questionText: question.text,
          correctAnswer,
          options: question.options,
        },
      });

      if (!response.success) {
        setMessages((current) => [
          ...current,
          { role: "ai", content: response.message },
        ]);
        return;
      }

      if (response.type === "wrong_answers") {
        setMessages((current) => [
          ...current,
          {
            role: "ai",
            content: "Here are 3 suggested wrong answers:",
            wrongAnswers: response.wrongAnswers,
          },
        ]);

        return;
      }

      setMessages((current) => [
        ...current,
        { role: "ai", content: response.message },
      ]);
    });
  }

  function handleChipClick(chip: string) {
    if (isPending) return;

    if (chip === "Suggest 3 wrong answers") {
      askAI(chip, "suggest_wrong_answers");
      return;
    }

    if (chip === "Generate question ideas") {
      askAI(chip, "generate_question_ideas");
      return;
    }

    if (chip === "Suggest topics") {
      askAI(chip, "suggest_topics");
      return;
    }

    if (chip === "Help me write a question") {
      askAI(chip, "write_question");
      return;
    }

    if (chip === "Create quiz outline") {
      askAI(chip, "create_outline");
      return;
    }

    askAI(chip, "chat");
  }

  function handleSubmit() {
    if (isPending) return;

    const message = input.trim();

    if (!message) return;

    setInput("");
    askAI(message, "chat");
  }

  return (
    <div className="fixed bottom-16 left-1/2 z-[9999] flex h-[76vh] w-[92vw] max-w-[380px] -translate-x-1/2 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:bottom-20 md:left-auto md:right-6 md:top-auto md:h-[680px] md:w-[400px] md:translate-x-0">
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-300" />

          <p className="text-sm font-bold text-white md:text-base">
            AI Assistant
          </p>

          <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[9px] font-bold text-violet-200">
            BETA
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Close AI assistant"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="shrink-0 border-b border-white/10 px-4 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Suggested actions
        </p>

        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              disabled={isPending}
              onClick={() => handleChipClick(chip)}
              className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 py-2 text-[11px] font-semibold text-violet-200 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {!canSuggestWrongAnswers && question.type === "multiple_choice" && (
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            Add a question and correct answer first to unlock wrong-answer
            suggestions.
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "ml-auto max-w-[85%] rounded-2xl bg-violet-500 px-3 py-2 text-xs text-white md:text-sm"
                : "mr-auto max-w-[85%] rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-100 md:text-sm"
            }
          >
            <p className="break-words whitespace-pre-wrap">
              {message.content}
            </p>

            {message.wrongAnswers && (
              <div className="mt-3 space-y-2">
                {message.wrongAnswers.map((answer) => (
                  <div
                    key={answer}
                    className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-xs text-slate-100 md:text-sm"
                  >
                    {answer}
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={() =>
                    onApplyWrongAnswers(message.wrongAnswers ?? [])
                  }
                  className="mt-2 h-9 w-full rounded-xl bg-violet-500 text-xs text-white hover:bg-violet-600 md:h-10 md:text-sm"
                >
                  Apply to Choices
                </Button>
              </div>
            )}
          </div>
        ))}

        {isPending && (
          <div className="mr-auto max-w-[85%] rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-400 md:text-sm">
            AI is thinking...
          </div>
        )}
      </div>

      <div className="flex shrink-0 gap-2 border-t border-white/10 p-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="Ask anything about your quiz..."
          className="h-10 rounded-2xl border-white/10 bg-slate-950/60 text-sm text-white"
          disabled={isPending}
        />

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="h-10 w-10 shrink-0 rounded-2xl bg-violet-500 p-0 hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}