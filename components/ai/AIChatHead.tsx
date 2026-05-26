"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles } from "lucide-react";

import AIChatPanel from "@/components/ai/AIChatPanel";
import type { Question } from "@/lib/shared/types";

type Props = {
  question: Question;
  onApplyWrongAnswers: (answers: string[]) => void;
};

export default function AIChatHead({ question, onApplyWrongAnswers }: Props) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      {isOpen && (
        <AIChatPanel  
          question={question}
          onClose={() => setIsOpen(false)}
          onApplyWrongAnswers={onApplyWrongAnswers}
        />
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-4 right-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-2xl shadow-violet-950/50 transition hover:scale-105 sm:bottom-6 sm:right-6"
        aria-label="Open AI assistant"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    </>,
    document.body,
  );
}
