"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  approveSession,
  getQuizById,
  getQuizSessions,
  getTeacherQuizzes,
  rejectSession,
  updateSessionReportVisibility,
} from "@/lib/actions";
import {
  clearTeacherSession,
  getTeacherSession,
} from "@/lib/auth/teacher-session";
import { supabase } from "@/lib/supabase/client";
import type { Quiz, QuizSession, ReportVisibility } from "@/lib/shared/types";

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

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState("Teacher");

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [rawSessions, setRawSessions] = useState<QuizSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [openSessionId, setOpenSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const loadInitialData = useCallback(async () => {
    try {
      const teacherSession = await getTeacherSession();

      if (!teacherSession) {
        router.push("/teacher/login");
        return;
      }

      setTeacherId(teacherSession.user.id);
      setTeacherName(teacherSession.user.email ?? "Teacher");

      const [quizData, sessionData, teacherQuizzes] = await Promise.all([
        getQuizById(quizId),
        getQuizSessions(quizId),
        getTeacherQuizzes(teacherSession.user.id),
      ]);

      setQuiz(quizData);
      setRawSessions(sessionData);
      setQuizzes(teacherQuizzes);
      setLastUpdated(new Date());
      setNow(Date.now());
    } catch (error) {
      console.error("Teacher monitor load error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [quizId, router]);

  const loadSessionsOnly = useCallback(async () => {
    try {
      const sessionData = await getQuizSessions(quizId);

      setRawSessions(sessionData);
      setLastUpdated(new Date());
      setNow(Date.now());
    } catch (error) {
      console.error("Teacher monitor sessions load error:", error);
    }
  }, [quizId]);

useEffect(() => {
  const id = requestAnimationFrame(() => {
    void loadInitialData();
  });

  return () => cancelAnimationFrame(id);
}, [loadInitialData]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const channel = supabase
      .channel(`teacher-monitor-${quizId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sessions",
          filter: `quiz_id=eq.${quizId}`,
        },
        () => {
          void loadSessionsOnly();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_events",
        },
        () => {
          void loadSessionsOnly();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [quizId, autoRefresh, loadSessionsOnly]);

  const sessions = useMemo(
    () =>
      rawSessions.map((session) => {
        if (!quiz?.timeLimitMinutes) return session;
        if (session.status === "completed" || session.status === "timed-out") {
          return session;
        }
        if (!session.startedAt) return session;

        const startedAtMs = new Date(session.startedAt).getTime();

        if (Number.isNaN(startedAtMs)) return session;

        const expiresAtMs = startedAtMs + quiz.timeLimitMinutes * 60 * 1000;

        if (now < expiresAtMs) return session;

        return {
          ...session,
          status: "timed-out" as QuizSession["status"],
          completedAt: new Date(expiresAtMs),
        };
      }),
    [rawSessions, quiz, now],
  );

  function goBack() {
    router.push("/teacher/dashboard");
  }

  function goDashboard() {
    router.push("/teacher/dashboard");
  }

  function goDrafts() {
    router.push("/teacher/drafts");
  }

  function goNewQuiz() {
    router.push("/teacher/dashboard?create=true");
  }

  function goMonitorQuiz(id: string) {
    router.push(`/teacher/quiz/${id}/monitor`);
  }

  function logout() {
    clearTeacherSession();
    router.push("/teacher/login");
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

    setRawSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? updatedSession : session,
      ),
    );
  }

  async function handleRejectSession(sessionId: string) {
    const updatedSession = await rejectSession(sessionId);

    setRawSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? updatedSession : session,
      ),
    );
  }

  async function handleBulkUpdateReportVisibility(
    visibility: ReportVisibility,
  ) {
    const approved = sessions.filter(
      (session) => session.approvalStatus === "approved",
    );

    const updatedSessions = await Promise.all(
      approved.map((session) =>
        updateSessionReportVisibility(session.id, visibility),
      ),
    );

    setRawSessions((prev) =>
      prev.map((session) => {
        const updated = updatedSessions.find((item) => item.id === session.id);
        return updated ?? session;
      }),
    );
  }

  const pendingRequests = useMemo(
    () => sessions.filter((session) => session.approvalStatus === "pending"),
    [sessions],
  );

  const approvedSessions = useMemo(
    () => sessions.filter((session) => session.approvalStatus === "approved"),
    [sessions],
  );

  const inProgress = useMemo(
    () =>
      approvedSessions.filter(
        (session) => session.status === "in-progress" && !session.completedAt,
      ),
    [approvedSessions],
  );

  const completed = useMemo(
    () =>
      approvedSessions.filter(
        (session) =>
          session.status === "completed" ||
          session.status === "timed-out" ||
          !!session.completedAt,
      ),
    [approvedSessions],
  );

  const suspicious = useMemo(
    () =>
      approvedSessions.filter((session) =>
        session.events.some((event) => VIOLATION_TYPES.includes(event.type)),
      ),
    [approvedSessions],
  );

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === openSessionId),
    [sessions, openSessionId],
  );

  const reportVisibilityState: ReportVisibility | "mixed" = useMemo(() => {
    if (approvedSessions.length === 0) return "locked";

    if (
      approvedSessions.every((session) => session.reportVisibility === "locked")
    ) {
      return "locked";
    }

    if (
      approvedSessions.every(
        (session) => session.reportVisibility === "summary",
      )
    ) {
      return "summary";
    }

    if (
      approvedSessions.every((session) => session.reportVisibility === "full")
    ) {
      return "full";
    }

    return "mixed";
  }, [approvedSessions]);

  return {
    quiz,
    quizzes,
    sessions,

    pendingRequests,
    approvedSessions,
    inProgress,
    completed,
    suspicious,

    selectedSession,
    reportVisibilityState,

    teacherId,
    teacherName,

    isLoading,
    autoRefresh,
    lastUpdated,

    openSessionId,
    sidebarOpen,

    loadData: loadInitialData,

    goBack,
    goDashboard,
    goDrafts,
    goNewQuiz,
    goMonitorQuiz,

    logout,
    toggleAutoRefresh,
    formatTime,

    handleApproveSession,
    handleRejectSession,
    handleBulkUpdateReportVisibility,

    setOpenSessionId,
    setSidebarOpen,
  };
}