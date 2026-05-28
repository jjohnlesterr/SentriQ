import { supabase } from "@/lib/supabase/client";
import type {
  Question,
  Quiz,
  QuizSession,
  ReportVisibility,
  SessionEvent,
  SessionEventType,
} from "@/lib/shared/types";

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
  current_question: number;
  answers: Record<string, number | string>;
  tab_switches: number;
  status: QuizSession["status"];
  approval_status: QuizSession["approvalStatus"];
  report_visibility: ReportVisibility;
  score: number | null;
  session_events?: SessionEventRow[];
};

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

function mapSessionRow(row: SessionRow): QuizSession {
  return {
    id: row.id,
    quizId: row.quiz_id,
    studentName: row.student_name,
    studentId: row.student_id,
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

  const studentId = `student-${Date.now()}`;

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
    quiz: mapQuizRow(quizData),
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
      .eq("id", sessionId);

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
    .eq("id", sessionId);

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

  const { error: sessionError } = await supabase
    .from("sessions")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      score: submittedScore ?? 0,
    })
    .eq("id", sessionId);

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

  if (session.status === "completed" || session.status === "timed-out") {
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
    .eq("id", sessionId);

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
