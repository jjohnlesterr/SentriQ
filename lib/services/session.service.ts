import { supabase } from "@/lib/supabase/client";
import type {
  Question,
  Quiz,
  QuizSession,
  ReportVisibility,
  SessionEvent,
  SessionEventType,
} from "@/lib/shared/types";

const JOIN_REQUEST_TIMEOUT_MS = 10 * 60 * 1000;

function isExpiredPendingRequest(startedAt: Date | string) {
  return Date.now() - new Date(startedAt).getTime() >= JOIN_REQUEST_TIMEOUT_MS;
}

type QuestionRow = {
  id: string;
  quiz_id: string;
  type: Question["type"];
  text: string;
  options: string[];
  correct_answer: number;
  correct_text_answer: string;
  position: number;
};

type QuizRow = {
  id: string;
  title: string;
  description: string;
  code: string;
  created_by: string;
  published: boolean;
  status: "draft" | "published";
  created_at: string;
  time_limit_minutes?: number | null;
  join_locked?: boolean | null;
  questions?: QuestionRow[];
};

type SessionEventRow = {
  id: string;
  session_id: string;
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
  timed_out_at: string | null;
  current_question: number;
  answers: Record<string, number | string>;
  tab_switches: number;
  status: QuizSession["status"];
  approval_status: QuizSession["approvalStatus"];
  report_visibility: ReportVisibility;
  score: number | null;
  quiz_snapshot?: Quiz | null;
  session_events?: SessionEventRow[];
};

function isClosedSession(status: QuizSession["status"]) {
  return (
    status === "completed" || status === "timed-out" || status === "abandoned"
  );
}

function mapQuestionRow(row: QuestionRow): Question {
  return {
    id: row.id,
    type: row.type,
    text: row.text,
    options: row.options || [],
    correctAnswer: row.correct_answer,
    correctTextAnswer: row.correct_text_answer,
  };
}

function mapQuizRow(row: QuizRow): Quiz {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    code: row.code,
    createdBy: row.created_by,
    published: row.published,
    status: row.status,
    createdAt: new Date(row.created_at),
    timeLimitMinutes: row.time_limit_minutes ?? null,
    joinLocked: row.join_locked ?? false,
    questions:
      row.questions
        ?.sort((a, b) => a.position - b.position)
        .map(mapQuestionRow) || [],
  };
}

function mapEventRow(row: SessionEventRow): SessionEvent {
  return {
    type: row.type,
    timestamp: new Date(row.timestamp),
    description: row.description || undefined,
    durationSeconds: row.duration_seconds || undefined,
  };
}

function createQuizSnapshot(quiz: QuizRow): Quiz {
  return mapQuizRow({
    ...quiz,
    questions: [...(quiz.questions || [])],
  });
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
    timedOutAt: row.timed_out_at ? new Date(row.timed_out_at) : undefined,
    currentQuestion: row.current_question,
    answers: row.answers || {},
    tabSwitches: row.tab_switches,
    events:
      row.session_events
        ?.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )
        .map(mapEventRow) || [],
    status: row.status,
    approvalStatus: row.approval_status,
    reportVisibility: row.report_visibility,
    score: row.score ?? undefined,
  };
}

