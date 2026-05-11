"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  X,
} from "lucide-react";

import AppLogo from "@/components/shared/AppLogo";
import { cn } from "@/lib/utils";

type Props = {
  teacherName?: string;
  open?: boolean;
  onClose?: () => void;
  onLogout: () => void;
  onDashboard: () => void;
  onDrafts: () => void;
  onNewQuiz: () => void;
  activePage?: "dashboard" | "quiz-builder" | "drafts";
};

const mainNavButtonClass =
  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition";

const subNavButtonClass =
  "flex w-full items-center rounded-xl px-3 py-2 text-sm transition";

export default function QuizBuilderSidebar({
  teacherName,
  open = false,
  onClose,
  onLogout,
  onDashboard,
  onDrafts,
  onNewQuiz,
  activePage = "quiz-builder",
}: Props) {
  const isQuizActive =
    activePage === "quiz-builder" || activePage === "drafts";

  const [builderOpen, setBuilderOpen] = useState(isQuizActive);

  useEffect(() => {
    if (isQuizActive) setBuilderOpen(true);
  }, [isQuizActive]);

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
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
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="space-y-2">
          <button
            type="button"
            onClick={onDashboard}
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
                  onClick={onDrafts}
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
                  onClick={onNewQuiz}
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
            onClick={onLogout}
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