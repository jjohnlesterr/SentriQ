"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  completeSession,
  getQuizById,
  getSessionById,
  updateSessionAnswer,
} from "@/lib/actions";
import { calculateQuizScore } from "@/lib/quiz/scoring";
import type { Quiz, QuizSession } from "@/lib/shared/types";

import { useQuizMonitoring } from "@/hooks/student/useQuizMonitoring";
import { useFullscreenGuard } from "@/hooks/student/useFullscreenGuard";
import { useQuizAnswers } from "@/hooks/student/useQuizAnswers";
import { useStudentQuizSession } from "@/hooks/student/useStudentQuizSession";

export function useStudentQuiz() {
  const router = useRouter();
  const params = useParams();

  const sessionId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fullscreen = useFullscreenGuard();

  const monitoring = useQuizMonitoring({
    session,
    sessionId,
    onSessionUpdate: setSession,
  });

  const answersState = useQuizAnswers();

  async function loadQuizSession() {
    try {
      const sessionData = await getSessionById(sessionId);

      if (!sessionData) {
        router.replace("/");
        return;
      }

      setSession(sessionData);
      monitoring.syncViolationCounts(sessionData);

      if (
        sessionData.approvalStatus === "pending" ||
        sessionData.approvalStatus === "rejected"
      ) {
        return;
      }

      if (sessionData.status === "completed") {
        router.replace(`/student/results/${sessionId}`);
        return;
      }

      const quizData = await getQuizById(sessionData.quizId);

      if (!quizData) {
        router.replace("/");
        return;
      }

      setQuiz(quizData);

      answersState.setAnswers(sessionData.answers || {});
      setCurrentIndex(sessionData.currentQuestion || 0);

      fullscreen.setFullscreenActive(!!document.fullscreenElement);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadQuizSession();
  }, [sessionId]);

  useStudentQuizSession({
    session,
    sessionId,
    router,
    setSession,
    setQuiz,
    setCurrentIndex,
    setAnswers: answersState.setAnswers,
    syncViolationCounts: monitoring.syncViolationCounts,
  });

  useEffect(() => {
    if (session?.approvalStatus !== "approved") return;

    fullscreen.requestFullscreen(async () => {
      await monitoring.addSessionEvent(
        "fullscreen-exit",
        "Fullscreen request was blocked or cancelled.",
      );
    });
  }, [session?.approvalStatus]);

  useEffect(() => {
    if (session?.approvalStatus !== "approved") return;

    return monitoring.initializeMonitoring({
      onFullscreenChange: fullscreen.setFullscreenActive,
    });
  }, [session?.approvalStatus]);

  async function persistAnswer(answer?: number | string) {
    if (
      answer === undefined ||
      answer === "" ||
      !fullscreen.isFullscreenActive
    ) {
      return;
    }

    const updatedSession = await updateSessionAnswer(
      sessionId,
      currentIndex,
      answer,
    );

    setSession(updatedSession);
  }

  function handleAnswer(answer: number | string) {
    if (!fullscreen.isFullscreenActive) return;

    const updatedAnswers = {
      ...answersState.answers,
      [currentIndex]: answer,
    };

    answersState.setAnswers(updatedAnswers);
  }

  async function goNext() {
    if (!quiz || !fullscreen.isFullscreenActive) return;

    await persistAnswer(answersState.answers[currentIndex]);

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  async function goPrevious() {
    if (!fullscreen.isFullscreenActive) return;

    await persistAnswer(answersState.answers[currentIndex]);

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  async function handleSubmit() {
    if (!quiz || !session || !fullscreen.isFullscreenActive) {
      return;
    }

    setIsSubmitting(true);

    try {
      await persistAnswer(answersState.answers[currentIndex]);

      const score = calculateQuizScore(quiz, answersState.answers);

      const completedSession = await completeSession(sessionId, score);

      sessionStorage.setItem(
        "lastResult",
        JSON.stringify({
          session: completedSession,
          quiz,
        }),
      );

      router.replace(`/student/results/${sessionId}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentQuestion = quiz?.questions[currentIndex];

  const selectedAnswer = answersState.answers[currentIndex];

  const answeredCount = Object.keys(answersState.answers).length;

  const progress = useMemo(() => {
    if (!quiz) return 0;

    return Math.round(((currentIndex + 1) / quiz.questions.length) * 100);
  }, [quiz, currentIndex]);

  const isCurrentAnswered =
    selectedAnswer !== undefined && selectedAnswer !== "";

  return {
    quiz,
    session,

    currentQuestion,
    currentIndex,

    selectedAnswer,
    answeredCount,

    progress,
    isCurrentAnswered,

    isLoading,
    isSubmitting,

    tabWarnings: monitoring.tabWarnings,
    fullscreenExits: monitoring.fullscreenExits,
    copyAttempts: monitoring.copyAttempts,
    pasteAttempts: monitoring.pasteAttempts,

    isFullscreenActive: fullscreen.isFullscreenActive,

    requestFullscreen: fullscreen.requestFullscreen,

    handleAnswer,
    goPrevious,
    goNext,
    handleSubmit,
  };
}