async function getSessionWithEvents(sessionId: string): Promise<QuizSession> {
  const { data, error } = await supabase
    .from("sessions")
    .select("*, session_events(*)")
    .eq("id", sessionId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapSessionRow(data);
}

export async function joinQuizService(
  studentName: string,
  quizCode: string,
): Promise<{ session: QuizSession; quiz: Quiz }> {
  const normalizedCode = quizCode.replace(/\s/g, "").toUpperCase();

  const { data: quizData, error: quizError } = await supabase
    .from("quizzes")
    .select("*, questions(*)")
    .eq("code", normalizedCode)
    .eq("published", true)
    .maybeSingle();

  if (quizError) {
    throw new Error(quizError.message);
  }

  if (!quizData) {
    throw new Error("Quiz code not found or quiz not published");
  }

  const quiz = mapQuizRow(quizData);

  if (quiz.joinLocked) {
    throw new Error("This quiz is no longer accepting new participants.");
  }

  const quizSnapshot = createQuizSnapshot(quizData);
  const studentId = crypto.randomUUID();

  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .insert({
      quiz_id: quizData.id,
      student_name: studentName,
      student_id: studentId,
      current_question: 0,
      answers: {},
      tab_switches: 0,
      status: "in-progress",
      approval_status: "pending",
      report_visibility: "locked",
      quiz_snapshot: quizSnapshot,
      last_seen_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { error: eventError } = await supabase.from("session_events").insert({
    session_id: sessionData.id,
    type: "join-requested",
    description: `${studentName} requested to join the quiz.`,
  });

  if (eventError) {
    throw new Error(eventError.message);
  }

  const session = await getSessionWithEvents(sessionData.id);

  return {
    session,
    quiz,
  };
}

export async function cancelJoinRequestService(
  sessionId: string,
): Promise<void> {
  const session = await getSessionByIdService(sessionId);

  if (!session) return;

  if (session.approvalStatus !== "pending") {
    throw new Error("Only pending join requests can be cancelled.");
  }

  const { error: eventsError } = await supabase
    .from("session_events")
    .delete()
    .eq("session_id", sessionId);

  if (eventsError) {
    throw new Error(eventsError.message);
  }

  const { error: sessionError } = await supabase
    .from("sessions")
    .delete()
    .eq("id", sessionId);

  if (sessionError) {
    throw new Error(sessionError.message);
  }
}

export async function expirePendingJoinRequestService(sessionId: string) {
  const session = await getSessionByIdService(sessionId);

  if (!session) return null;
  if (session.approvalStatus !== "pending") return session;
  if (!isExpiredPendingRequest(session.startedAt)) return session;

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("sessions")
    .update({
      approval_status: "rejected",
      status: "abandoned",
      completed_at: now,
    })
    .eq("id", sessionId)
    .eq("approval_status", "pending");

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("session_events").insert({
    session_id: sessionId,
    type: "rejected",
    description:
      "Join request automatically declined after waiting for more than 10 minutes.",
  });

  return getSessionWithEvents(sessionId);
}

export async function getSessionByIdService(
  sessionId: string,
): Promise<QuizSession | null> {
  const { data, error } = await supabase
    .from("sessions")
    .select("*, session_events(*)")
    .eq("id", sessionId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  return mapSessionRow(data);
}

export async function recordSessionEventService(
  sessionId: string,
  event: {
    type: SessionEventType;
    description?: string;
    durationSeconds?: number;
  },
): Promise<QuizSession> {
  const session = await getSessionByIdService(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.approvalStatus !== "approved") {
    return session;
  }

  if (isClosedSession(session.status)) {
    return session;
  }

  const { error: eventError } = await supabase.from("session_events").insert({
    session_id: sessionId,
    type: event.type,
    description: event.description,
    duration_seconds: event.durationSeconds,
  });

  if (eventError) {
    throw new Error(eventError.message);
  }

  if (event.type === "tab-left") {
    const { error: updateError } = await supabase
      .from("sessions")
      .update({
        tab_switches: session.tabSwitches + 1,
      })
      .eq("id", sessionId)
      .eq("status", "in-progress");

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  return getSessionWithEvents(sessionId);
}

function getAnswerEventDescription(
  questionIndex: number,
  answer: number | string,
) {
  const answerLabel =
    typeof answer === "number"
      ? `Selected option ${answer + 1}`
      : `Answered: ${answer}`;

  return `Question ${questionIndex + 1} • ${answerLabel}`;
}

export async function updateSessionAnswerService(
  sessionId: string,
  questionIndex: number,
  answer: number | string,
): Promise<QuizSession> {
  const session = await getSessionByIdService(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.approvalStatus !== "approved") {
    throw new Error("Session is not approved yet");
  }

  if (isClosedSession(session.status)) {
    return session;
  }

  const updatedAnswers = {
    ...session.answers,
    [questionIndex]: answer,
  };

  const { error } = await supabase
    .from("sessions")
    .update({
      answers: updatedAnswers,
      current_question: questionIndex,
    })
    .eq("id", sessionId)
    .eq("status", "in-progress");

  if (error) {
    throw new Error(error.message);
  }

  const { error: eventError } = await supabase.from("session_events").insert({
    session_id: sessionId,
    type: "answered-question",
    description: getAnswerEventDescription(questionIndex, answer),
  });

  if (eventError) {
    throw new Error(eventError.message);
  }

  return getSessionWithEvents(sessionId);
}

export async function updateSessionReportVisibilityService(
  sessionId: string,
  visibility: ReportVisibility,
): Promise<QuizSession> {
  const { error } = await supabase
    .from("sessions")
    .update({
      report_visibility: visibility,
    })
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  return getSessionWithEvents(sessionId);
}

export async function completeSessionService(
  sessionId: string,
  submittedScore?: number,
): Promise<QuizSession> {
  const session = await getSessionByIdService(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.approvalStatus !== "approved") {
    throw new Error("Session is not approved yet");
  }

  if (isClosedSession(session.status)) {
    return session;
  }

  const { error: sessionError } = await supabase
    .from("sessions")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      score: submittedScore ?? 0,
    })
    .eq("id", sessionId)
    .eq("status", "in-progress");

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { error: eventError } = await supabase.from("session_events").insert({
    session_id: sessionId,
    type: "completed",
    description: "Student submitted the quiz.",
  });

  if (eventError) {
    throw new Error(eventError.message);
  }

  return getSessionWithEvents(sessionId);
}

export async function expireSessionService(
  sessionId: string,
  submittedScore?: number,
): Promise<QuizSession> {
  const session = await getSessionByIdService(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.approvalStatus !== "approved") {
    throw new Error("Session is not approved yet");
  }

  if (isClosedSession(session.status)) {
    return session;
  }

  const now = new Date().toISOString();

  const { error: sessionError } = await supabase
    .from("sessions")
    .update({
      status: "timed-out",
      completed_at: now,
      timed_out_at: now,
      score: submittedScore ?? 0,
    })
    .eq("id", sessionId)
    .eq("status", "in-progress");

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { error: eventError } = await supabase.from("session_events").insert({
    session_id: sessionId,
    type: "time-expired",
    description: "Time expired. Answers were automatically saved.",
  });

  if (eventError) {
    throw new Error(eventError.message);
  }

  return getSessionWithEvents(sessionId);
}

export async function updateSessionHeartbeatService(
  sessionId: string,
): Promise<void> {
  const { error } = await supabase
    .from("sessions")
    .update({
      last_seen_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .eq("status", "in-progress");

  if (error) {
    throw new Error(error.message);
  }
}

export async function expirePendingJoinRequestsService() {
  const tenMinutesAgo = new Date(
    Date.now() - JOIN_REQUEST_TIMEOUT_MS,
  ).toISOString();

  const { data: expiredRequests, error: selectError } = await supabase
    .from("sessions")
    .select("id")
    .eq("approval_status", "pending")
    .lt("started_at", tenMinutesAgo);

  if (selectError) {
    throw new Error(selectError.message);
  }

  if (!expiredRequests?.length) return;

  const now = new Date().toISOString();
  const sessionIds = expiredRequests.map((session) => session.id);

  const { error: updateError } = await supabase
    .from("sessions")
    .update({
      approval_status: "rejected",
      status: "abandoned",
      completed_at: now,
    })
    .in("id", sessionIds)
    .eq("approval_status", "pending");

  if (updateError) {
    throw new Error(updateError.message);
  }

  const { error: eventError } = await supabase.from("session_events").insert(
    sessionIds.map((sessionId) => ({
      session_id: sessionId,
      type: "rejected",
      description:
        "Join request automatically declined after waiting for more than 10 minutes.",
    })),
  );

  if (eventError) {
    throw new Error(eventError.message);
  }
}

export async function cleanupInactiveSessionsService() {
  await expirePendingJoinRequestsService();

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const now = new Date().toISOString();

  const { data: inactiveSessions, error: selectError } = await supabase
    .from("sessions")
    .select("id")
    .eq("status", "in-progress")
    .eq("approval_status", "approved")
    .lt("last_seen_at", fiveMinutesAgo);

  if (selectError) {
    throw new Error(selectError.message);
  }

  if (!inactiveSessions?.length) {
    return;
  }

  const sessionIds = inactiveSessions.map((session) => session.id);

  const { error: sessionError } = await supabase
    .from("sessions")
    .update({
      status: "abandoned",
      completed_at: now,
      timed_out_at: null,
    })
    .in("id", sessionIds)
    .eq("status", "in-progress")
    .eq("approval_status", "approved");

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { error: eventError } = await supabase.from("session_events").insert(
    sessionIds.map((sessionId) => ({
      session_id: sessionId,
      type: "abandoned",
      description:
        "Student was marked abandoned after being inactive for more than 5 minutes.",
    })),
  );

  if (eventError) {
    throw new Error(eventError.message);
  }
}