"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  approveSession,
  getQuizById,
  getQuizSessions,
  rejectSession,
  updateSessionReportVisibility,
} from "@/lib/actions";
import type { Quiz, QuizSession, ReportVisibility } from "@/lib/types";

const VIOLATION_TYPES = [
  "tab-left",
  "fullscreen-exit",
  "copy-attempt",
  "paste-attempt",
];

export function useTeacherMonitor() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [openSessionId, setOpenSessionId] = useState<string | null>(null);

  async function loadData() {
    try {
      const quizData = await getQuizById(quizId);
      const sessionData = await getQuizSessions(quizId);

      setQuiz(quizData);
      setSessions(sessionData);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [quizId]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadData();
    }, 3000);

    return () => clearInterval(interval);
  }, [quizId, autoRefresh]);

  function goBack() {
    router.push("/teacher/dashboard");
  }

  function toggleAutoRefresh() {
    setAutoRefresh((prev) => !prev);
  }

  function formatTime(value: Date | string | undefined) {
    if (!value) return "—";
    return new Date(value).toLocaleTimeString();
  }

  async function handleApproveSession(sessionId: string) {
    const updatedSession = await approveSession(sessionId);

    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? updatedSession : session
      )
    );
  }

  async function handleRejectSession(sessionId: string) {
    const updatedSession = await rejectSession(sessionId);

    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? updatedSession : session
      )
    );
  }

  async function handleUpdateReportVisibility(
    sessionId: string,
    visibility: ReportVisibility
  ) {
    const updatedSession = await updateSessionReportVisibility(
      sessionId,
      visibility
    );

    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? updatedSession : session
      )
    );
  }

  async function handleBulkUpdateReportVisibility(
    visibility: ReportVisibility
  ) {
    const approved = sessions.filter(
      (session) => session.approvalStatus === "approved"
    );

    const updatedSessions = await Promise.all(
      approved.map((session) =>
        updateSessionReportVisibility(session.id, visibility)
      )
    );

    setSessions((prev) =>
      prev.map((session) => {
        const updated = updatedSessions.find(
          (item) => item.id === session.id
        );

        return updated ?? session;
      })
    );
  }

  const pendingRequests = sessions.filter(
    (session) => session.approvalStatus === "pending"
  );

  const approvedSessions = sessions.filter(
    (session) => session.approvalStatus === "approved"
  );

  const rejectedSessions = sessions.filter(
    (session) => session.approvalStatus === "rejected"
  );

  const inProgress = approvedSessions.filter(
    (session) => session.status === "in-progress"
  );

  const completed = approvedSessions.filter(
    (session) => session.status === "completed"
  );

  const suspicious = approvedSessions.filter((session) =>
    session.events.some((event) => VIOLATION_TYPES.includes(event.type))
  );

  const selectedSession = sessions.find(
    (session) => session.id === openSessionId
  );

  const reportVisibilityState: ReportVisibility | "mixed" =
    approvedSessions.length === 0
      ? "locked"
      : approvedSessions.every(
          (session) => session.reportVisibility === "locked"
        )
      ? "locked"
      : approvedSessions.every(
          (session) => session.reportVisibility === "summary"
        )
      ? "summary"
      : approvedSessions.every(
          (session) => session.reportVisibility === "full"
        )
      ? "full"
      : "mixed";

  return {
    quiz,
    sessions,
    pendingRequests,
    approvedSessions,
    rejectedSessions,
    inProgress,
    completed,
    suspicious,
    selectedSession,
    reportVisibilityState,

    isLoading,
    autoRefresh,
    lastUpdated,
    openSessionId,

    loadData,
    goBack,
    toggleAutoRefresh,
    formatTime,
    handleApproveSession,
    handleRejectSession,
    handleUpdateReportVisibility,
    handleBulkUpdateReportVisibility,
    setOpenSessionId,
  };
}