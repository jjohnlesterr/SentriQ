"use client";

import type { Dispatch, SetStateAction } from "react";

import {
  createEmptyQuestion,
  getQuestionTypeDefaults,
  isQuestionComplete,
} from "@/lib/quiz-builder";
import type { Question, QuestionType } from "@/lib/types";

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
      alert("Please complete the current question before adding another one.");
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
        questionIndex === index ? { ...question, ...updates } : question
      )
    );
  }

  function reorderQuestions(activeId: string, overId: string) {
    if (activeId === overId) return;

    setQuestions((prev) => {
      const oldIndex = prev.findIndex((question) => question.id === activeId);
      const newIndex = prev.findIndex((question) => question.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      const activeQuestionId = prev[activeQuestion]?.id;
      const updated = reorder(prev, oldIndex, newIndex);

      const updatedActiveIndex = updated.findIndex(
        (question) => question.id === activeQuestionId
      );

      setActiveQuestion(updatedActiveIndex === -1 ? 0 : updatedActiveIndex);

      return updated;
    });
  }

  function handleChangeQuestionType(index: number, type: QuestionType) {
    const current = questions[index];

    if (!current) return;

    updateQuestion(index, getQuestionTypeDefaults(current, type));
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => {
      const updated = prev.filter((_, questionIndex) => questionIndex !== index);

      setActiveQuestion((current) => {
        if (updated.length === 0) return 0;
        if (current >= updated.length) return updated.length - 1;
        if (index <= current) return Math.max(0, current - 1);
        return current;
      });

      return updated;
    });
  }

  function moveQuestionUp(index: number) {
    if (index <= 0) return;

    setQuestions((prev) => reorder(prev, index, index - 1));
    setActiveQuestion(index - 1);
  }

  function moveQuestionDown(index: number) {
    if (index >= questions.length - 1) return;

    setQuestions((prev) => reorder(prev, index, index + 1));
    setActiveQuestion(index + 1);
  }

  function duplicateQuestion(index: number) {
    const question = questions[index];

    if (!question) return;

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