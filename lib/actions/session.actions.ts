"use server";

import {
  completeSessionService,
  getSessionByIdService,
  joinQuizService,
  recordSessionEventService,
  updateSessionAnswerService,
  updateSessionReportVisibilityService,
} from "@/lib/services/session.service";

import type { ReportVisibility, SessionEventType } from "@/lib/shared/types";

export async function joinQuiz(studentName: string, quizCode: string) {
  return joinQuizService(studentName, quizCode);
}

export async function getSessionById(sessionId: string) {
  return getSessionByIdService(sessionId);
}

export async function recordSessionEvent(
  sessionId: string,
  event: {
    type: SessionEventType;
    description?: string;
    durationSeconds?: number;
  }
) {
  return recordSessionEventService(sessionId, event);
}

export async function recordTabSwitch(sessionId: string) {
  return recordSessionEventService(sessionId, {
    type: "tab-left",
    description: "Student left the quiz tab.",
  });
}

export async function updateSessionAnswer(
  sessionId: string,
  questionIndex: number,
  answer: number | string
) {
  return updateSessionAnswerService(sessionId, questionIndex, answer);
}

export async function updateSessionReportVisibility(
  sessionId: string,
  visibility: ReportVisibility
) {
  return updateSessionReportVisibilityService(sessionId, visibility);
}

export async function completeSession(sessionId: string, submittedScore?: number) {
  return completeSessionService(sessionId, submittedScore);
}