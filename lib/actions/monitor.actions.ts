"use server";

import { supabase } from "@/lib/supabase/client";
import { getSessionByIdService } from "@/lib/services/session.service";
import type {
  Quiz,
  QuizSession,
  ReportVisibility,
  SessionEvent,
  SessionEventType,
} from "@/lib/shared/types";

type SessionEventRow = {
  type: SessionEventType;
  timestamp: string;
  description: string | null;
  duration_seconds: number | null;
};

type SessionRow = {
  id: string;
  quiz_id: string;
  student_name: string;
  student_id: string;
  started_at: string;
  completed_at: string | null;
  current_question: number;
  answers: Record<string, number | string> | null;
  tab_switches: number;
  status: QuizSession["status"];
  approval_status: QuizSession["approvalStatus"];
  report_visibility: ReportVisibility;
  score: number | null;
  quiz_snapshot?: Quiz | null;
  session_events?: SessionEventRow[];
};

function mapSessionEvent(row: SessionEventRow): SessionEvent {
  return {
    type: row.type,
    timestamp: new Date(row.timestamp),
    description: row.description || undefined,
    durationSeconds: row.duration_seconds ?? undefined,
  };
}

function mapSessionRow(row: SessionRow): QuizSession {
  return {
    id: row.id,
    quizId: row.quiz_id,
    studentName: row.student_name,
    studentId: row.student_id,
    quizSnapshot: row.quiz_snapshot ?? undefined,
    startedAt: new Date(row.started_at),
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    currentQuestion: row.current_question,
    answers: row.answers || {},
    tabSwitches: row.tab_switches,
    events:
      row.session_events
        ?.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )
        .map(mapSessionEvent) || [],
    status: row.status,
    approvalStatus: row.approval_status,
    reportVisibility: row.report_visibility,
    score: row.score ?? undefined,
  };
}

function countEvents(events: SessionEvent[], type: SessionEventType) {
  return events.filter((event) => event.type === type).length;
}

export async function getQuizSessions(quizId: string): Promise<QuizSession[]> {
  const { data, error } = await supabase
    .from("sessions")
    .select(
      `
      id,
      quiz_id,
      student_name,
      student_id,
      started_at,
      completed_at,
      current_question,
      answers,
      tab_switches,
      status,
      approval_status,
      report_visibility,
      score,
      quiz_snapshot,
      session_events (
        type,
        timestamp,
        description,
        duration_seconds
      )
    `,
    )
    .eq("quiz_id", quizId)
    .order("started_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data || []) as SessionRow[]).map(mapSessionRow);
}

export async function approveSession(sessionId: string): Promise<QuizSession> {
  const { error } = await supabase
    .from("sessions")
    .update({ approval_status: "approved" })
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  const { error: eventError } = await supabase.from("session_events").insert({
    session_id: sessionId,
    type: "approved",
    description: "Teacher approved the join request.",
  });

  if (eventError) {
    throw new Error(eventError.message);
  }

  const session = await getSessionByIdService(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  return session;
}

export async function rejectSession(sessionId: string): Promise<QuizSession> {
  const { error } = await supabase
    .from("sessions")
    .update({ approval_status: "rejected" })
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  const { error: eventError } = await supabase.from("session_events").insert({
    session_id: sessionId,
    type: "rejected",
    description: "Teacher rejected the join request.",
  });

  if (eventError) {
    throw new Error(eventError.message);
  }

  const session = await getSessionByIdService(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  return session;
}

export async function getSessionViolations(sessionId: string) {
  const session = await getSessionByIdService(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  const tabLeft = countEvents(session.events, "tab-left");
  const fullscreenExit = countEvents(session.events, "fullscreen-exit");
  const copyAttempt = countEvents(session.events, "copy-attempt");
  const pasteAttempt = countEvents(session.events, "paste-attempt");

  return {
    tabLeft,
    fullscreenExit,
    copyAttempt,
    pasteAttempt,
    total: tabLeft + fullscreenExit + copyAttempt + pasteAttempt,
  };
}
