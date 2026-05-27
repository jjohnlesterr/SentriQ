"use server";

import { ZodError } from "zod";

import type { Question } from "@/lib/shared/types";

import {
  createQuizService,
  deleteQuizService,
  getAllQuizzesWithSessionsService,
  getQuizByIdService,
  getTeacherQuizzesService,
  publishQuizService,
  updateQuizService,
} from "@/lib/services/quiz.service";

function getActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export async function createQuiz(
  title: string,
  description: string,
  teacherId: string,
) {
  try {
    return await createQuizService(title, description, teacherId);
  } catch (error) {
    throw new Error(getActionErrorMessage(error, "Failed to create quiz."));
  }
}

export async function updateQuiz(
  quizId: string,
  title: string,
  description: string,
  questions: Question[],
  timeLimitMinutes?: number | null,
) {
  try {
    return await updateQuizService(
      quizId,
      title,
      description,
      questions,
      timeLimitMinutes,
    );
  } catch (error) {
    throw new Error(getActionErrorMessage(error, "Failed to update quiz."));
  }
}

export async function publishQuiz(quizId: string) {
  try {
    return await publishQuizService(quizId);
  } catch (error) {
    throw new Error(getActionErrorMessage(error, "Failed to publish quiz."));
  }
}

export async function deleteQuiz(quizId: string) {
  try {
    return await deleteQuizService(quizId);
  } catch (error) {
    throw new Error(getActionErrorMessage(error, "Failed to delete quiz."));
  }
}

export async function getTeacherQuizzes(teacherId: string) {
  try {
    return await getTeacherQuizzesService(teacherId);
  } catch (error) {
    throw new Error(getActionErrorMessage(error, "Failed to load quizzes."));
  }
}

export async function getQuizById(quizId: string) {
  try {
    return await getQuizByIdService(quizId);
  } catch (error) {
    throw new Error(getActionErrorMessage(error, "Failed to load quiz."));
  }
}

export async function getAllQuizzesWithSessions() {
  try {
    return await getAllQuizzesWithSessionsService();
  } catch (error) {
    throw new Error(
      getActionErrorMessage(error, "Failed to load quiz sessions."),
    );
  }
}