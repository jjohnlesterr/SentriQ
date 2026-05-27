"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
      try {
        const session = await getTeacherSession();

        if (!session) {
          router.push("/teacher/login");
          return;
        }

        setTeacherId(session.user.id);
        setTeacherName(session.user.email ?? "Teacher");
        await loadQuizzes(session.user.id);
      } catch {
        toast.error("Failed to load teacher session.");
      }
    }

    loadSession();
  }, [router]);

  async function loadQuizzes(id = teacherId) {
    if (!id) return;

    setIsLoading(true);

    try {
      const data = await getTeacherQuizzes(id);
      setQuizzes(data);
    } catch {
      toast.error("Failed to load quizzes.");
    } finally {
      setIsLoading(false);
    }
  }

  async function createNewQuiz(title: string, description: string) {
    if (!teacherId) {
      throw new Error("Teacher session not found.");
    }

    const quiz = await createQuiz(title, description, teacherId);

    setQuizzes((prev) => [...prev, quiz]);
    router.push(`/teacher/quiz/${quiz.id}/builder`);
  }

  async function handleDeleteQuiz(quizId: string) {
    try {
      await deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
      toast.success("Quiz deleted.");
    } catch {
      toast.error("Failed to delete quiz.");
    }
  }

  async function handleLogout() {
    try {
      await clearTeacherSession();
      router.push("/");
    } catch {
      toast.error("Failed to logout.");
    }
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
