"use server";

import { Quiz, QuizSession, Question, TeacherAccount } from "./types";

let quizzes: Quiz[] = [];

let sessions: QuizSession[] = [];

let teachers: TeacherAccount[] = [
  {
    id: "teacher-1",
    name: "Demo Teacher",
    email: "teacher@sentriq.com",
    password: "sentriq123",
  },
];

function generateCode(length: number = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

async function generateUniqueQuizCode(): Promise<string> {
  let code = generateCode();

  while (quizzes.some((quiz) => quiz.code === code)) {
    code = generateCode();
  }

  return code;
}

export async function teacherLogin(
  email: string,
  password: string
): Promise<{ id: string; name: string; email: string }> {
  const existing = teachers.find(
    (teacher) => teacher.email.toLowerCase() === email.toLowerCase()
  );

  if (!existing || existing.password !== password) {
    throw new Error("Invalid email or password");
  }

  return {
    id: existing.id,
    name: existing.name,
    email: existing.email,
  };
}

export async function createQuiz(
  title: string,
  description: string,
  teacherId: string
): Promise<Quiz> {
  const quiz: Quiz = {
    id: Date.now().toString(),
    title,
    description,
    questions: [],
    code: await generateUniqueQuizCode(),
    createdAt: new Date(),
    createdBy: teacherId,
    published: false,
    status: "draft",
  };

  quizzes.push(quiz);

  return quiz;
}

export async function updateQuiz(
  quizId: string,
  title: string,
  description: string,
  questions: Question[]
): Promise<Quiz> {
  const index = quizzes.findIndex((quiz) => quiz.id === quizId);

  if (index === -1) {
    throw new Error("Quiz not found");
  }

  const updatedQuiz: Quiz = {
    ...quizzes[index],
    title,
    description,
    questions,
  };

  quizzes[index] = updatedQuiz;

  return updatedQuiz;
}

export async function saveQuizQuestion(
  quizId: string,
  question: Question
): Promise<Quiz> {
  const index = quizzes.findIndex((quiz) => quiz.id === quizId);

  if (index === -1) {
    throw new Error("Quiz not found");
  }

  const updatedQuiz: Quiz = {
    ...quizzes[index],
    questions: [...quizzes[index].questions, question],
  };

  quizzes[index] = updatedQuiz;

  return updatedQuiz;
}

export async function deleteQuestion(
  quizId: string,
  questionId: string
): Promise<Quiz> {
  const index = quizzes.findIndex((quiz) => quiz.id === quizId);

  if (index === -1) {
    throw new Error("Quiz not found");
  }

  const updatedQuiz: Quiz = {
    ...quizzes[index],
    questions: quizzes[index].questions.filter(
      (question) => question.id !== questionId
    ),
  };

  quizzes[index] = updatedQuiz;

  return updatedQuiz;
}

export async function publishQuiz(quizId: string): Promise<Quiz> {
  const index = quizzes.findIndex((quiz) => quiz.id === quizId);

  if (index === -1) {
    throw new Error("Quiz not found");
  }

  const updatedQuiz: Quiz = {
    ...quizzes[index],
    published: true,
    status: "published",
  };

  quizzes[index] = updatedQuiz;

  return updatedQuiz;
}

export async function getTeacherQuizzes(teacherId: string): Promise<Quiz[]> {
  return quizzes.filter((quiz) => quiz.createdBy === teacherId);
}

export async function getQuizById(quizId: string): Promise<Quiz | null> {
  return quizzes.find((quiz) => quiz.id === quizId) ?? null;
}

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

  const session: QuizSession = {
    id: Date.now().toString(),
    quizId: quiz.id,
    studentName,
    studentId: `student-${Date.now()}`,
    startedAt: new Date(),
    currentQuestion: 0,
    answers: {},
    tabSwitches: 0,
    events: [
      {
        type: "started",
        timestamp: new Date(),
      },
    ],
    status: "in-progress",
  };

  sessions.push(session);

  return {
    session,
    quiz,
  };
}

export async function getQuizSessions(quizId: string): Promise<QuizSession[]> {
  return sessions.filter((session) => session.quizId === quizId);
}

export async function recordTabSwitch(sessionId: string): Promise<void> {
  const session = sessions.find((session) => session.id === sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  session.tabSwitches += 1;

  session.events.push({
    type: "tab-left",
    timestamp: new Date(),
  });
}

export async function updateSessionAnswer(
  sessionId: string,
  questionIndex: number,
  answerIndex: number
): Promise<void> {
  const session = sessions.find((session) => session.id === sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  session.answers[questionIndex] = answerIndex;
  session.currentQuestion = Math.max(session.currentQuestion, questionIndex);
}

export async function completeSession(
  sessionId: string
): Promise<QuizSession> {
  const session = sessions.find((session) => session.id === sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  const quiz = quizzes.find((quiz) => quiz.id === session.quizId);

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  let score = 0;

  for (let i = 0; i < quiz.questions.length; i++) {
    if (session.answers[i] === quiz.questions[i].correctAnswer) {
      score += 1;
    }
  }

  session.status = "completed";
  session.completedAt = new Date();
  session.score = score;

  session.events.push({
    type: "completed",
    timestamp: new Date(),
  });

  return session;
}

export async function getSessionById(
  sessionId: string
): Promise<QuizSession | null> {
  return sessions.find((session) => session.id === sessionId) ?? null;
}

export async function getAllQuizzesWithSessions() {
  return quizzes.map((quiz) => ({
    ...quiz,
    sessions: sessions.filter((session) => session.quizId === quiz.id),
  }));
}