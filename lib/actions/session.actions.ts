"use server";

import { quizzes, sessions } from "../data/mock-db";
import type {
  Quiz,
  QuizSession,
  ReportVisibility,
  SessionEventType,
} from "@/lib/types";

export async function joinQuiz(
  studentName: string,
  quizCode: string
): Promise<{ session: QuizSession; quiz: Quiz }> {
  const quiz = quizzes.find(
    (quiz) => quiz.code === quizCode && quiz.published
  );

  if (!quiz) {
    throw new Error("Quiz code not found or quiz not published");
  }

  const now = new Date();

  const session: QuizSession = {
    id: Date.now().toString(),
    quizId: quiz.id,
    studentName,
    studentId: `student-${Date.now()}`,
    startedAt: now,
    currentQuestion: 0,
    answers: {},
    tabSwitches: 0,
    events: [
      {
        type: "join-requested",
        timestamp: now,
        description: `${studentName} requested to join the quiz.`,
      },
    ],
    status: "in-progress",
    approvalStatus: "pending",
    reportVisibility: "locked",
  };

  sessions.push(session);

  return { session, quiz };
}

export async function getSessionById(
  sessionId: string
): Promise<QuizSession | null> {
  return sessions.find((session) => session.id === sessionId) ?? null;
}

export async function recordSessionEvent(
  sessionId: string,
  event: {
    type: SessionEventType;
    description?: string;
    durationSeconds?: number;
  }
): Promise<QuizSession> {
  const session = sessions.find((session) => session.id === sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.approvalStatus !== "approved") {
    return session;
  }

  session.events.push({
    type: event.type,
    timestamp: new Date(),
    description: event.description,
    durationSeconds: event.durationSeconds,
  });

  if (event.type === "tab-left") {
    session.tabSwitches += 1;
  }

  return session;
}

export async function recordTabSwitch(sessionId: string): Promise<void> {
  await recordSessionEvent(sessionId, {
    type: "tab-left",
    description: "Student left the quiz tab.",
  });
}

export async function updateSessionAnswer(
  sessionId: string,
  questionIndex: number,
  answer: number | string
): Promise<QuizSession> {
  const session = sessions.find((session) => session.id === sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.approvalStatus !== "approved") {
    throw new Error("Session is not approved yet");
  }

  session.answers[questionIndex] = answer;
  session.currentQuestion = questionIndex;

  return session;
}

export async function updateSessionReportVisibility(
  sessionId: string,
  visibility: ReportVisibility
): Promise<QuizSession> {
  const session = sessions.find((session) => session.id === sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  session.reportVisibility = visibility;

  return session;
}

export async function completeSession(
  sessionId: string,
  submittedScore?: number
): Promise<QuizSession> {
  const session = sessions.find((session) => session.id === sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.approvalStatus !== "approved") {
    throw new Error("Session is not approved yet");
  }

  session.status = "completed";
  session.completedAt = new Date();
  session.score = submittedScore ?? 0;

  session.events.push({
    type: "completed",
    timestamp: new Date(),
    description: "Student submitted the quiz.",
  });

  return session;
}