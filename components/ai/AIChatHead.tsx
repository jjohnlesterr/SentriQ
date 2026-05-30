"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles } from "lucide-react";

import AIChatPanel from "@/components/ai/AIChatPanel";
import type { Question } from "@/lib/shared/types";

type Props = {
  question: Question;
  quizTitle?: string;
  onApplyWrongAnswers: (answers: string[]) => void;
};

export default function AIChatHead({
  question,
  quizTitle,
  onApplyWrongAnswers,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      {isOpen && (
        <AIChatPanel
          question={question}
          quizTitle={quizTitle}
          onClose={() => setIsOpen(false)}
          onApplyWrongAnswers={onApplyWrongAnswers}
        />
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-4 right-4 z-[9999] flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-2xl shadow-violet-950/50 transition hover:scale-105 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
      >
        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    </>,
    document.body,
  );
}