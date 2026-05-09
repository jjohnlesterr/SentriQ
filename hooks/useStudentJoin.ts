"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getSessionById, joinQuiz } from "@/lib/actions";

export function useStudentJoin() {
  const router = useRouter();

  const [studentName, setStudentName] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingApproval, setIsWaitingApproval] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId || !isWaitingApproval) return;

    const interval = setInterval(async () => {
      const session = await getSessionById(sessionId);

      if (!session) {
        clearInterval(interval);
        setIsWaitingApproval(false);
        setError("Join request was not found. Please try again.");
        return;
      }

      if (session.approvalStatus === "approved") {
        clearInterval(interval);
        router.push(`/student/quiz/${session.id}`);
        return;
      }

      if (session.approvalStatus === "rejected") {
        clearInterval(interval);
        setIsWaitingApproval(false);
        setError("Your join request was rejected by the teacher.");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [sessionId, isWaitingApproval, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const trimmedName = studentName.trim();
    const trimmedCode = quizCode.trim().toUpperCase();

    if (!trimmedName || !trimmedCode) {
      setError("Please enter your name and quiz code.");
      return;
    }

    setIsLoading(true);

    try {
      const { session, quiz } = await joinQuiz(trimmedName, trimmedCode);

      sessionStorage.setItem("sessionId", session.id);
      sessionStorage.setItem("studentName", trimmedName);
      sessionStorage.setItem("quizId", quiz.id);

      setQuizCode(trimmedCode);
      setSessionId(session.id);
      setIsWaitingApproval(true);
    } catch {
      setError("Invalid quiz code or quiz is not published.");
    } finally {
      setIsLoading(false);
    }
  }

  function resetRequest() {
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