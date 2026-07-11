"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Question, Quiz } from "@/lib/shared/types";

type QuestionRow = {
  id: string;
  quiz_id: string;
  type: Question["type"];
  text: string;
  hint: string | null;
  options: string[] | null;
  correct_answer: number | null;
  correct_text_answer: string | null;
  position: number;
};

type QuizRow = {
  id: string;
  title: string;
  description: string;
  code: string;
  created_by: string;
  published: boolean;
  status: "draft" | "published";
  created_at: string;
  time_limit_minutes: number | null;
  join_locked: boolean | null;
  questions?: QuestionRow[];
};

type SessionRow = {
  quiz_id: string;
  approval_status: string;
  status: string;
  completed_at: string | null;
};

export type TeacherDashboardQuiz = Quiz & {
  isAnswering: boolean;
  activeSessionCount: number;
};

export type TeacherDashboardData = {
  teacherId: string;
  teacherName: string;
  isAdmin: boolean;
  quizzes: TeacherDashboardQuiz[];
};

function mapQuestionRow(row: QuestionRow): Question {
  return {
    id: row.id,
    type: row.type,
    text: row.text,
    hint: row.hint ?? "",
    options: row.options ?? [],
    correctAnswer: row.correct_answer ?? 0,
    correctTextAnswer: row.correct_text_answer ?? "",
  };
}

function mapQuizRow(row: QuizRow): Quiz {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    code: row.code,
    createdBy: row.created_by,
    published: row.published,
    status: row.status,
    createdAt: new Date(row.created_at),
    timeLimitMinutes: row.time_limit_minutes ?? null,
    joinLocked: row.join_locked ?? false,
    questions:
      row.questions
        ?.sort((first, second) => first.position - second.position)
        .map(mapQuestionRow) ?? [],
  };
}

export async function getTeacherDashboardData(): Promise<TeacherDashboardData> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Teacher session not found.");
  }

  const [profileResult, quizzesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle(),

    supabase
      .from("quizzes")
      .select(
        `
          id,
          title,
          description,
          code,
          created_by,
          published,
          status,
          created_at,
          time_limit_minutes,
          join_locked,
          questions (
            id,
            quiz_id,
            type,
            text,
            hint,
            options,
            correct_answer,
            correct_text_answer,
            position
          )
        `,
      )
      .eq("created_by", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (profileResult.error) {
    throw new Error(profileResult.error.message);
  }

  if (quizzesResult.error) {
    throw new Error(quizzesResult.error.message);
  }

  const quizRows = (quizzesResult.data ?? []) as QuizRow[];
  const quizIds = quizRows.map((quiz) => quiz.id);

  let sessionRows: SessionRow[] = [];

  if (quizIds.length > 0) {
    const { data, error } = await supabase
      .from("sessions")
      .select("quiz_id, approval_status, status, completed_at")
      .in("quiz_id", quizIds)
      .eq("approval_status", "approved")
      .eq("status", "in-progress")
      .is("completed_at", null);

    if (error) {
      throw new Error(error.message);
    }

    sessionRows = (data ?? []) as SessionRow[];
  }

  const activeSessionCounts = new Map<string, number>();

  for (const session of sessionRows) {
    const currentCount = activeSessionCounts.get(session.quiz_id) ?? 0;

    activeSessionCounts.set(session.quiz_id, currentCount + 1);
  }

  const quizzes = quizRows.map((row) => {
    const quiz = mapQuizRow(row);
    const activeSessionCount = activeSessionCounts.get(quiz.id) ?? 0;

    return {
      ...quiz,
      isAnswering: activeSessionCount > 0,
      activeSessionCount,
    };
  });

  return {
    teacherId: user.id,
    teacherName: user.email ?? "Teacher",
    isAdmin: profileResult.data?.role === "admin",
    quizzes,
  };
}