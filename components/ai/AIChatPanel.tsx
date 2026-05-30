"use client";

import { useMemo, useRef, useState, useTransition } from "react";
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
  | "write_question";

type Message = {
  role: "user" | "ai";
  content: string;
  wrongAnswers?: string[];
};

type Props = {
  question: Question;
  quizTitle?: string;
  onClose: () => void;
  onApplyWrongAnswers: (answers: string[]) => void;
};

const COOLDOWN_MS = 4000;

function isUnclearTopic(value?: string) {
  const topic = value?.trim().toLowerCase();

  if (!topic) return true;

  return [
    "untitled",
    "untitled quiz",
    "untitled question",
    "quiz",
    "exam",
    "test",
    "chapter",
    "question",
    "new quiz",
    "draft",
  ].includes(topic);
}

function getMessageCacheKey({
  action,
  message,
  topic,
  questionText,
  correctAnswer,
}: {
  action: AIAction;
  message: string;
  topic: string;
  questionText: string;
  correctAnswer: string;
}) {
  return JSON.stringify({
    action,
    message: message.trim().toLowerCase(),
    topic: topic.trim().toLowerCase(),
    questionText: questionText.trim().toLowerCase(),
    correctAnswer: correctAnswer.trim().toLowerCase(),
  });
}

function renderFormattedText(value: string) {
  const parts = value.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export default function AIChatPanel({
  question,
  quizTitle,
  onClose,
  onApplyWrongAnswers,
}: Props) {
  const cacheRef = useRef<Map<string, Message>>(new Map());

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hi! I can help you create better quiz questions.",
    },
  ]);

  const [input, setInput] = useState("");
  const [topicOverride, setTopicOverride] = useState("");
  const [pendingTopicAction, setPendingTopicAction] = useState<AIAction | null>(
    null,
  );
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [isPending, startTransition] = useTransition();

  const correctAnswer =
    question.type === "identification"
      ? (question.correctTextAnswer ?? "")
      : (question.options?.[question.correctAnswer] ?? "");

  const topic = topicOverride || quizTitle || question.text;
  const topicIsUnclear = isUnclearTopic(topic);

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
      ];
    }

    return [
      "Generate question ideas",
      "Suggest topics",
      "Help me write a question",
    ];
  }, [canSuggestWrongAnswers]);

  function addMessage(message: Message) {
    setMessages((current) => [...current, message]);
  }

  function startCooldown() {
    setIsCoolingDown(true);

    window.setTimeout(() => {
      setIsCoolingDown(false);
    }, COOLDOWN_MS);
  }

  function shouldAskForTopic(action: AIAction) {
    return (
      topicIsUnclear &&
      (action === "generate_question_ideas" ||
        action === "suggest_topics" ||
        action === "write_question")
    );
  }

  function requestTopic(action: AIAction, userMessage: string) {
    setPendingTopicAction(action);

    setMessages((current) => [
      ...current,
      { role: "user", content: userMessage },
      {
        role: "ai",
        content: "What subject or topic is this quiz about?",
      },
    ]);
  }

  function askAI(message: string, action: AIAction, overrideTopic?: string) {
    if (isPending) return;

    if (isCoolingDown) {
      addMessage({
        role: "ai",
        content: "Please wait a few seconds before sending another AI request.",
      });
      return;
    }

    const activeTopic =
      overrideTopic || topicOverride || quizTitle || question.text;

    const cacheKey = getMessageCacheKey({
      action,
      message,
      topic: activeTopic,
      questionText: question.text,
      correctAnswer,
    });

    setMessages((current) => [...current, { role: "user", content: message }]);

    const cachedMessage = cacheRef.current.get(cacheKey);

    if (cachedMessage) {
      setMessages((current) => [...current, cachedMessage]);
      return;
    }

    startCooldown();

    startTransition(async () => {
      const response = await generateAIResponse({
        action,
        message,
        context: {
          quizTitle,
          topicOverride: overrideTopic || topicOverride,
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
        const aiMessage: Message = {
          role: "ai",
          content: "Here are 3 suggested wrong answers:",
          wrongAnswers: response.wrongAnswers,
        };

        cacheRef.current.set(cacheKey, aiMessage);
        setMessages((current) => [...current, aiMessage]);
        return;
      }

      const aiMessage: Message = {
        role: "ai",
        content: response.message,
      };

      cacheRef.current.set(cacheKey, aiMessage);
      setMessages((current) => [...current, aiMessage]);
    });
  }

  function handleChipClick(chip: string) {
    if (isPending || isCoolingDown) return;

    if (chip === "Suggest 3 wrong answers") {
      askAI(chip, "suggest_wrong_answers");
      return;
    }

    if (chip === "Generate question ideas") {
      if (shouldAskForTopic("generate_question_ideas")) {
        requestTopic("generate_question_ideas", chip);
        return;
      }

      askAI(chip, "generate_question_ideas");
      return;
    }

    if (chip === "Suggest topics") {
      if (shouldAskForTopic("suggest_topics")) {
        requestTopic("suggest_topics", chip);
        return;
      }

      askAI(chip, "suggest_topics");
      return;
    }

    if (chip === "Help me write a question") {
      if (shouldAskForTopic("write_question")) {
        requestTopic("write_question", chip);
        return;
      }

      askAI(chip, "write_question");
      return;
    }

    askAI(chip, "chat");
  }

  function handleSubmit() {
    if (isPending) return;

    const message = input.trim();

    if (!message) return;

    setInput("");

    if (pendingTopicAction) {
      setTopicOverride(message);
      const action = pendingTopicAction;
      setPendingTopicAction(null);
      askAI(message, action, message);
      return;
    }

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
              disabled={isPending || isCoolingDown}
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
              {renderFormattedText(message.content)}
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
          disabled={isPending || isCoolingDown}
          className="h-10 w-10 shrink-0 rounded-2xl bg-violet-500 p-0 hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}