"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Eye,
  FilePlus2,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PencilLine,
  ShieldCheck,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import AppLogo from "@/components/shared/AppLogo";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/shared/utils";
import type { Quiz } from "@/lib/shared/types";
import SidebarButton from "./SidebarButton";
import SidebarSection from "./SidebarSection";

type ActivePage = "dashboard" | "quiz-builder" | "drafts" | "monitor";

type Props = {
  teacherName?: string;
  isAdmin?: boolean;
  quizzes?: Quiz[];
  activePage?: ActivePage;
  activeQuizId?: string;
  open?: boolean;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onClose?: () => void;
  onLogout: () => void;
  onNewQuiz?: () => void;
  onNavigateRequest?: (path: string) => void;
};

export default function TeacherAppSidebar({
  teacherName,
  isAdmin = false,
  quizzes = [],
  activePage = "dashboard",
  activeQuizId,
  open = false,
  collapsed = false,
  onToggleCollapsed,
  onClose,
  onLogout,
  onNewQuiz,
  onNavigateRequest,
}: Props) {
  const router = useRouter();

  const isQuizActive = activePage === "quiz-builder" || activePage === "drafts";
  const isMonitorActive = activePage === "monitor";

  const [builderOpen, setBuilderOpen] = useState(isQuizActive);
  const [monitorOpen, setMonitorOpen] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const liveQuizzes = quizzes.filter((quiz) => quiz.published);
  const isCollapsed = collapsed && !open;

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
    setLogoutOpen(false);
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
          "fixed left-0 top-0 flex h-screen flex-col border-r border-white/10 py-5 text-white transition-[width] duration-300",
          open
            ? "z-50 w-[88%] max-w-sm bg-slate-950/95 px-5 shadow-2xl backdrop-blur-2xl lg:hidden"
            : cn(
                "z-40 hidden bg-slate-950/60 backdrop-blur-xl lg:flex",
                isCollapsed ? "w-20 px-3" : "w-64 px-4",
              ),
        )}
      >
        <div
          className={cn(
            "mb-6 flex shrink-0 items-center",
            isCollapsed ? "justify-center" : "justify-between",
          )}
        >
          {isCollapsed ? (
            <button
              type="button"
              title="Open sidebar"
              aria-label="Open sidebar"
              onClick={onToggleCollapsed}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10"
            >
              <Menu className="h-5 w-5 text-slate-200" />
            </button>
          ) : (
            <>
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src="/logoo.png"
                    alt="SentriQ Logo"
                    fill
                    sizes="40px"
                    className="object-contain"
                    priority
                  />
                </div>

                <AppLogo className="text-xl" />
              </div>

              {open ? (
                <button
                  type="button"
                  aria-label="Close sidebar"
                  onClick={closeSidebar}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  title="Collapse sidebar"
                  aria-label="Collapse sidebar"
                  onClick={onToggleCollapsed}
                  className="hidden rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:inline-flex"
                >
                  <Menu className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>

        <ScrollArea className="min-h-0 flex-1 pr-2">
          <nav className="space-y-2 pb-4">
            <SidebarButton
              icon={LayoutDashboard}
              active={activePage === "dashboard"}
              onClick={() => navigate("/teacher/dashboard")}
              collapsed={isCollapsed}
              title="Dashboard"
            >
              Dashboard
            </SidebarButton>

            {isCollapsed ? (
              <>
                <div className="group relative">
                  <SidebarButton
                    icon={FileText}
                    active={isQuizActive}
                    collapsed={isCollapsed}
                    title="Quiz Builder"
                  >
                    Quiz Builder
                  </SidebarButton>

                  <div className="invisible absolute left-full top-0 z-[90] ml-3 w-52 translate-x-2 rounded-2xl border border-white/10 bg-slate-950/95 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition group-hover:visible group-hover:translate-x-0 group-hover:opacity-100">
                    <p className="px-3 py-2 text-xs font-semibold text-slate-500">
                      Quiz Builder
                    </p>

                    <SidebarButton
                      sidebarVariant="sub"
                      icon={PencilLine}
                      active={activePage === "drafts"}
                      onClick={() => navigate("/teacher/drafts")}
                    >
                      Drafts
                    </SidebarButton>

                    <SidebarButton
                      sidebarVariant="sub"
                      icon={FilePlus2}
                      active={activePage === "quiz-builder"}
                      onClick={createNewQuiz}
                    >
                      Create New
                    </SidebarButton>
                  </div>
                </div>

                <div className="group relative">
                  <SidebarButton
                    icon={Eye}
                    active={isMonitorActive}
                    collapsed={isCollapsed}
                    title="Live Monitor"
                  >
                    Live Monitor
                  </SidebarButton>

                  <div className="invisible absolute left-full top-0 z-[90] ml-3 w-56 translate-x-2 rounded-2xl border border-white/10 bg-slate-950/95 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition group-hover:visible group-hover:translate-x-0 group-hover:opacity-100">
                    <p className="px-3 py-2 text-xs font-semibold text-slate-500">
                      Live Monitor
                    </p>

                    {liveQuizzes.length === 0 ? (
                      <p className="rounded-xl px-3 py-2 text-xs text-slate-500">
                        No published quizzes yet.
                      </p>
                    ) : (
                      liveQuizzes.map((quiz) => (
                        <SidebarButton
                          key={quiz.id}
                          sidebarVariant="sub"
                          active={activeQuizId === quiz.id}
                          onClick={() =>
                            navigate(`/teacher/quiz/${quiz.id}/monitor`)
                          }
                        >
                          <span className="block max-w-[150px] truncate text-left">
                            {quiz.title}
                          </span>
                        </SidebarButton>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
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
                    className={
                      activePage !== "quiz-builder" ? "text-cyan-200" : ""
                    }
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
                          className={
                            activeQuizId !== quiz.id ? "text-cyan-200" : ""
                          }
                        >
                          <span
                            title={quiz.title}
                            className="block w-full max-w-[145px] overflow-hidden truncate whitespace-nowrap text-left"
                          >
                            {quiz.title}
                          </span>
                        </SidebarButton>
                      ))}
                    </div>
                  )}
                </SidebarSection>
              </>
            )}
          </nav>
        </ScrollArea>

        <div className="mt-4 shrink-0 space-y-3">
          {isAdmin && (
            <SidebarButton
              icon={ShieldCheck}
              onClick={() => navigate("/admin/dashboard")}
              collapsed={isCollapsed}
              title="Switch to Admin View"
              className="border border-violet-400/20 bg-violet-500/10 text-violet-100 hover:bg-violet-500/20"
            >
              Switch to Admin View
            </SidebarButton>
          )}

          {!isCollapsed && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
                  T
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    Teacher
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {teacherName || "teacher@email.com"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <SidebarButton
            sidebarVariant="logout"
            icon={LogOut}
            onClick={() => setLogoutOpen(true)}
            collapsed={isCollapsed}
            title="Logout"
          >
            Logout
          </SidebarButton>
        </div>
      </aside>

      <ConfirmDialog
        open={logoutOpen}
        title="Logout?"
        description="Are you sure you want to logout from your teacher account?"
        confirmText="Logout"
        confirmVariant="destructive"
        onOpenChange={setLogoutOpen}
        onConfirm={handleLogout}
      />
    </>
  );
}