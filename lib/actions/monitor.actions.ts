"use server";

import { supabase } from "@/lib/supabase/client";
import type { QuizSession } from "@/lib/shared/types";
import { getSessionByIdService } from "@/lib/services/session.service";

export async function getQuizSessions(
  quizId: string
): Promise<QuizSession[]> {
  const { data, error } = await supabase
    .from("sessions")
    .select("*, session_events(*)")
    .eq("quiz_id", quizId)
    .order("started_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((session) => ({
    id: session.id,
    quizId: session.quiz_id,
    studentName: session.student_name,
    studentId: session.student_id,
    startedAt: new Date(session.started_at),
    completedAt: session.completed_at
      ? new Date(session.completed_at)
      : undefined,
    currentQuestion: session.current_question,
    answers: session.answers || {},
    tabSwitches: session.tab_switches,
    events:
      session.session_events?.map((event: any) => ({
        type: event.type,
        timestamp: new Date(event.timestamp),
        description: event.description || undefined,
        durationSeconds: event.duration_seconds || undefined,
      })) || [],
    status: session.status,
    approvalStatus: session.approval_status,
    reportVisibility: session.report_visibility,
    score: session.score ?? undefined,
  }));
}

export async function approveSession(
  sessionId: string
): Promise<QuizSession> {
  const { error } = await supabase
    .from("sessions")
    .update({ approval_status: "approved" })
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("session_events").insert({
    session_id: sessionId,
    type: "approved",
    description: "Teacher approved the join request.",
  });

  const session = await getSessionByIdService(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  return session;
}

export async function rejectSession(
  sessionId: string
): Promise<QuizSession> {
  const { error } = await supabase
    .from("sessions")
    .update({ approval_status: "rejected" })
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("session_events").insert({
    session_id: sessionId,
    type: "rejected",
    description: "Teacher rejected the join request.",
  });

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

  const tabLeft = session.events.filter((event) => event.type === "tab-left").length;
  const fullscreenExit = session.events.filter((event) => event.type === "fullscreen-exit").length;
  const copyAttempt = session.events.filter((event) => event.type === "copy-attempt").length;
  const pasteAttempt = session.events.filter((event) => event.type === "paste-attempt").length;

  return {
    tabLeft,
    fullscreenExit,
    copyAttempt,
    pasteAttempt,
    total: tabLeft + fullscreenExit + copyAttempt + pasteAttempt,
  };
}