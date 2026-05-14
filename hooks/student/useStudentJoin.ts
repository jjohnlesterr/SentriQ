"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { joinQuiz } from "@/lib/actions";
import { supabase } from "@/lib/supabase/client";

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

    const channel = supabase
      .channel(`student-join-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          const updatedSession = payload.new as {
            id: string;
            approval_status: "pending" | "approved" | "rejected";
          };

          if (updatedSession.approval_status === "approved") {
            router.push(`/student/quiz/${updatedSession.id}`);
            return;
          }

          if (updatedSession.approval_status === "rejected") {
            setIsWaitingApproval(false);
            setError("Your join request was rejected by the teacher.");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, isWaitingApproval, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const trimmedName = studentName.trim();
    const trimmedCode = quizCode.replace(/\s/g, "").toUpperCase();

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