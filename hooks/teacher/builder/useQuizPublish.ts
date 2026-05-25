"use client";

import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

import { publishQuiz, updateQuiz } from "@/lib/actions";
import { isQuestionComplete } from "@/lib/quiz/quiz-builder";
import type { Question, Quiz } from "@/lib/shared/types";

type Params = {
  quizId: string;
  quiz: Quiz | null;
  title: string;
  description: string;
  questions: Question[];
  setQuiz: Dispatch<SetStateAction<Quiz | null>>;
  setActiveQuestion: Dispatch<SetStateAction<number>>;
  refreshTeacherQuizzes: () => Promise<void>;
};

function hasDuplicateOptions(options: string[]) {
  const normalized = options.map((option) => option.trim().toLowerCase());

  return new Set(normalized).size !== normalized.length;
}

export function useQuizPublish({
  quizId,
  quiz,
  title,
  description,
  questions,
  setQuiz,
  setActiveQuestion,
  refreshTeacherQuizzes,
}: Params) {
  async function saveQuiz() {
    const updated = await updateQuiz(quizId, title, description, questions);

    setQuiz(updated);

    return updated;
  }

  async function publishCurrentQuiz() {
    await updateQuiz(quizId, title, description, questions);

    const published = await publishQuiz(quizId);

    setQuiz(published);

    await refreshTeacherQuizzes();

    return published;
  }

  function validateQuizBeforeSave() {
    if (!title.trim()) {
      toast.error("Quiz title is required.");
      return false;
    }

    return true;
  }

  function validateQuizBeforePublish() {
    if (!title.trim()) {
      toast.error("Quiz title is required.");
      return false;
    }

    if (questions.length === 0) {
      toast.error("Add at least one question before publishing.");

      return false;
    }

    const incompleteQuestionIndex = questions.findIndex(
      (question) => !isQuestionComplete(question),
    );

    if (incompleteQuestionIndex !== -1) {
      setActiveQuestion(incompleteQuestionIndex);

      toast.error(`Please complete Question ${incompleteQuestionIndex + 1}.`);

      return false;
    }

    const duplicateQuestionIndex = questions.findIndex(
      (question) =>
        question.type === "multiple_choice" &&
        hasDuplicateOptions(question.options),
    );

    if (duplicateQuestionIndex !== -1) {
      setActiveQuestion(duplicateQuestionIndex);

      toast.error(
        `Question ${duplicateQuestionIndex + 1} contains duplicate answers.`,
      );

      return false;
    }

    return true;
  }

  async function copyQuizCode() {
    if (!quiz?.code) {
      toast.error("No quiz code available.");
      return;
    }

    await navigator.clipboard.writeText(quiz.code);

    toast.success("Quiz code copied.");
  }

  return {
    saveQuiz,
    publishCurrentQuiz,
    validateQuizBeforeSave,
    validateQuizBeforePublish,
    copyQuizCode,
  };
}
