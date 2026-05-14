"use client";

import type { Dispatch, SetStateAction } from "react";

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
      alert("Quiz title is required.");
      return false;
    }

    return true;
  }

  function validateQuizBeforePublish() {
    if (!title.trim()) {
      alert("Quiz title is required.");
      return false;
    }

    if (questions.length === 0) {
      alert("Add at least one question before publishing.");
      return false;
    }

    const incompleteQuestionIndex = questions.findIndex(
      (question) => !isQuestionComplete(question)
    );

    if (incompleteQuestionIndex !== -1) {
      setActiveQuestion(incompleteQuestionIndex);
      alert(`Please complete Question ${incompleteQuestionIndex + 1}.`);
      return false;
    }

    return true;
  }

  async function copyQuizCode() {
    if (!quiz?.code) return;

    await navigator.clipboard.writeText(quiz.code);
    alert("Quiz code copied.");
  }

  return {
    saveQuiz,
    publishCurrentQuiz,
    validateQuizBeforeSave,
    validateQuizBeforePublish,
    copyQuizCode,
  };
}