"use server";

import { sessions } from "../data/mock-db";
import type { QuizSession } from "@/lib/types";

export async function getQuizSessions(
  quizId: string
): Promise<QuizSession[]> {
  return sessions.filter((session) => session.quizId === quizId);
}

export async function approveSession(
  sessionId: string
): Promise<QuizSession> {
  const session = sessions.find(
    (session) => session.id === sessionId
  );

  if (!session) {
    throw new Error("Session not found");
  }

  session.approvalStatus = "approved";

  session.events.push({
    type: "approved",
    timestamp: new Date(),
    description: "Teacher approved the join request.",
  });

  return session;
}

export async function rejectSession(
  sessionId: string
): Promise<QuizSession> {
  const session = sessions.find(
    (session) => session.id === sessionId
  );

  if (!session) {
    throw new Error("Session not found");
  }

  session.approvalStatus = "rejected";

  session.events.push({
    type: "rejected",
    timestamp: new Date(),
    description: "Teacher rejected the join request.",
  });

  return session;
}

export async function getSessionViolations(
  sessionId: string
) {
  const session = sessions.find(
    (session) => session.id === sessionId
  );

  if (!session) {
    throw new Error("Session not found");
  }

  const tabLeft = session.events.filter(
    (event) => event.type === "tab-left"
  ).length;

  const fullscreenExit = session.events.filter(
    (event) => event.type === "fullscreen-exit"
  ).length;

  const copyAttempt = session.events.filter(
    (event) => event.type === "copy-attempt"
  ).length;

  const pasteAttempt = session.events.filter(
    (event) => event.type === "paste-attempt"
  ).length;

  return {
    tabLeft,
    fullscreenExit,
    copyAttempt,
    pasteAttempt,
    total:
      tabLeft +
      fullscreenExit +
      copyAttempt +
      pasteAttempt,
  };
}