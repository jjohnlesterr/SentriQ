export type QuestionType = "multiple_choice" | "true_false" | "identification";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;

  options: string[];
  correctAnswer: number;

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

export type SessionApprovalStatus = "pending" | "approved" | "rejected";

export interface QuizSession {
  id: string;
  quizId: string;
  studentName: string;
  studentId: string;
  startedAt: Date;
  completedAt?: Date;
  currentQuestion: number;

  answers: Record<number, number | string>;

  score?: number;
  tabSwitches: number;
  events: SessionEvent[];

  status: "in-progress" | "completed";
  approvalStatus: SessionApprovalStatus;
}

export interface SessionEvent {
  type:
    | "join-requested"
    | "approved"
    | "rejected"
    | "tab-left"
    | "tab-returned"
    | "started"
    | "completed";
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