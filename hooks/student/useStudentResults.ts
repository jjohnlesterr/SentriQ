"use client";

import { useEffect, useMemo, useState } from "react";

import { getQuizById, getSessionById } from "@/lib/actions";
import type { Quiz, QuizSession } from "@/lib/shared/types";

type SavedResult = {
  session: QuizSession;
  quiz: Quiz;
};

function getSavedResult(): SavedResult | null {
  const savedResult = sessionStorage.getItem("lastResult");

  if (!savedResult) return null;

  try {
    return JSON.parse(savedResult) as SavedResult;
  } catch {
    return null;
  }
}

export function useStudentResults(sessionId: string) {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const sessionData = await getSessionById(sessionId);

        if (!sessionData) {
          const saved = getSavedResult();

          if (saved) {
            setSession(saved.session);
            setQuiz(saved.quiz);
          }

          return;
        }

        const quizData = await getQuizById(sessionData.quizId);

        if (!quizData) {
          const saved = getSavedResult();

          if (saved) {
            setSession(saved.session);
            setQuiz(saved.quiz);
          }

          return;
        }

        setSession(sessionData);
        setQuiz(quizData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadResults();
  }, [sessionId]);

  const result = useMemo(() => {
    if (!session || !quiz) {
      return {
        score: 0,
        totalQuestions: 0,
        percentage: 0,
        passed: false,
      };
    }

    const score = session.score || 0;
    const totalQuestions = quiz.questions.length;
    const percentage =
      totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    return {
      score,
      totalQuestions,
      percentage,
      passed: percentage >= 70,
    };
  }, [session, quiz]);

  return {
    session,
    quiz,
    isLoading,
    ...result,
  };
}