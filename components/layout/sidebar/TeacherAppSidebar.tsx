"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Eye,
  FilePlus2,
  FileText,
  LayoutDashboard,
  LogOut,
  PencilLine,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import AppLogo from "@/components/shared/AppLogo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/shared/utils";
import type { Quiz } from "@/lib/shared/types";
import SidebarButton from "./SidebarButton";
import SidebarSection from "./SidebarSection";

type ActivePage = "dashboard" | "quiz-builder" | "drafts" | "monitor";

type Props = {
  teacherName?: string;
  quizzes?: Quiz[];
  activePage?: ActivePage;
  activeQuizId?: string;
  open?: boolean;
  onClose?: () => void;
  onLogout: () => void;
  onNewQuiz?: () => void;
  onNavigateRequest?: (path: string) => void;
};

export default function TeacherAppSidebar({
  teacherName,
  quizzes = [],
  activePage = "dashboard",
  activeQuizId,
  open = false,
  onClose,
  onLogout,
  onNewQuiz,
  onNavigateRequest,
}: Props) {
  const router = useRouter();

  const isQuizActive =
    activePage === "quiz-builder" || activePage === "drafts";
  const isMonitorActive = activePage === "monitor";

  const [builderOpen, setBuilderOpen] = useState(isQuizActive);
  const [monitorOpen, setMonitorOpen] = useState(true);

  const liveQuizzes = quizzes.filter((quiz) => quiz.published);

  useEffect(() => {
    if (isQuizActive) setBuilderOpen(true);
  }, [isQuizActive]);

  useEffect(() => {
    if (isMonitorActive) setMonitorOpen(true);
  }, [isMonitorActive]);

  function closeSidebar() {
    onClose?.();
  }

  function navigate(path: string) {
    if (onNavigateRequest) {
      onNavigateRequest(path);
      closeSidebar();
      return;
    }

    router.push(path);
    closeSidebar();
  }

  function createNewQuiz() {
    onNewQuiz?.();
    closeSidebar();
  }

  function handleLogout() {
    onLogout();
    closeSidebar();
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 flex h-screen flex-col border-r border-white/10 px-5 py-5 text-white",
          open
            ? "z-50 w-full bg-slate-950/95 shadow-2xl backdrop-blur-2xl lg:hidden"
            : "z-40 hidden w-64 bg-slate-950/60 px-4 backdrop-blur-xl lg:flex"
        )}
      >
        <div className="mb-6 flex shrink-0 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl">
              <Image
                src="/logo.png"
                alt="SentriQ Logo"
                fill
                sizes="36px"
                className="object-contain"
                priority
              />
            </div>

            <AppLogo className="text-xl" />
          </div>

          {open && (
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={closeSidebar}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <ScrollArea className="min-h-0 flex-1 pr-2">
          <nav className="space-y-2 pb-4">
            <SidebarButton
              icon={LayoutDashboard}
              active={activePage === "dashboard"}
              onClick={() => navigate("/teacher/dashboard")}
            >
              Dashboard
            </SidebarButton>

            <SidebarSection
              title="Quiz Builder"
              icon={FileText}
              active={isQuizActive}
              open={builderOpen}
              onToggle={() => setBuilderOpen((prev) => !prev)}
            >
              <SidebarButton
                sidebarVariant="sub"
                icon={PencilLine}
                active={activePage === "drafts"}
                onClick={() => navigate("/teacher/drafts")}
                className={activePage !== "drafts" ? "text-violet-200" : ""}
              >
                Drafts
              </SidebarButton>

              <SidebarButton
                sidebarVariant="sub"
                icon={FilePlus2}
                active={activePage === "quiz-builder"}
                onClick={createNewQuiz}
                className={activePage !== "quiz-builder" ? "text-cyan-200" : ""}
              >
                Create New
              </SidebarButton>
            </SidebarSection>

            <SidebarSection
              title="Live Monitor"
              icon={Eye}
              active={isMonitorActive}
              open={monitorOpen}
              onToggle={() => setMonitorOpen((prev) => !prev)}
              contentClassName="pl-0"
            >
              {liveQuizzes.length === 0 ? (
                <p className="rounded-xl px-3 py-2 text-xs text-slate-500">
                  No published quizzes yet.
                </p>
              ) : (
                <div className="space-y-1 pl-6">
                  {liveQuizzes.map((quiz) => (
                    <SidebarButton
                      key={quiz.id}
                      sidebarVariant="sub"
                      active={activeQuizId === quiz.id}
                      onClick={() =>
                        navigate(`/teacher/quiz/${quiz.id}/monitor`)
                      }
                      className={activeQuizId !== quiz.id ? "text-cyan-200" : ""}
                    >
                      <span className="truncate">{quiz.title}</span>
                    </SidebarButton>
                  ))}
                </div>
              )}
            </SidebarSection>
          </nav>
        </ScrollArea>

        <div className="mt-4 shrink-0 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
                {teacherName?.charAt(0)?.toUpperCase() || "T"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {teacherName || "Teacher"}
                </p>
                <p className="text-xs text-slate-500">Teacher Account</p>
              </div>
            </div>
          </div>

          <SidebarButton
            sidebarVariant="logout"
            icon={LogOut}
            onClick={handleLogout}
          >
            Logout
          </SidebarButton>
        </div>
      </aside>
    </>
  );
}