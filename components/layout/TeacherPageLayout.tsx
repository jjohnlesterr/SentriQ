import type { ReactNode } from "react";

import PageShell from "@/components/layout/PageShell";
import TeacherAppSidebar from "@/components/layout/sidebar/TeacherAppSidebar";
import type { Quiz } from "@/lib/shared/types";

type ActivePage = "dashboard" | "quiz-builder" | "drafts" | "monitor";

type TeacherPageLayoutProps = {
  children: ReactNode;
  teacherName: string;
  quizzes?: Quiz[];
  activePage?: ActivePage;
  activeQuizId?: string;
  sidebarOpen?: boolean;
  onCloseSidebar?: () => void;
  onLogout: () => void;
  onNewQuiz?: () => void;
};

export default function TeacherPageLayout({
  children,
  teacherName,
  quizzes = [],
  activePage = "dashboard",
  activeQuizId,
  sidebarOpen = false,
  onCloseSidebar,
  onLogout,
  onNewQuiz,
}: TeacherPageLayoutProps) {
  return (
    <PageShell>
      <TeacherAppSidebar
        teacherName={teacherName}
        quizzes={quizzes}
        activePage={activePage}
        activeQuizId={activeQuizId}
        open={sidebarOpen}
        onClose={onCloseSidebar}
        onLogout={onLogout}
        onNewQuiz={onNewQuiz}
      />

      <main className="min-h-screen lg:pl-64">{children}</main>
    </PageShell>
  );
}