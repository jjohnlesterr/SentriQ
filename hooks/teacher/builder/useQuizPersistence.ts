"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getQuizById, getTeacherQuizzes } from "@/lib/actions";
import { getTeacherSession } from "@/lib/auth/teacher-session";
import type { Question, Quiz } from "@/lib/shared/types";

type Params = {
  quizId: string;
};

function createSnapshot(
  title: string,
  description: string,
  questions: Question[],
  timeLimitMinutes: number | null,
) {
  return JSON.stringify({
    title: title.trim(),
    description: description.trim(),
    questions,
    timeLimitMinutes,
  });
}

export function useQuizPersistence({ quizId }: Params) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [isFreshlyCreatedDraft, setIsFreshlyCreatedDraft] = useState(false);

  const currentSnapshot = useMemo(
    () => createSnapshot(title, description, questions, timeLimitMinutes),
    [title, description, questions, timeLimitMinutes],
  );

  const isDirty = savedSnapshot !== "" && currentSnapshot !== savedSnapshot;

  const markClean = useCallback(() => {
    setSavedSnapshot(
      createSnapshot(title, description, questions, timeLimitMinutes),
    );

    setIsFreshlyCreatedDraft(false);
  }, [title, description, questions, timeLimitMinutes]);

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
        setTimeLimitMinutes(quizData.timeLimitMinutes ?? null);
        setSavedSnapshot(
          createSnapshot(
            quizData.title,
            quizData.description,
            normalizedQuestions,
            quizData.timeLimitMinutes ?? null,
          ),
        );
        setIsFreshlyCreatedDraft(searchParams.get("fresh") === "1");
      } finally {
        setIsLoading(false);
      }
    }

    void loadQuiz();
  }, [quizId, router, searchParams]);

  return {
    quiz,
    quizzes,
    title,
    description,
    questions,
    timeLimitMinutes,
    isLoading,
    isDirty,
    isFreshlyCreatedDraft,

    setQuiz,
    setQuizzes,
    setTitle,
    setDescription,
    setQuestions,
    setTimeLimitMinutes,

    markClean,
    refreshTeacherQuizzes,
    goToDrafts,
    goToDashboard,
  };
}
