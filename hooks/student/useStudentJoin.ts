"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { cancelJoinRequest, getSessionById, joinQuiz } from "@/lib/actions";
import { supabase } from "@/lib/supabase/client";
import { VALIDATION_LIMITS } from "@/lib/validations/constants";

type UseStudentJoinParams = {
  onApproved?: () => void;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function isAutoDeclined(sessionData: Awaited<ReturnType<typeof getSessionById>>) {
  return sessionData?.events.some((event) =>
    event.description?.toLowerCase().includes("automatically declined"),
  );
}

export function useStudentJoin({ onApproved }: UseStudentJoinParams = {}) {
  const router = useRouter();

  const [studentName, setStudentName] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingApproval, setIsWaitingApproval] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId || !isWaitingApproval) return;

    const activeSessionId = sessionId;
    let cancelled = false;

    async function checkApprovalStatus() {
      const sessionData = await getSessionById(activeSessionId);

      if (!sessionData || cancelled) return;

      if (sessionData.approvalStatus === "approved") {
        setIsWaitingApproval(false);
        onApproved?.();
        router.replace(`/student/quiz/${sessionData.id}`);
        return;
      }

      if (sessionData.approvalStatus === "rejected") {
        setIsWaitingApproval(false);

        setError(
          isAutoDeclined(sessionData)
            ? "Your join request expired after 10 minutes without approval."
            : "Your join request was rejected by the teacher.",
        );
      }
    }

    void checkApprovalStatus();

    const channel = supabase
      .channel(`student-join-${activeSessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${activeSessionId}`,
        },
        () => {
          void checkApprovalStatus();
        },
      )
      .subscribe();

    const polling = window.setInterval(() => {
      void checkApprovalStatus();
    }, 1500);

    return () => {
      cancelled = true;
      window.clearInterval(polling);
      void supabase.removeChannel(channel);
    };
  }, [sessionId, isWaitingApproval, router, onApproved]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const trimmedName = studentName.trim();
    const trimmedCode = quizCode.replace(/\s/g, "").toUpperCase();

    if (!trimmedName || !trimmedCode) {
      setError("Please enter your name and quiz code.");
      return;
    }

    if (trimmedName.length < VALIDATION_LIMITS.STUDENT_NAME_MIN) {
      setError(
        `Name must be at least ${VALIDATION_LIMITS.STUDENT_NAME_MIN} characters.`,
      );
      return;
    }

    if (trimmedName.length > VALIDATION_LIMITS.STUDENT_NAME_MAX) {
      setError(
        `Name must not exceed ${VALIDATION_LIMITS.STUDENT_NAME_MAX} characters.`,
      );
      return;
    }

    setIsLoading(true);

    try {
      const { session, quiz } = await joinQuiz(trimmedName, trimmedCode);

      sessionStorage.setItem("sessionId", session.id);
      sessionStorage.setItem("studentName", trimmedName);
      sessionStorage.setItem("quizId", quiz.id);

      setStudentName(trimmedName);
      setQuizCode(trimmedCode);
      setSessionId(session.id);

      if (session.approvalStatus === "approved") {
        setIsWaitingApproval(false);
        onApproved?.();
        router.replace(`/student/quiz/${session.id}`);
        return;
      }

      setIsWaitingApproval(true);
    } catch (error) {
      setError(
        getErrorMessage(error, "Invalid quiz code or quiz is not published."),
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function resetRequest() {
    const activeSessionId = sessionId;

    if (activeSessionId) {
      try {
        await cancelJoinRequest(activeSessionId);
      } catch (error) {
        console.error("Failed to cancel join request:", error);
      }
    }

    sessionStorage.removeItem("sessionId");
    sessionStorage.removeItem("studentName");
    sessionStorage.removeItem("quizId");

    setSessionId(null);
    setIsWaitingApproval(false);
    setError("");
  }

  function goBack() {
    router.push("/");
  }

  return {
    studentName,
    quizCode,
    isLoading,
    isWaitingApproval,
    error,

    setStudentName,
    setQuizCode,

    handleSubmit,
    resetRequest,
    goBack,
  };
}