"use server";

import { ZodError } from "zod";

import type { Question } from "@/lib/shared/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import {
  createQuizService,
  deleteQuizService,
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

export async function updateQuizJoinLocked(
  quizId: string,
  joinLocked: boolean,
) {
  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("quizzes")
      .update({ join_locked: joinLocked })
      .eq("id", quizId)
      .select("*, questions(*)")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return getQuizByIdService(data.id);
  } catch (error) {
    throw new Error(
      getActionErrorMessage(error, "Failed to update joining status."),
    );
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

