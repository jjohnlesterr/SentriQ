export type QuestionType = "multiple_choice" | "true_false" | "identification";

export type Question = {
  id: string;
  type: QuestionType;
  text: string;
  hint?: string;
  options: string[];
  correctAnswer: number;
  correctTextAnswer?: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  code: string;
  createdAt: Date;
  createdBy: string;
  published: boolean;
  status: "draft" | "published";
  timeLimitMinutes?: number | null;
};

export type SessionEventType =
  | "join-requested"
  | "approved"
  | "rejected"
  | "started"
  | "tab-left"
  | "tab-returned"
  | "fullscreen-exit"
  | "copy-attempt"
  | "paste-attempt"
  | "answered-question"
  | "completed"
  | "time-expired";

export type SessionEvent = {
  type: SessionEventType;
  timestamp: Date | string;
  description?: string;
  durationSeconds?: number;
};

export type ReportVisibility = "locked" | "summary" | "full";

export type QuizSession = {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  startedAt: Date | string;
  completedAt?: Date | string;
  timedOutAt?: Date | string;
  currentQuestion: number;
  answers: Record<number, number | string>;
  tabSwitches: number;
  events: SessionEvent[];
  score?: number;
  status: "in-progress" | "completed" | "timed-out";
  approvalStatus: "pending" | "approved" | "rejected";
  reportVisibility: ReportVisibility;
};

export type TeacherAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
};
