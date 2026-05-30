"use client";

import { useEffect, useState, type ReactNode } from "react";

import PageShell from "@/components/layout/PageShell";
import TeacherAppSidebar from "@/components/layout/sidebar/TeacherAppSidebar";
import { cn } from "@/lib/shared/utils";
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const saved = localStorage.getItem("teacher-sidebar-collapsed");
      setSidebarCollapsed(saved === "true");
    });

    return () => cancelAnimationFrame(id);
  }, []);

  function toggleSidebarCollapsed() {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("teacher-sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <PageShell>
      <TeacherAppSidebar
        teacherName={teacherName}
        quizzes={quizzes}
        activePage={activePage}
        activeQuizId={activeQuizId}
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={toggleSidebarCollapsed}
        onClose={onCloseSidebar}
        onLogout={onLogout}
        onNewQuiz={onNewQuiz}
      />

      <main
        className={cn(
          "min-h-screen transition-[padding] duration-300",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64",
        )}
      >
        {children}
      </main>
    </PageShell>
  );
}