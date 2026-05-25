"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getQuizById, getTeacherQuizzes } from "@/lib/actions";
import { getTeacherSession } from "@/lib/auth/teacher-session";
import type { Question, Quiz } from "@/lib/shared/types";

type Params = {
  quizId: string;
};

function createSnapshot(title: string, description: string, questions: Question[]) {
  return JSON.stringify({
    title: title.trim(),
    description: description.trim(),
    questions,
  });
}

export function useQuizPersistence({ quizId }: Params) {
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const savedSnapshotRef = useRef("");

  const currentSnapshot = useMemo(
    () => createSnapshot(title, description, questions),
    [title, description, questions]
  );

  const isDirty = savedSnapshotRef.current !== "" && currentSnapshot !== savedSnapshotRef.current;

  const markClean = useCallback(() => {
    savedSnapshotRef.current = createSnapshot(title, description, questions);
  }, [title, description, questions]);

  const refreshTeacherQuizzes = useCallback(async () => {
    const session = await getTeacherSession();

    if (!session) {
      setQuizzes([]);
      router.push("/teacher/login");
      return;
    }

    const teacherQuizzes = await getTeacherQuizzes(session.user.id);
    setQuizzes(teacherQuizzes);
  }, [router]);

  const goToDrafts = useCallback(() => {
    router.push("/teacher/drafts");
  }, [router]);

  const goToDashboard = useCallback(() => {
    router.push("/teacher/dashboard");
  }, [router]);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const session = await getTeacherSession();

        if (!session) {
          router.push("/teacher/login");
          return;
        }

        const [quizData, teacherQuizzes] = await Promise.all([
          getQuizById(quizId),
          getTeacherQuizzes(session.user.id),
        ]);

        if (!quizData) {
          router.push("/teacher/dashboard");
          return;
        }

        const normalizedQuestions = quizData.questions.map((question) => ({
          ...question,
          type: question.type || "multiple_choice",
          correctTextAnswer: question.correctTextAnswer || "",
        }));

        setQuiz(quizData);
        setQuizzes(teacherQuizzes);
        setTitle(quizData.title);
        setDescription(quizData.description);
        setQuestions(normalizedQuestions);

        savedSnapshotRef.current = createSnapshot(
          quizData.title,
          quizData.description,
          normalizedQuestions
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
    isDirty,

    setQuiz,
    setQuizzes,
    setTitle,
    setDescription,
    setQuestions,

    markClean,
    refreshTeacherQuizzes,
    goToDrafts,
    goToDashboard,
  };
}