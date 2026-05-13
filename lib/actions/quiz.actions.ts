"use server";

import type { Question } from "@/lib/types";

import {
  createQuizService,
  deleteQuizService,
  getAllQuizzesWithSessionsService,
  getQuizByIdService,
  getTeacherQuizzesService,
  publishQuizService,
  updateQuizService,
} from "@/lib/services/quiz.service";

export async function createQuiz(
  title: string,
  description: string,
  teacherId: string
) {
  return createQuizService(title, description, teacherId);
}

export async function updateQuiz(
  quizId: string,
  title: string,
  description: string,
  questions: Question[]
) {
  return updateQuizService(quizId, title, description, questions);
}

export async function publishQuiz(quizId: string) {
  return publishQuizService(quizId);
}

export async function deleteQuiz(quizId: string) {
  return deleteQuizService(quizId);
}

export async function getTeacherQuizzes(teacherId: string) {
  return getTeacherQuizzesService(teacherId);
}

export async function getQuizById(quizId: string) {
  return getQuizByIdService(quizId);
}

export async function getAllQuizzesWithSessions() {
  return getAllQuizzesWithSessionsService();
}