import type { Quiz, QuizSession, TeacherAccount } from "@/lib/shared/types";

export const quizzes: Quiz[] = [];

export const sessions: QuizSession[] = [];

export const teachers: TeacherAccount[] = [
  {
    id: "teacher-1",
    name: "Demo Teacher",
    email: "teacher@sentriq.com",
    password: "sentriq123",
  },
];