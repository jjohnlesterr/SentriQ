"use client";

import { useCallback, useEffect } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { getQuizById, getSessionById } from "@/lib/actions";
import { supabase } from "@/lib/supabase/client";
import type { Quiz, QuizSession } from "@/lib/shared/types";

type AnswerMap = Record<number, number | string>;

type Params = {
  session: QuizSession | null;
  sessionId: string;
  router: AppRouterInstance;
  setSession: (session: QuizSession) => void;
  setQuiz: (quiz: Quiz) => void;
  setCurrentIndex: (index: number) => void;
  setAnswers: (answers: AnswerMap) => void;
  syncViolationCounts: (session: QuizSession) => void;
};

export function useStudentQuizSession({
  session,
  sessionId,
  router,
  setSession,
  setQuiz,
  setCurrentIndex,
  setAnswers,
  syncViolationCounts,
}: Params) {
  const syncSession = useCallback(async () => {
    const sessionData = await getSessionById(sessionId);

    if (!sessionData) return;

    setSession(sessionData);
    syncViolationCounts(sessionData);

    if (sessionData.approvalStatus === "rejected") {
      router.replace("/student/join");
      return;
    }

    if (sessionData.approvalStatus === "approved") {
      const quizData = await getQuizById(sessionData.quizId);

      if (!quizData) {
        router.replace("/");
        return;
      }

      setQuiz(quizData);
      setAnswers(sessionData.answers || {});
      setCurrentIndex(sessionData.currentQuestion || 0);

      router.refresh();
    }
  }, [
    sessionId,
    router,
    setSession,
    setQuiz,
    setCurrentIndex,
    setAnswers,
    syncViolationCounts,
  ]);

  useEffect(() => {
    if (!session || session.approvalStatus !== "pending") return;

    void syncSession();

    const channel = supabase
      .channel(`student-quiz-session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${sessionId}`,
        },
        () => {
          void syncSession();
        },
      )
      .subscribe();

    const polling = window.setInterval(() => {
      void syncSession();
    }, 1500);

    return () => {
      window.clearInterval(polling);
      supabase.removeChannel(channel);
    };
  }, [session, sessionId, syncSession]);
}