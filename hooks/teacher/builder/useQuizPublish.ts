"use client";

import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

import { publishQuiz, updateQuiz } from "@/lib/actions";
import type { Question, Quiz } from "@/lib/shared/types";

const QUESTION_MIN = 2;
const OPTION_MIN = 1;

type Params = {
  quizId: string;
  quiz: Quiz | null;
  title: string;
  description: string;
  questions: Question[];
  timeLimitMinutes: number | null;
  setQuiz: Dispatch<SetStateAction<Quiz | null>>;
  setActiveQuestion: Dispatch<SetStateAction<number>>;
  refreshTeacherQuizzes: () => Promise<void>;
};

function hasDuplicateOptions(options: string[]) {
  const normalized = options.map((option) => option.trim().toLowerCase());

  return new Set(normalized).size !== normalized.length;
}

function validateQuestion(question: Question, index: number) {
  const questionNumber = index + 1;

  if (!question.text.trim()) {
    return `Question ${questionNumber} text is required.`;
  }

  if (question.text.trim().length < QUESTION_MIN) {
    return `Question ${questionNumber} must be at least ${QUESTION_MIN} characters.`;
  }

  if (question.type === "multiple_choice") {
    if (question.options.length < 2) {
      return `Question ${questionNumber} must have at least 2 answer options.`;
    }

    const emptyOptionIndex = question.options.findIndex(
      (option) => option.trim().length < OPTION_MIN,
    );

    if (emptyOptionIndex !== -1) {
      return `Question ${questionNumber}, Option ${
        emptyOptionIndex + 1
      } cannot be empty.`;
    }

    if (hasDuplicateOptions(question.options)) {
      return `Question ${questionNumber} contains duplicate answers.`;
    }

    if (
      question.correctAnswer < 0 ||
      question.correctAnswer >= question.options.length
    ) {
      return `Please select the correct answer for Question ${questionNumber}.`;
    }
  }

  if (question.type === "true_false") {
    if (question.correctAnswer !== 0 && question.correctAnswer !== 1) {
      return `Please select the correct answer for Question ${questionNumber}.`;
    }
  }

  if (question.type === "identification") {
    if (!question.correctTextAnswer?.trim()) {
      return `Identification answer for Question ${questionNumber} is required.`;
    }
  }

  return null;
}

export function useQuizPublish({
  quizId,
  quiz,
  title,
  description,
  questions,
  timeLimitMinutes,
  setQuiz,
  setActiveQuestion,
  refreshTeacherQuizzes,
}: Params) {
  async function saveQuiz() {
    const updated = await updateQuiz(
      quizId,
      title,
      description,
      questions,
      timeLimitMinutes,
    );

    setQuiz(updated);

    return updated;
  }

  async function publishCurrentQuiz() {
    await updateQuiz(quizId, title, description, questions, timeLimitMinutes);

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

    const invalidQuestionIndex = questions.findIndex(
      (question, index) => validateQuestion(question, index) !== null,
    );

    if (invalidQuestionIndex !== -1) {
      setActiveQuestion(invalidQuestionIndex);

      const message = validateQuestion(
        questions[invalidQuestionIndex],
        invalidQuestionIndex,
      );

      toast.error(message || "Please complete the selected question.");
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