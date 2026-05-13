"use client";

import { useEffect } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { getQuizById, getSessionById } from "@/lib/actions";
import type { Quiz, QuizSession } from "@/lib/types";

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
  useEffect(() => {
    if (!session || session.approvalStatus !== "pending") return;

    const interval = setInterval(async () => {
      const sessionData = await getSessionById(sessionId);

      if (!sessionData) return;

      setSession(sessionData);
      syncViolationCounts(sessionData);

      if (sessionData.approvalStatus === "approved") {
        const quizData = await getQuizById(sessionData.quizId);

        if (!quizData) {
          router.replace("/");
          return;
        }

        setQuiz(quizData);
        setAnswers(sessionData.answers || {});
        setCurrentIndex(sessionData.currentQuestion || 0);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [
    session,
    sessionId,
    router,
    setSession,
    setQuiz,
    setCurrentIndex,
    setAnswers,
    syncViolationCounts,
  ]);
}