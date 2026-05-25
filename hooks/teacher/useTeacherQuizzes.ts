"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createQuiz, deleteQuiz, getTeacherQuizzes } from "@/lib/actions";
import {
  clearTeacherSession,
  getTeacherSession,
} from "@/lib/auth/teacher-session";
import type { Quiz } from "@/lib/shared/types";

export function useTeacherQuizzes() {
  const router = useRouter();

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const publishedQuizzes = useMemo(
    () => quizzes.filter((quiz) => quiz.published),
    [quizzes],
  );

  const draftQuizzes = useMemo(
    () => quizzes.filter((quiz) => !quiz.published),
    [quizzes],
  );

  useEffect(() => {
    async function loadSession() {
      const session = await getTeacherSession();

      if (!session) {
        router.push("/teacher/login");
        return;
      }

      setTeacherId(session.user.id);
      setTeacherName(session.user.email ?? "Teacher");
      loadQuizzes(session.user.id);
    }

    loadSession();
  }, [router]);

  async function loadQuizzes(id = teacherId) {
    if (!id) return;

    setIsLoading(true);

    try {
      const data = await getTeacherQuizzes(id);
      setQuizzes(data);
    } finally {
      setIsLoading(false);
    }
  }

  async function createNewQuiz(title: string, description: string) {
    if (!teacherId) {
      alert("Teacher session not found.");
      return;
    }

    const quiz = await createQuiz(title, description, teacherId);

    setQuizzes((prev) => [...prev, quiz]);
    router.push(`/teacher/quiz/${quiz.id}/builder`);
  }

  async function handleDeleteQuiz(quizId: string) {
    try {
      await deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
    } catch {
      alert("Failed to delete quiz.");
    }
  }

  function handleLogout() {
    clearTeacherSession();
    router.push("/");
  }

  return {
    teacherId,
    teacherName,
    quizzes,
    publishedQuizzes,
    draftQuizzes,
    isLoading,

    loadQuizzes,
    createNewQuiz,
    handleDeleteQuiz,
    handleLogout,
  };
}
