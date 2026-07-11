"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createQuiz, deleteQuiz, getTeacherDashboardData } from "@/lib/actions";
import { clearTeacherSession } from "@/lib/auth/teacher-session";
import type { TeacherDashboardQuiz } from "@/lib/actions/dashboard.actions";

export type DashboardQuiz = TeacherDashboardQuiz;

export function useTeacherQuizzes() {
  const router = useRouter();

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [isAdmin, setIsAdmin] = useState(false);
  const [quizzes, setQuizzes] = useState<DashboardQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const publishedQuizzes = useMemo(
    () => quizzes.filter((quiz) => quiz.published),
    [quizzes],
  );

  const draftQuizzes = useMemo(
    () => quizzes.filter((quiz) => !quiz.published),
    [quizzes],
  );

  const loadQuizzes = useCallback(async () => {
    setIsLoading(true);

    try {
      const dashboardData = await getTeacherDashboardData();

      setTeacherId(dashboardData.teacherId);
      setTeacherName(dashboardData.teacherName);
      setIsAdmin(dashboardData.isAdmin);
      setQuizzes(dashboardData.quizzes);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load dashboard.";

      if (message === "Teacher session not found.") {
        router.push("/");
        return;
      }

      toast.error("Failed to load teacher dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    getTeacherDashboardData()
      .then((dashboardData) => {
        if (cancelled) return;

        setTeacherId(dashboardData.teacherId);
        setTeacherName(dashboardData.teacherName);
        setIsAdmin(dashboardData.isAdmin);
        setQuizzes(dashboardData.quizzes);
      })
      .catch((error: unknown) => {
        if (cancelled) return;

        const message =
          error instanceof Error ? error.message : "Failed to load dashboard.";

        if (message === "Teacher session not found.") {
          router.push("/");
          return;
        }

        toast.error("Failed to load teacher dashboard.");
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function createNewQuiz(title: string, description: string) {
    if (!teacherId) {
      throw new Error("Teacher session not found.");
    }

    const quiz = await createQuiz(title, description, teacherId);

    setQuizzes((currentQuizzes) => [
      {
        ...quiz,
        isAnswering: false,
        activeSessionCount: 0,
      },
      ...currentQuizzes,
    ]);

    router.push(`/teacher/quiz/${quiz.id}/builder?fresh=1`);
  }

  async function handleDeleteQuiz(quizId: string) {
    try {
      await deleteQuiz(quizId);

      setQuizzes((currentQuizzes) =>
        currentQuizzes.filter((quiz) => quiz.id !== quizId),
      );

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
    isAdmin,
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
