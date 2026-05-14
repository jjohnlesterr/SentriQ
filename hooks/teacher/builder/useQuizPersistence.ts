"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getQuizById, getTeacherQuizzes } from "@/lib/actions";
import { getTeacherSession } from "@/lib/auth/teacher-session";
import type { Question, Quiz } from "@/lib/shared/types";

type Params = {
  quizId: string;
};

export function useQuizPersistence({ quizId }: Params) {
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTeacherQuizzes = useCallback(async () => {
    const session = getTeacherSession();

    if (!session) {
      setQuizzes([]);
      return;
    }

    const teacherQuizzes = await getTeacherQuizzes(session.id);
    setQuizzes(teacherQuizzes);
  }, []);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const session = getTeacherSession();

        if (!session) {
          router.push("/teacher/login");
          return;
        }

        const [quizData, teacherQuizzes] = await Promise.all([
          getQuizById(quizId),
          getTeacherQuizzes(session.id),
        ]);

        if (!quizData) {
          router.push("/teacher/dashboard");
          return;
        }

        setQuiz(quizData);
        setQuizzes(teacherQuizzes);
        setTitle(quizData.title);
        setDescription(quizData.description);

        setQuestions(
          quizData.questions.map((question) => ({
            ...question,
            type: question.type || "multiple_choice",
            correctTextAnswer: question.correctTextAnswer || "",
          }))
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadQuiz();
  }, [quizId, router]);

  return {
    quiz,
    quizzes,
    title,
    description,
    questions,
    isLoading,

    setQuiz,
    setQuizzes,
    setTitle,
    setDescription,
    setQuestions,

    refreshTeacherQuizzes,
  };
}