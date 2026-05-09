"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  completeSession,
  getQuizById,
  getSessionById,
  recordTabSwitch,
  updateSessionAnswer,
} from "@/lib/actions";

import type { Quiz, QuizSession } from "@/lib/types";

export function useStudentQuiz() {
  const router = useRouter();
  const params = useParams();

  const sessionId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tabWarnings, setTabWarnings] = useState(0);

  async function loadQuizSession() {
    try {
      const sessionData = await getSessionById(sessionId);

      if (!sessionData) {
        router.replace("/");
        return;
      }

      setSession(sessionData);

      if (sessionData.approvalStatus === "rejected") {
        setIsLoading(false);
        return;
      }

      if (sessionData.approvalStatus === "pending") {
        setIsLoading(false);
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
      setAnswers(sessionData.answers || {});
      setCurrentIndex(sessionData.currentQuestion || 0);
      setTabWarnings(sessionData.tabSwitches || 0);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadQuizSession();
  }, [sessionId]);

  useEffect(() => {
    if (!session || session.approvalStatus !== "pending") return;

    const interval = setInterval(async () => {
      const sessionData = await getSessionById(sessionId);

      if (!sessionData) return;

      setSession(sessionData);

      if (sessionData.approvalStatus === "approved") {
        const quizData = await getQuizById(sessionData.quizId);

        if (!quizData) {
          router.replace("/");
          return;
        }

        setQuiz(quizData);
        setAnswers(sessionData.answers || {});
        setCurrentIndex(sessionData.currentQuestion || 0);
        setTabWarnings(sessionData.tabSwitches || 0);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [session, sessionId, router]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden && session?.approvalStatus === "approved") {
        setTabWarnings((prev) => prev + 1);
        recordTabSwitch(sessionId);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [sessionId, session?.approvalStatus]);

  async function handleAnswer(answer: number | string) {
    const updatedAnswers = {
      ...answers,
      [currentIndex]: answer,
    };

    setAnswers(updatedAnswers);

    await updateSessionAnswer(sessionId, currentIndex, answer);
  }

  function goNext() {
    if (!quiz) return;

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function goPrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  async function handleSubmit() {
    if (!quiz || !session) return;

    setIsSubmitting(true);

    try {
      let score = 0;

      quiz.questions.forEach((question, index) => {
        const answer = answers[index];

        if (question.type === "identification") {
          if (
            typeof answer === "string" &&
            answer.trim().toLowerCase() ===
              question.correctTextAnswer?.trim().toLowerCase()
          ) {
            score++;
          }

          return;
        }

        if (Number(answer) === question.correctAnswer) {
          score++;
        }
      });

      const completedSession = await completeSession(sessionId, score);

      sessionStorage.setItem(
        "lastResult",
        JSON.stringify({
          session: completedSession,
          quiz,
        })
      );

      router.replace(`/student/results/${sessionId}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentQuestion = quiz?.questions[currentIndex];
  const selectedAnswer = answers[currentIndex];
  const answeredCount = Object.keys(answers).length;

  const progress = quiz
    ? Math.round(((currentIndex + 1) / quiz.questions.length) * 100)
    : 0;

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
    tabWarnings,
    handleAnswer,
    goPrevious,
    goNext,
    handleSubmit,
  };
}