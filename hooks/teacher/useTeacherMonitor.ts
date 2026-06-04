"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  approveSession,
  cleanupInactiveSessions,
  getQuizById,
  getQuizSessions,
  getTeacherQuizzes,
  rejectSession,
  updateQuizJoinLocked,
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

function wasApprovedBefore(session: QuizSession) {
  return session.events.some((event) => event.type === "approved");
}

function isKicked(session: QuizSession) {
  return session.approvalStatus === "rejected" && wasApprovedBefore(session);
}

function sortKickedLast(items: QuizSession[]) {
  return [...items].sort((a, b) => {
    if (isKicked(a) && !isKicked(b)) return 1;
    if (!isKicked(a) && isKicked(b)) return -1;

    return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
  });
}

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

await cleanupInactiveSessions();

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
    await cleanupInactiveSessions();

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
        if (isKicked(session)) return session;
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

  async function handleToggleJoining() {
    if (!quiz) return;

    try {
      const updatedQuiz = await updateQuizJoinLocked(quiz.id, !quiz.joinLocked);

      if (!updatedQuiz) {
        console.error("Joining update returned no quiz.");
        return;
      }

      setQuiz(updatedQuiz);

      setQuizzes((prev) =>
        prev.map((item) => (item.id === updatedQuiz.id ? updatedQuiz : item)),
      );
    } catch (error) {
      console.error("Failed to toggle joining:", error);
    }
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

  const approvedOnly = useMemo(
    () => sessions.filter((session) => session.approvalStatus === "approved"),
    [sessions],
  );

  const kickedSessions = useMemo(
    () => sessions.filter((session) => isKicked(session)),
    [sessions],
  );

  const approvedSessions = useMemo(
    () => sortKickedLast([...approvedOnly, ...kickedSessions]),
    [approvedOnly, kickedSessions],
  );

  const inProgress = useMemo(
    () =>
      approvedOnly.filter(
        (session) => session.status === "in-progress" && !session.completedAt,
      ),
    [approvedOnly],
  );

  const completed = useMemo(
    () =>
      approvedOnly.filter(
        (session) =>
          session.status === "completed" ||
          session.status === "timed-out" ||
          !!session.completedAt,
      ),
    [approvedOnly],
  );

  const suspicious = useMemo(
    () =>
      sortKickedLast(
        [...approvedOnly, ...kickedSessions].filter((session) =>
          session.events.some((event) => VIOLATION_TYPES.includes(event.type)),
        ),
      ),
    [approvedOnly, kickedSessions],
  );

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === openSessionId),
    [sessions, openSessionId],
  );

  const reportVisibilityState: ReportVisibility | "mixed" = useMemo(() => {
    if (approvedOnly.length === 0) return "locked";

    if (
      approvedOnly.every((session) => session.reportVisibility === "locked")
    ) {
      return "locked";
    }

    if (
      approvedOnly.every((session) => session.reportVisibility === "summary")
    ) {
      return "summary";
    }

    if (approvedOnly.every((session) => session.reportVisibility === "full")) {
      return "full";
    }

    return "mixed";
  }, [approvedOnly]);

  return {
    quiz,
    quizzes,
    sessions,

    pendingRequests,
    approvedSessions,
    inProgress,
    completed,
    suspicious,
    kickedSessions,

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

    handleToggleJoining,
    handleApproveSession,
    handleRejectSession,
    handleBulkUpdateReportVisibility,

    setOpenSessionId,
    setSidebarOpen,
  };
}
