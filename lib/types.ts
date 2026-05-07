export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
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
  status?: 'draft' | 'published' | 'active';
}

export interface QuizSession {
  id: string;
  quizId: string;
  studentName: string;
  studentId: string;
  startedAt: Date;
  completedAt?: Date;
  currentQuestion: number;
  answers: Record<number, number>;
  score?: number;
  tabSwitches: number;
  events: SessionEvent[];
  status: 'in-progress' | 'completed';
}

export interface SessionEvent {
  type: 'tab-left' | 'tab-returned' | 'started' | 'completed';
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
    role: 'teacher' | 'student';
    email?: string;
  } | null;
  quizzes: Quiz[];
  sessions: QuizSession[];
  currentQuiz: Quiz | null;
  currentSession: QuizSession | null;
}
