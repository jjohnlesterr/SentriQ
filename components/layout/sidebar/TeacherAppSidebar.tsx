"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Eye,
  FilePlus2,
  FileText,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  PencilLine,
  ShieldCheck,
  X,
} from "lucide-react";

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

  const isQuizActive =
    activePage === "quiz-builder" || activePage === "drafts";

  const isMonitorActive = activePage === "monitor";

  const [builderOpen, setBuilderOpen] = useState(isQuizActive);
  const [monitorOpen, setMonitorOpen] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const liveQuizzes = quizzes.filter((quiz) => quiz.published);
  const isCollapsed = collapsed && !open;

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
      {/* MOBILE OVERLAY */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 cursor-pointer bg-black/60 backdrop-blur-sm lg:hidden"
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
        {/* SIDEBAR HEADER */}
        <div
          className={cn(
            "mb-6 flex h-12 shrink-0 items-center",
            isCollapsed ? "justify-center" : "justify-between",
          )}
        >
          {isCollapsed ? (
            /* COLLAPSED LOGO / OPEN BUTTON */
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label="Open sidebar"
              title="Open sidebar"
              className="group relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl transition hover:bg-white/10"
            >
              <span className="relative h-11 w-11 transition group-hover:scale-90 group-hover:opacity-0">
                <Image
                  src="/logoo.png"
                  alt="SentriQ Logo"
                  fill
                  sizes="44px"
                  className="object-contain"
                  priority
                />
              </span>

              <PanelLeftOpen className="absolute h-5 w-5 scale-75 text-slate-300 opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
            </button>
          ) : (
            <>
              {/* EXPANDED LOGO */}
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

                <AppLogo className="truncate text-xl" />
              </div>

              {/* MOBILE CLOSE OR DESKTOP COLLAPSE */}
              {open ? (
                <button
                  type="button"
                  onClick={closeSidebar}
                  aria-label="Close sidebar"
                  title="Close sidebar"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onToggleCollapsed}
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                  className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white lg:flex"
                >
                  <PanelLeftClose className="h-5 w-5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* NAVIGATION */}
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
                {/* COLLAPSED QUIZ BUILDER */}
                <div className="group relative">
                  <SidebarButton
                    icon={FileText}
                    active={isQuizActive}
                    collapsed
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

                {/* COLLAPSED LIVE MONITOR */}
                <div className="group relative">
                  <SidebarButton
                    icon={Eye}
                    active={isMonitorActive}
                    collapsed
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
                          <span
                            title={quiz.title}
                            className="block max-w-[150px] truncate text-left"
                          >
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
                {/* EXPANDED QUIZ BUILDER */}
                <SidebarSection
                  title="Quiz Builder"
                  icon={FileText}
                  active={isQuizActive}
                  open={builderOpen || isQuizActive}
                  onToggle={() => setBuilderOpen((current) => !current)}
                >
                  <SidebarButton
                    sidebarVariant="sub"
                    icon={PencilLine}
                    active={activePage === "drafts"}
                    onClick={() => navigate("/teacher/drafts")}
                    className={
                      activePage !== "drafts" ? "text-violet-200" : ""
                    }
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

                {/* EXPANDED LIVE MONITOR */}
                <SidebarSection
                  title="Live Monitor"
                  icon={Eye}
                  active={isMonitorActive}
                  open={monitorOpen || isMonitorActive}
                  onToggle={() => setMonitorOpen((current) => !current)}
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
                            className="block w-full max-w-[145px] truncate whitespace-nowrap text-left"
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

        {/* BOTTOM SECTION */}
        <div className="mt-4 shrink-0 space-y-3">
          {/* ADMIN SWITCH */}
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

          {/* TEACHER PROFILE */}
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

                  <p
                    title={teacherName}
                    className="truncate text-xs text-slate-500"
                  >
                    {teacherName || "teacher@email.com"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LOGOUT */}
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