"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  Eye,
  FileText,
  LayoutDashboard,
  LogOut,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import AppLogo from "@/components/shared/AppLogo";
import { cn } from "@/lib/utils";
import type { Quiz } from "@/lib/types";

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
};

const mainNavButtonClass =
  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition";

const subNavButtonClass =
  "flex w-full items-center rounded-xl px-3 py-2 text-sm transition";

export default function TeacherAppSidebar({
  teacherName,
  quizzes = [],
  activePage = "dashboard",
  activeQuizId,
  open = false,
  onClose,
  onLogout,
  onNewQuiz,
}: Props) {
  const router = useRouter();

  const isQuizActive =
    activePage === "quiz-builder" || activePage === "drafts";

  const isMonitorActive = activePage === "monitor";

  const [builderOpen, setBuilderOpen] = useState(isQuizActive);
  const [monitorOpen, setMonitorOpen] = useState(true);

  const liveQuizzes = quizzes.filter((quiz) => quiz.published);

  useEffect(() => {
    if (isQuizActive) {
      setBuilderOpen(true);
    }
  }, [isQuizActive]);

  useEffect(() => {
    if (isMonitorActive) {
      setMonitorOpen(true);
    }
  }, [isMonitorActive, activeQuizId]);

  function closeSidebar() {
    onClose?.();
  }

  function goDashboard() {
    router.push("/teacher/dashboard");
    closeSidebar();
  }

  function goDrafts() {
    router.push("/teacher/drafts");
    closeSidebar();
  }

  function createNew() {
    onNewQuiz?.();
    closeSidebar();
  }

  function goMonitor(quizId: string) {
    router.push(`/teacher/quiz/${quizId}/monitor`);
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
          "fixed left-0 top-0 flex h-screen flex-col border-r border-white/10 px-4 py-5 text-white",
          open
            ? "z-50 w-72 bg-slate-950/95 shadow-2xl backdrop-blur-2xl lg:hidden"
            : "z-40 hidden w-64 bg-slate-950/60 backdrop-blur-xl lg:flex"
        )}
      >
        <div className="mb-8 flex items-center justify-between">
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

        <nav className="space-y-2">
          <button
            type="button"
            onClick={goDashboard}
            className={cn(
              mainNavButtonClass,
              activePage === "dashboard"
                ? "bg-white/10 text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>

          <div
            className={cn(
              "rounded-2xl p-2",
              isQuizActive
                ? "border border-cyan-400/20 bg-cyan-500/10"
                : "transition hover:bg-white/[0.03]"
            )}
          >
            <button
              type="button"
              onClick={() => setBuilderOpen((prev) => !prev)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition",
                isQuizActive
                  ? "text-white"
                  : "text-slate-300 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4" />
                Quiz Builder
              </div>

              <ChevronDown
                className={cn(
                  "h-4 w-4 transition",
                  builderOpen && "rotate-180"
                )}
              />
            </button>

            {builderOpen && (
              <div className="mt-2 space-y-1 pl-9">
                <button
                  type="button"
                  onClick={goDrafts}
                  className={cn(
                    subNavButtonClass,
                    activePage === "drafts"
                      ? "bg-white/10 font-semibold text-white"
                      : "font-medium text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  Drafts
                </button>

                <button
                  type="button"
                  onClick={createNew}
                  className={cn(
                    subNavButtonClass,
                    activePage === "quiz-builder"
                      ? "bg-white/10 font-semibold text-white"
                      : "font-medium text-cyan-200 hover:bg-white/10 hover:text-white"
                  )}
                >
                  Create New
                </button>
              </div>
            )}
          </div>

          <div
            className={cn(
              "rounded-2xl p-2",
              isMonitorActive
                ? "border border-cyan-400/20 bg-cyan-500/10"
                : "transition hover:bg-white/[0.03]"
            )}
          >
            <button
              type="button"
              onClick={() => setMonitorOpen((prev) => !prev)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition",
                isMonitorActive
                  ? "text-white"
                  : "text-slate-300 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4" />
                Live Monitor
              </div>

              <ChevronDown
                className={cn(
                  "h-4 w-4 transition",
                  monitorOpen && "rotate-180"
                )}
              />
            </button>

            {monitorOpen && (
              <div className="mt-2 max-h-56 space-y-1 overflow-y-auto pl-9 pr-1">
                {liveQuizzes.length === 0 ? (
                  <p className="rounded-xl px-3 py-2 text-xs text-slate-500">
                    No published quizzes yet.
                  </p>
                ) : (
                  liveQuizzes.map((quiz) => (
                    <button
                      key={quiz.id}
                      type="button"
                      onClick={() => goMonitor(quiz.id)}
                      className={cn(
                        subNavButtonClass,
                        activeQuizId === quiz.id
                          ? "bg-white/10 font-semibold text-white"
                          : "font-medium text-cyan-200 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <span className="truncate">{quiz.title}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </nav>

        <div className="mt-auto space-y-3">
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

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}