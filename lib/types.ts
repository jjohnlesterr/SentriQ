export type QuestionType = "multiple_choice" | "true_false" | "identification";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;

  // For multiple choice and true/false
  options: string[];
  correctAnswer: number;

  // For identification
  correctTextAnswer?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  code: string;
  createdAt: Date;
  createdBy: string;
  published: boolean;
  status?: "draft" | "published" | "active";
}

export interface QuizSession {
  id: string;
  quizId: string;
  studentName: string;
  studentId: string;
  startedAt: Date;
  completedAt?: Date;
  currentQuestion: number;

  // number = multiple choice / true-false answer index
  // string = identification answer
  answers: Record<number, number | string>;

  score?: number;
  tabSwitches: number;
  events: SessionEvent[];
  status: "in-progress" | "completed";
}

export interface SessionEvent {
  type: "tab-left" | "tab-returned" | "started" | "completed";
  timestamp: Date;
  description?: string;
}

export interface TeacherAccount {
  id: string;
  email: string;
  name: string;
  password?: string;
}

export interface AppState {
  currentUser: {
    id: string;
    name: string;
    role: "teacher" | "student";
    email?: string;
  } | null;
  quizzes: Quiz[];
  sessions: QuizSession[];
  currentQuiz: Quiz | null;
  currentSession: QuizSession | null;
}