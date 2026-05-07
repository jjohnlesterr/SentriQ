"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getQuizById, getQuizSessions } from "@/lib/actions";
import type { Quiz, QuizSession } from "@/lib/types";

export function useTeacherMonitor() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [openSessionId, setOpenSessionId] = useState<string | null>(null);

  async function loadData() {
    try {
      const quizData = await getQuizById(quizId);
      const sessionData = await getQuizSessions(quizId);

      setQuiz(quizData);
      setSessions(sessionData);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [quizId]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadData();
    }, 3000);

    return () => clearInterval(interval);
  }, [quizId, autoRefresh]);

  function goBack() {
    router.push("/teacher/dashboard");
  }

  function toggleAutoRefresh() {
    setAutoRefresh((prev) => !prev);
  }

  function formatTime(value: Date | string | undefined) {
    if (!value) return "—";
    return new Date(value).toLocaleTimeString();
  }

  const inProgress = sessions.filter((s) => s.status === "in-progress");
  const completed = sessions.filter((s) => s.status === "completed");
  const suspicious = sessions.filter((s) => s.tabSwitches > 0);

  const selectedSession = sessions.find(
    (session) => session.id === openSessionId
  );

  return {
    quiz,
    sessions,
    inProgress,
    completed,
    suspicious,
    selectedSession,

    isLoading,
    autoRefresh,
    lastUpdated,
    openSessionId,

    loadData,
    goBack,
    toggleAutoRefresh,
    formatTime,
    setOpenSessionId,
  };
}