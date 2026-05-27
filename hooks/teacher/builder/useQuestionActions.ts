"use client";

import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

import {
  createEmptyQuestion,
  getQuestionTypeDefaults,
  isQuestionComplete,
} from "@/lib/quiz/quiz-builder";
import type { Question, QuestionType } from "@/lib/shared/types";

function reorder<T>(items: T[], fromIndex: number, toIndex: number) {
  const updated = [...items];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  return updated;
}

type Params = {
  questions: Question[];
  activeQuestion: number;
  setQuestions: Dispatch<SetStateAction<Question[]>>;
  setActiveQuestion: Dispatch<SetStateAction<number>>;
};

export function useQuestionActions({
  questions,
  activeQuestion,
  setQuestions,
  setActiveQuestion,
}: Params) {
  const currentQuestion = questions[activeQuestion];
  const canAddQuestion = isQuestionComplete(currentQuestion);

  function addQuestion() {
    if (!canAddQuestion) {
      toast.error(
        "Please complete the current question before adding another one.",
      );
      return;
    }

    const newQuestion = createEmptyQuestion();

    setQuestions((prev) => {
      setActiveQuestion(prev.length);
      return [...prev, newQuestion];
    });
  }

  function updateQuestion(index: number, updates: Partial<Question>) {
    setQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...updates } : question,
      ),
    );
  }

  function reorderQuestions(activeId: string, overId: string) {
    if (activeId === overId) return;

    setQuestions((prev) => {
      const oldIndex = prev.findIndex((question) => question.id === activeId);
      const newIndex = prev.findIndex((question) => question.id === overId);

      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Unable to reorder questions.");
        return prev;
      }

      const activeQuestionId = prev[activeQuestion]?.id;
      const updated = reorder(prev, oldIndex, newIndex);

      const updatedActiveIndex = updated.findIndex(
        (question) => question.id === activeQuestionId,
      );

      setActiveQuestion(updatedActiveIndex === -1 ? 0 : updatedActiveIndex);

      return updated;
    });
  }

  function handleChangeQuestionType(index: number, type: QuestionType) {
    const current = questions[index];

    if (!current) {
      toast.error("Question not found.");
      return;
    }

    updateQuestion(index, getQuestionTypeDefaults(current, type));
  }

  function removeQuestion(index: number) {
    const question = questions[index];

    if (!question) {
      toast.error("Question not found.");
      return;
    }

    setQuestions((prev) => {
      const updated = prev.filter(
        (_, questionIndex) => questionIndex !== index,
      );

      setActiveQuestion((current) => {
        if (updated.length === 0) return 0;
        if (current >= updated.length) return updated.length - 1;
        if (index <= current) return Math.max(0, current - 1);
        return current;
      });

      return updated;
    });

    toast.success("Question removed.");
  }

  function moveQuestionUp(index: number) {
    if (index <= 0) {
      toast.error("This question is already at the top.");
      return;
    }

    setQuestions((prev) => reorder(prev, index, index - 1));
    setActiveQuestion(index - 1);
  }

  function moveQuestionDown(index: number) {
    if (index >= questions.length - 1) {
      toast.error("This question is already at the bottom.");
      return;
    }

    setQuestions((prev) => reorder(prev, index, index + 1));
    setActiveQuestion(index + 1);
  }

  function duplicateQuestion(index: number) {
    const question = questions[index];

    if (!question) {
      toast.error("Question not found.");
      return;
    }

    const duplicate: Question = {
      ...question,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text: question.text ? `${question.text} (Copy)` : "",
      options: [...question.options],
    };

    setQuestions((prev) => {
      const updated = [...prev];
      updated.splice(index + 1, 0, duplicate);
      return updated;
    });

    setActiveQuestion(index + 1);
    toast.success("Question duplicated.");
  }

  return {
    currentQuestion,
    canAddQuestion,

    addQuestion,
    updateQuestion,
    reorderQuestions,
    handleChangeQuestionType,
    removeQuestion,
    moveQuestionUp,
    moveQuestionDown,
    duplicateQuestion,
  };
}
