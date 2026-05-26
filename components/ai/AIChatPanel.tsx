"use client";

import { useMemo, useState, useTransition } from "react";
import { Send, Sparkles, X } from "lucide-react";

import { generateAIResponse } from "@/lib/actions/ai.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Question } from "@/lib/shared/types";

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

  function askAI(message: string, action: "chat" | "suggest_wrong_answers") {
    setMessages((current) => [...current, { role: "user", content: message }]);

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
    if (chip === "Suggest 3 wrong answers") {
      askAI(chip, "suggest_wrong_answers");
      return;
    }

    askAI(chip, "chat");
  }

  function handleSubmit() {
    const message = input.trim();
    if (!message) return;

    setInput("");
    askAI(message, "chat");
  }

  return (
    <div className="fixed inset-x-3 bottom-20 top-4 z-[9999] flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/50 backdrop-blur-xl md:inset-x-auto md:right-6 md:top-8 md:h-[calc(100dvh-7rem)] md:w-[440px] lg:top-auto lg:h-[620px] lg:w-[390px]">
      {" "}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-300" />
          <p className="font-bold text-white">AI Assistant</p>
          <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-200">
            BETA
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          aria-label="Close AI assistant"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="shrink-0 border-b border-white/10 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Suggested actions
        </p>

        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              disabled={isPending}
              onClick={() => handleChipClick(chip)}
              className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-200 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {!canSuggestWrongAnswers && question.type === "multiple_choice" && (
          <p className="mt-3 text-xs text-slate-500">
            Add a question and correct answer first to unlock wrong-answer
            suggestions.
          </p>
        )}
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "ml-auto max-w-[85%] rounded-2xl bg-violet-500 px-4 py-3 text-sm text-white"
                : "mr-auto max-w-[85%] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100"
            }
          >
            <p className="break-words whitespace-pre-wrap">{message.content}</p>

            {message.wrongAnswers && (
              <div className="mt-3 space-y-2">
                {message.wrongAnswers.map((answer) => (
                  <div
                    key={answer}
                    className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-100"
                  >
                    {answer}
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={() =>
                    onApplyWrongAnswers(message.wrongAnswers ?? [])
                  }
                  className="mt-2 h-10 w-full rounded-xl bg-violet-500 text-white hover:bg-violet-600"
                >
                  Apply to Choices
                </Button>
              </div>
            )}
          </div>
        ))}

        {isPending && (
          <div className="mr-auto max-w-[85%] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-400">
            AI is thinking...
          </div>
        )}
      </div>
      <div className="flex shrink-0 gap-2 border-t border-white/10 p-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="Ask anything about your quiz..."
          className="h-11 rounded-2xl border-white/10 bg-slate-950/60 text-white"
        />

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="h-11 w-11 shrink-0 rounded-2xl bg-violet-500 p-0 hover:bg-violet-600"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
