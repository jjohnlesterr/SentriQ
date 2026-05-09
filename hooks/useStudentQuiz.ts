"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  completeSession,
  getQuizById,
  getSessionById,
  recordSessionEvent,
  updateSessionAnswer,
} from "@/lib/actions";
import { calculateQuizScore } from "@/lib/scoring";
import type { Quiz, QuizSession } from "@/lib/types";

export function useStudentQuiz() {
  const router = useRouter();
  const params = useParams();

  const sessionId = params.id as string;
  const leftTabAtRef = useRef<number | null>(null);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [fullscreenExits, setFullscreenExits] = useState(0);
  const [copyAttempts, setCopyAttempts] = useState(0);
  const [pasteAttempts, setPasteAttempts] = useState(0);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);

  function syncViolationCounts(sessionData: QuizSession) {
    setTabWarnings(sessionData.tabSwitches || 0);
    setFullscreenExits(
      sessionData.events.filter((event) => event.type === "fullscreen-exit")
        .length
    );
    setCopyAttempts(
      sessionData.events.filter((event) => event.type === "copy-attempt")
        .length
    );
    setPasteAttempts(
      sessionData.events.filter((event) => event.type === "paste-attempt")
        .length
    );
  }

  async function addSessionEvent(
    type:
      | "tab-left"
      | "tab-returned"
      | "fullscreen-exit"
      | "copy-attempt"
      | "paste-attempt",
    description: string,
    durationSeconds?: number
  ) {
    const updatedSession = await recordSessionEvent(sessionId, {
      type,
      description,
      durationSeconds,
    });

    setSession(updatedSession);
    syncViolationCounts(updatedSession);
  }

  async function requestFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      setIsFullscreenActive(true);
    } catch {
      setIsFullscreenActive(false);

      await addSessionEvent(
        "fullscreen-exit",
        "Fullscreen request was blocked or cancelled."
      );
    }
  }

  async function loadQuizSession() {
    try {
      const sessionData = await getSessionById(sessionId);

      if (!sessionData) {
        router.replace("/");
        return;
      }

      setSession(sessionData);
      syncViolationCounts(sessionData);

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
      setIsFullscreenActive(!!document.fullscreenElement);
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
  }, [session, sessionId, router]);

  useEffect(() => {
    if (session?.approvalStatus !== "approved") return;

    requestFullscreen();
  }, [session?.approvalStatus, sessionId]);

  useEffect(() => {
    if (session?.approvalStatus !== "approved") return;

    function handleVisibilityChange() {
      if (document.hidden) {
        leftTabAtRef.current = Date.now();
        addSessionEvent("tab-left", "Student left the quiz tab.");
        return;
      }

      if (leftTabAtRef.current) {
        const durationSeconds = Math.round(
          (Date.now() - leftTabAtRef.current) / 1000
        );

        addSessionEvent(
          "tab-returned",
          `Student returned after ${durationSeconds} second${
            durationSeconds !== 1 ? "s" : ""
          }.`,
          durationSeconds
        );

        leftTabAtRef.current = null;
      }
    }

    function handleFullscreenChange() {
      const active = !!document.fullscreenElement;
      setIsFullscreenActive(active);

      if (!active) {
        addSessionEvent("fullscreen-exit", "Student exited fullscreen mode.");
      }
    }

    function handleCopy(event: ClipboardEvent) {
      event.preventDefault();

      const selectedText = window.getSelection()?.toString() || "";

      addSessionEvent(
        "copy-attempt",
        selectedText
          ? `Student attempted to copy: "${selectedText.slice(0, 80)}"`
          : "Student attempted to copy quiz content."
      );
    }

    function handlePaste(event: ClipboardEvent) {
      event.preventDefault();

      const pastedText = event.clipboardData?.getData("text") || "";

      addSessionEvent(
        "paste-attempt",
        pastedText
          ? `Student attempted to paste ${pastedText.length} character${
              pastedText.length !== 1 ? "s" : ""
            }.`
          : "Student attempted to paste content."
      );
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, [session?.approvalStatus, sessionId]);

  async function handleAnswer(answer: number | string) {
    if (!isFullscreenActive) return;

    const updatedAnswers = {
      ...answers,
      [currentIndex]: answer,
    };

    setAnswers(updatedAnswers);

    const updatedSession = await updateSessionAnswer(
      sessionId,
      currentIndex,
      answer
    );

    setSession(updatedSession);
  }

  function goNext() {
    if (!quiz || !isFullscreenActive) return;

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function goPrevious() {
    if (!isFullscreenActive) return;

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  async function handleSubmit() {
    if (!quiz || !session || !isFullscreenActive) return;

    setIsSubmitting(true);

    try {
      const score = calculateQuizScore(quiz, answers);
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
    fullscreenExits,
    copyAttempts,
    pasteAttempts,
    isFullscreenActive,
    requestFullscreen,
    handleAnswer,
    goPrevious,
    goNext,
    handleSubmit,
  };
}