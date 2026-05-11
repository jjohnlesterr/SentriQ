"use server";

import { quizzes, sessions } from "../data/mock-db";
import type { Question, Quiz } from "@/lib/types";

function generateCode(length: number = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

async function generateUniqueQuizCode(): Promise<string> {
  let code = generateCode();

  while (quizzes.some((quiz) => quiz.code === code)) {
    code = generateCode();
  }

  return code;
}

export async function createQuiz(
  title: string,
  description: string,
  teacherId: string
): Promise<Quiz> {
  const quiz: Quiz = {
    id: Date.now().toString(),
    title,
    description,
    questions: [],
    code: await generateUniqueQuizCode(),
    createdAt: new Date(),
    createdBy: teacherId,
    published: false,
    status: "draft",
  };

  quizzes.push(quiz);

  return quiz;
}

export async function updateQuiz(
  quizId: string,
  title: string,
  description: string,
  questions: Question[]
): Promise<Quiz> {
  const index = quizzes.findIndex((quiz) => quiz.id === quizId);

  if (index === -1) {
    throw new Error("Quiz not found");
  }

  const updatedQuiz: Quiz = {
    ...quizzes[index],
    title,
    description,
    questions,
  };

  quizzes[index] = updatedQuiz;

  return updatedQuiz;
}

export async function publishQuiz(quizId: string): Promise<Quiz> {
  const index = quizzes.findIndex((quiz) => quiz.id === quizId);

  if (index === -1) {
    throw new Error("Quiz not found");
  }

  const updatedQuiz: Quiz = {
    ...quizzes[index],
    published: true,
    status: "published",
  };

  quizzes[index] = updatedQuiz;

  return updatedQuiz;
}

export async function deleteQuiz(quizId: string): Promise<void> {
  const index = quizzes.findIndex((quiz) => quiz.id === quizId);

  if (index === -1) {
    throw new Error("Quiz not found");
  }

  quizzes.splice(index, 1);

  for (let i = sessions.length - 1; i >= 0; i--) {
    if (sessions[i].quizId === quizId) {
      sessions.splice(i, 1);
    }
  }
}

export async function getTeacherQuizzes(teacherId: string): Promise<Quiz[]> {
  return quizzes.filter((quiz) => quiz.createdBy === teacherId);
}

export async function getQuizById(quizId: string): Promise<Quiz | null> {
  return quizzes.find((quiz) => quiz.id === quizId) ?? null;
}

export async function getAllQuizzesWithSessions() {
  return quizzes.map((quiz) => ({
    ...quiz,
    sessions: sessions.filter((session) => session.quizId === quiz.id),
  }));
}